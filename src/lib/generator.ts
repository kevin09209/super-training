import { EXERCISES, getExercise } from '../data/exercises';
import { MUSCLE_LABEL, MUSCLE_MAX_EXERCISES, MUSCLE_PRIORITY, SUPERSET_PAIRS } from '../data/muscles';
import type {
  CardioBlock, Exercise, GeneratorInput, Gym, Intensity, MuscleGroup, PlannedExercise, Plan, Profile, SetPlan,
} from '../types';
import { INTENSITY, suggestLoad } from './oneRm';

/* ───────────── 隨機 ───────────── */

export type Rng = () => number;

/** mulberry32：可重現的隨機數（同 seed 產生同課表） */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ───────────── 器材過濾 ───────────── */

export function isAvailable(ex: Exercise, gym: Gym): boolean {
  return ex.equipment.every((e) => gym.equipment.includes(e));
}

/* ───────────── 單一動作的組數 / 次數 / 重量 ───────────── */

const GENERAL_WARMUP_SEC = 5 * 60;
const SETUP_SEC = 20;
const SEC_PER_REP = 3;

function repsFor(ex: Exercise, intensity: Intensity): [number, number] {
  const cfg = INTENSITY[intensity];
  if (ex.type === 'compound') return cfg.compoundReps;
  return cfg.isoReps;
}

function isTimed(ex: Exercise): boolean {
  return ['plank', 'side_plank', 'farmers_carry'].includes(ex.id);
}

export function buildPlannedExercise(
  ex: Exercise,
  intensity: Intensity,
  profile: Profile,
  opts: { main?: boolean; supersetGroup?: string; sets?: number } = {},
): PlannedExercise {
  const cfg = INTENSITY[intensity];
  const compound = ex.type === 'compound';
  const sets = opts.sets ?? (compound ? cfg.compoundSets : cfg.isoSets);
  const pct = compound ? cfg.compoundPct : cfg.isoPct;
  const [repLo, repHi] = repsFor(ex, intensity);
  const load = suggestLoad(ex, profile, pct);
  const repLabel = `${repLo}–${repHi}`;

  const work: SetPlan[] = [];
  for (let i = 0; i < sets; i++) {
    if (isTimed(ex)) {
      work.push({ reps: '—', seconds: intensity === 'high' ? 45 : 60 });
    } else if (ex.bodyweight && load.kg === undefined) {
      work.push({ reps: `${repLo}–${repHi}` });
    } else {
      work.push({ reps: repLabel, weightKg: load.kg });
    }
  }

  const warm: SetPlan[] = [];
  if (opts.main && compound) {
    const heavyEnough = load.kg !== undefined && !ex.bodyweight && load.kg >= (ex.perHand ? 12 : 30);
    if (heavyEnough) {
      const step = ex.perHand ? 2 : 2.5;
      const w = (p: number) => Math.max(step, Math.round((load.kg! * p) / step) * step);
      warm.push({ reps: 8, weightKg: w(0.5), warmup: true });
      warm.push({ reps: 5, weightKg: w(0.7), warmup: true });
      if (intensity === 'high') warm.push({ reps: 2, weightKg: w(0.88), warmup: true });
    } else if (ex.bodyweight && (load.kg ?? 0) >= 0) {
      // 徒手／負重主項：先做一組輕鬆的徒手熱身
      warm.push({ reps: 5, weightKg: 0, warmup: true });
    }
  }

  let restSec = compound ? cfg.restCompoundSec : cfg.restIsoSec;
  if (opts.supersetGroup) restSec = Math.round(restSec * 0.8);

  const notes: string[] = [];
  if (load.label && load.label !== `${load.kg} kg` && !load.label.startsWith('每手')) notes.push(load.label);
  if (ex.perHand && load.kg !== undefined) notes.push('每手重量');
  if (isTimed(ex)) notes.push('以秒數計');

  return {
    exerciseId: ex.id,
    sets: [...warm, ...work],
    restSec,
    rpe: cfg.rpe,
    supersetGroup: opts.supersetGroup,
    main: opts.main || undefined,
    note: notes.length ? notes.join('・') : undefined,
  };
}

/** 估算此動作花費秒數（含組間休息） */
export function exerciseSeconds(pe: PlannedExercise): number {
  return pe.sets.reduce((sum, s) => {
    const repCount = typeof s.reps === 'number' ? s.reps : parseInt(String(s.reps).split(/[–-]/)[1] ?? '10', 10) || 10;
    const work = s.seconds ?? repCount * SEC_PER_REP;
    const rest = s.warmup ? 45 : pe.restSec;
    return sum + SETUP_SEC + work + rest;
  }, 0);
}

/** 整份課表的重訓時間（秒），超級組會共用休息 */
export function strengthSeconds(exercises: PlannedExercise[]): number {
  const groups = new Map<string, PlannedExercise[]>();
  let total = 0;
  for (const pe of exercises) {
    if (pe.supersetGroup) {
      const arr = groups.get(pe.supersetGroup) ?? [];
      arr.push(pe);
      groups.set(pe.supersetGroup, arr);
    } else {
      total += exerciseSeconds(pe);
    }
  }
  for (const arr of groups.values()) {
    // 超級組：兩個動作交替，休息只算一次
    const sets = Math.max(...arr.map((p) => p.sets.filter((s) => !s.warmup).length));
    const perRound = arr.reduce((s, p) => {
      const first = p.sets.find((x) => !x.warmup);
      const repCount = first && typeof first.reps === 'number' ? first.reps : 10;
      return s + SETUP_SEC + (first?.seconds ?? repCount * SEC_PER_REP);
    }, 0);
    const rest = Math.max(...arr.map((p) => p.restSec));
    total += sets * (perRound + rest);
  }
  return total;
}

/* ───────────── 有氧 ───────────── */

export function buildCardio(
  input: GeneratorInput,
  profile: Profile,
  gym: Gym,
  rng: Rng,
  minutes: number,
): CardioBlock | undefined {
  const pool = EXERCISES.filter((e) => e.type === 'cardio' && isAvailable(e, gym));
  if (pool.length === 0 || minutes <= 0) return undefined;
  const style: CardioBlock['style'] = input.intensity === 'low' ? 'liss' : input.intensity === 'medium' ? 'intervals' : 'hiit';
  const want = style === 'liss' ? 'liss' : style === 'hiit' ? 'hiit' : 'any';
  const preferred = pool.filter((e) => e.cardioStyle === want || e.cardioStyle === 'any');
  const candidates = (preferred.length ? preferred : pool).sort((a, b) => a.tier - b.tier);
  const top = candidates.filter((e) => e.tier === candidates[0].tier);
  const ex = top[Math.floor(rng() * top.length)];
  const maxHr = 220 - profile.age;
  const z = (lo: number, hi: number) => `${Math.round(maxHr * lo)}–${Math.round(maxHr * hi)} bpm`;

  if (style === 'liss') {
    return {
      exerciseId: ex.id, style, minutes,
      description: `穩定配速 ${minutes} 分鐘，維持可以說話但不能唱歌的強度（心率 ${z(0.6, 0.7)}）。`,
    };
  }
  if (style === 'intervals') {
    const rounds = Math.max(3, Math.floor((minutes - 4) / 4));
    return {
      exerciseId: ex.id, style, minutes,
      intervals: { workSec: 120, restSec: 120, rounds },
      description: `暖身 2 分鐘後，2 分鐘快（心率 ${z(0.8, 0.88)}）／2 分鐘慢，共 ${rounds} 回合，最後緩和 2 分鐘。`,
    };
  }
  const rounds = Math.max(4, Math.floor((minutes - 5) / 1.5));
  return {
    exerciseId: ex.id, style, minutes,
    intervals: { workSec: 30, restSec: 60, rounds },
    description: `暖身 3 分鐘後，30 秒全力（心率 ${z(0.88, 0.95)}）／60 秒緩和，共 ${rounds} 回合，最後緩和 2 分鐘。`,
  };
}

/* ───────────── 主要產生器 ───────────── */

const TIER_WEIGHT = { 1: 1.0, 2: 0.6, 3: 0.3 } as const;

interface Candidate {
  ex: Exercise;
  score: number;
}

function sameEquipmentFamily(a: Exercise, b: Exercise): boolean {
  const key = (e: Exercise) => [...e.equipment].sort().join('+');
  return key(a) === key(b);
}

function rankCandidates(
  pool: Exercise[],
  chosen: Exercise[],
  group: MuscleGroup,
  round: number,
  rng: Rng,
): Candidate[] {
  const chosenIds = new Set(chosen.map((e) => e.id));
  const groupChosen = chosen.filter((e) => e.primary === group);
  return pool
    .filter((e) => e.primary === group && !chosenIds.has(e.id))
    .map((e) => {
      let score = TIER_WEIGHT[e.tier] * (0.75 + rng() * 0.5);
      if (round === 0) {
        // 第一輪：優先大重量複合動作，尤其是有 1RM 資料的基準動作本身
        if (e.type === 'compound') score *= 1.6;
        if (e.load) score *= 1.2;
        if (e.load?.ratio === 1) score *= 1.6;
      } else {
        // 之後：已有複合動作就偏好孤立動作，並避開同器材的重複動作
        const hasCompound = groupChosen.some((c) => c.type === 'compound');
        if (hasCompound && e.type === 'isolation') score *= 1.3;
        if (groupChosen.some((c) => c.type === 'compound' && e.type === 'compound' && sameEquipmentFamily(c, e))) score *= 0.4;
      }
      // 若此肌群已被其他動作的次要肌群大量覆蓋，稍微降低優先
      return { ex: e, score };
    })
    .sort((a, b) => b.score - a.score);
}

function pairSupersets(
  exercises: PlannedExercise[],
  mainIds: Set<string>,
): PlannedExercise[] {
  const pairable = exercises.filter((p) => !mainIds.has(p.exerciseId) && !p.supersetGroup);
  const used = new Set<string>();
  let label = 'A'.charCodeAt(0);
  // 拮抗肌配對優先；其次允許任何「互不干擾」的兩個肌群（一方的主肌群不是另一方的次要肌群）
  const pairPriority = (a: Exercise, b: Exercise) => {
    const idx = SUPERSET_PAIRS.findIndex(([x, y]) => (x === a.primary && y === b.primary) || (x === b.primary && y === a.primary));
    if (idx !== -1) return idx;
    const competing = a.secondary.includes(b.primary) || b.secondary.includes(a.primary);
    if (competing) return 99;
    // 兩個重複合動作疊在一起太累，各扣一點
    return 50 + (a.type === 'compound' ? 5 : 0) + (b.type === 'compound' ? 5 : 0);
  };
  for (let i = 0; i < pairable.length; i++) {
    const a = pairable[i];
    if (used.has(a.exerciseId)) continue;
    const exA = getExercise(a.exerciseId);
    let best: PlannedExercise | undefined;
    let bestPri = 98;
    for (let j = i + 1; j < pairable.length; j++) {
      const b = pairable[j];
      if (used.has(b.exerciseId)) continue;
      const exB = getExercise(b.exerciseId);
      if (exA.primary === exB.primary) continue;
      const pri = pairPriority(exA, exB);
      if (pri < bestPri) {
        bestPri = pri;
        best = b;
      }
    }
    if (best) {
      const g = String.fromCharCode(label++);
      a.supersetGroup = g;
      best.supersetGroup = g;
      a.restSec = Math.round(a.restSec * 0.8);
      best.restSec = Math.round(best.restSec * 0.8);
      used.add(a.exerciseId);
      used.add(best.exerciseId);
    }
  }
  return exercises;
}

function orderPlan(exercises: PlannedExercise[], mainIds: Set<string>): PlannedExercise[] {
  const pri = (p: PlannedExercise) => {
    const ex = getExercise(p.exerciseId);
    let v = 0;
    if (mainIds.has(p.exerciseId)) v -= 1000;
    if (ex.type === 'compound') v -= 200;
    v -= MUSCLE_PRIORITY[ex.primary] * 10;
    if (ex.primary === 'core' || ex.primary === 'calves') v += 500;
    return v;
  };
  const sorted = [...exercises].sort((a, b) => pri(a) - pri(b));
  // 把同一超級組排在一起（以第一個出現的位置為準）
  const out: PlannedExercise[] = [];
  const seenGroup = new Set<string>();
  for (const p of sorted) {
    if (out.includes(p)) continue;
    if (p.supersetGroup) {
      if (seenGroup.has(p.supersetGroup)) continue;
      seenGroup.add(p.supersetGroup);
      out.push(...sorted.filter((q) => q.supersetGroup === p.supersetGroup));
    } else {
      out.push(p);
    }
  }
  return out;
}

export function planTitle(input: GeneratorInput): string {
  const m = input.muscles.map((g) => MUSCLE_LABEL[g]).join('・');
  const mode = input.mode === 'cardio' ? '有氧' : input.mode === 'both' ? '重訓＋有氧' : '重訓';
  return input.mode === 'cardio' ? `${mode} ${input.durationMin} 分鐘` : `${m}｜${mode} ${input.durationMin} 分鐘`;
}

export function generatePlan(input: GeneratorInput, profile: Profile, gym: Gym): Plan {
  const seed = input.seed ?? Date.now();
  const rng = makeRng(seed);
  const cfg = INTENSITY[input.intensity];

  if (input.mode === 'cardio') {
    const cardio = buildCardio(input, profile, gym, rng, input.durationMin - 5);
    return {
      id: newId(), title: planTitle(input), createdAt: new Date().toISOString(),
      input: { ...input, seed }, exercises: [], cardio,
      estimatedMin: input.durationMin,
      warmupNote: '動態熱身 5 分鐘：關節活動、慢走或輕踩。',
    };
  }

  const cardioMin = input.mode === 'both' ? Math.min(input.cardioMin, input.durationMin - 15) : 0;
  let budget = input.durationMin * 60 - GENERAL_WARMUP_SEC - cardioMin * 60;

  const groups = [...input.muscles].filter((g) => g !== 'cardio').sort((a, b) => MUSCLE_PRIORITY[b] - MUSCLE_PRIORITY[a]);
  const pool = EXERCISES.filter((e) => e.type !== 'cardio' && isAvailable(e, gym));

  const chosenEx: Exercise[] = [];
  const planned: PlannedExercise[] = [];
  const mainIds = new Set<string>();
  const count: Partial<Record<MuscleGroup, number>> = {};

  // 時間短時每個肌群少排一點
  const perGroupCap = (g: MuscleGroup) => {
    const base = MUSCLE_MAX_EXERCISES[g];
    if (input.durationMin <= 30) return Math.min(base, 1);
    if (input.durationMin <= 45) return Math.min(base, 2);
    return base;
  };

  const totalBudget = budget;

  const tryAdd = (g: MuscleGroup, round: number, allowSuperset: boolean): boolean => {
    if ((count[g] ?? 0) >= perGroupCap(g)) return false;
    const cands = rankCandidates(pool, chosenEx, g, round, rng);
    for (const c of cands) {
      const isMain = round === 0 && c.ex.type === 'compound' && MUSCLE_PRIORITY[g] >= 6;
      let defaultSets = c.ex.type === 'compound' ? cfg.compoundSets : cfg.isoSets;
      // 短課表：主項最多 3 組，把時間留給其他部位
      if (input.durationMin <= 45) defaultSets = Math.min(defaultSets, 3);
      // 時間不夠時，複合動作可以少做一組，而不是直接跳過
      for (const sets of defaultSets > 3 ? [defaultSets, 3] : [defaultSets]) {
        const pe = buildPlannedExercise(c.ex, input.intensity, profile, { main: isMain, sets });
        let cost = exerciseSeconds(pe);
        // 超級組模式下，孤立動作幾乎都會被配對而省下休息時間
        if (allowSuperset && !isMain) cost = Math.round(cost * (c.ex.type === 'isolation' ? 0.65 : 0.85));
        if (cost <= budget) {
          budget -= cost;
          chosenEx.push(c.ex);
          planned.push(pe);
          if (isMain) mainIds.add(c.ex.id);
          count[g] = (count[g] ?? 0) + 1;
          return true;
        }
      }
    }
    return false;
  };

  // 第一輪：每個肌群一個主要動作；之後輪流補到時間用完
  for (let round = 0; round < 4; round++) {
    let added = false;
    for (const g of groups) {
      if (tryAdd(g, round, input.allowSupersets)) added = true;
    }
    if (!added) break;
  }

  if (input.allowSupersets) pairSupersets(planned, mainIds);
  let ordered = orderPlan(planned, mainIds);

  // 安全網：若預估仍明顯超時，從最後面移除非主項動作
  while (ordered.length > 1 && strengthSeconds(ordered) > totalBudget + 240) {
    const idx = [...ordered.keys()].reverse().find((i) => !ordered[i].main);
    if (idx === undefined) break;
    const removed = ordered[idx];
    ordered = ordered.filter((_, i) => i !== idx);
    if (removed.supersetGroup) {
      for (const p of ordered) {
        if (p.supersetGroup === removed.supersetGroup) {
          p.supersetGroup = undefined;
          p.restSec = Math.round(p.restSec / 0.8);
        }
      }
    }
  }

  // 超級組依出現順序重新標成 A、B、C…
  const relabel = new Map<string, string>();
  for (const p of ordered) {
    if (!p.supersetGroup) continue;
    if (!relabel.has(p.supersetGroup)) relabel.set(p.supersetGroup, String.fromCharCode(65 + relabel.size));
    p.supersetGroup = relabel.get(p.supersetGroup);
  }

  const cardio = cardioMin > 0 ? buildCardio(input, profile, gym, rng, cardioMin) : undefined;
  const strengthMin = Math.round(strengthSeconds(ordered) / 60);
  const estimatedMin = 5 + strengthMin + (cardio?.minutes ?? 0);

  return {
    id: newId(),
    title: planTitle(input),
    createdAt: new Date().toISOString(),
    input: { ...input, seed },
    exercises: ordered,
    cardio,
    estimatedMin,
    warmupNote: `一般熱身 5 分鐘（輕有氧＋動態伸展），第一個主項已含熱身組。強度：${cfg.label}，${cfg.rpe}。`,
  };
}

/* ───────────── 動作替換 ───────────── */

export function alternativesFor(exerciseId: string, plan: Plan, gym: Gym): Exercise[] {
  const ex = getExercise(exerciseId);
  const inPlan = new Set(plan.exercises.map((p) => p.exerciseId));
  const same = EXERCISES.filter(
    (e) => e.id !== ex.id && e.primary === ex.primary && e.type !== 'cardio' && isAvailable(e, gym) && !inPlan.has(e.id),
  );
  const secondary = EXERCISES.filter(
    (e) => e.id !== ex.id && e.primary !== ex.primary && e.secondary.includes(ex.primary) && e.type !== 'cardio' && isAvailable(e, gym) && !inPlan.has(e.id),
  );
  const byTier = (a: Exercise, b: Exercise) => a.tier - b.tier || (a.type === ex.type ? -1 : 1);
  return [...same.sort(byTier), ...secondary.sort(byTier)];
}

export function replaceExercise(plan: Plan, index: number, newExerciseId: string, profile: Profile): Plan {
  const old = plan.exercises[index];
  const next = buildPlannedExercise(getExercise(newExerciseId), plan.input.intensity, profile, {
    main: old.main,
    supersetGroup: old.supersetGroup,
    sets: old.sets.filter((s) => !s.warmup).length,
  });
  const exercises = plan.exercises.map((p, i) => (i === index ? next : p));
  const strengthMin = Math.round(strengthSeconds(exercises) / 60);
  return { ...plan, exercises, estimatedMin: 5 + strengthMin + (plan.cardio?.minutes ?? 0) };
}

export function cardioAlternatives(plan: Plan, gym: Gym): Exercise[] {
  const current = plan.cardio?.exerciseId;
  return EXERCISES.filter((e) => e.type === 'cardio' && e.id !== current && isAvailable(e, gym));
}
