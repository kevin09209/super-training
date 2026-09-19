import { describe, expect, it } from 'vitest';
import { DEFAULT_GYMS } from '../data/equipment';
import { EXERCISES, getExercise } from '../data/exercises';
import type { GeneratorInput, Profile } from '../types';
import { alternativesFor, generatePlan, isAvailable, replaceExercise } from './generator';
import { epley1RM, estimateBaseLiftFromSet, suggestLoad } from './oneRm';
import { generateWeekPlan } from './weekPlanner';

const profile: Profile = { age: 30, heightCm: 187.7, weightKg: 107, bench1RM: 100, squat1RM: 140, pullupAdded1RM: 10 };
const commercial = DEFAULT_GYMS[0];
const community = DEFAULT_GYMS[2];

const base: GeneratorInput = {
  durationMin: 60,
  muscles: ['chest', 'shoulders', 'triceps'],
  mode: 'strength',
  intensity: 'medium',
  gymId: commercial.id,
  allowSupersets: true,
  cardioMin: 15,
  seed: 42,
};

describe('動作庫', () => {
  it('id 不重複，且每個肌群都有 tier 1 動作', () => {
    const ids = new Set(EXERCISES.map((e) => e.id));
    expect(ids.size).toBe(EXERCISES.length);
    for (const g of ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'] as const) {
      expect(EXERCISES.some((e) => e.primary === g && e.tier === 1)).toBe(true);
    }
  });

  it('每個動作都有具體的要點提示', () => {
    for (const e of EXERCISES) {
      expect(e.tip, `${e.id} 缺少 tip`).toBeTruthy();
      expect(e.tip!.length, `${e.id} 的 tip 太短`).toBeGreaterThanOrEqual(30);
    }
  });
});

describe('1RM 計算', () => {
  it('Epley 公式', () => {
    expect(epley1RM(100, 1)).toBe(100);
    expect(epley1RM(100, 5)).toBeCloseTo(116.67, 1);
  });

  it('依 1RM 建議臥推重量並以 2.5 kg 取整', () => {
    const s = suggestLoad(getExercise('bench_press'), profile, 0.72);
    expect(s.kg).toBe(72.5);
  });

  it('啞鈴類為每手重量', () => {
    const s = suggestLoad(getExercise('db_bench'), profile, 0.72);
    expect(s.label).toMatch(/每手/);
    expect(s.kg! % 2).toBe(0);
  });

  it('引體向上依體重＋負重換算成額外負重或徒手', () => {
    const heavy = suggestLoad(getExercise('pullup'), profile, 0.95);
    expect(heavy.label).toMatch(/負重|徒手/);
    const light = suggestLoad(getExercise('pullup'), { ...profile, pullupAdded1RM: -20 }, 0.6);
    expect(light.label).toMatch(/彈力帶/);
  });

  it('由完成組數反推基準 1RM', () => {
    const est = estimateBaseLiftFromSet(getExercise('incline_bench'), profile, 80, 5);
    expect(est?.lift).toBe('bench');
    expect(est!.value).toBeGreaterThan(110);
  });
});

describe('課表產生器', () => {
  it('只使用該地點有的器材', () => {
    const plan = generatePlan({ ...base, gymId: community.id, muscles: ['chest', 'back', 'quads'] }, profile, community);
    expect(plan.exercises.length).toBeGreaterThan(0);
    for (const pe of plan.exercises) expect(isAvailable(getExercise(pe.exerciseId), community)).toBe(true);
  });

  it('動作只涵蓋所選肌群且不重複', () => {
    const plan = generatePlan(base, profile, commercial);
    const ids = plan.exercises.map((p) => p.exerciseId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(base.muscles).toContain(getExercise(id).primary);
  });

  it('預估時間不超過設定太多，且時間越長動作越多', () => {
    const short = generatePlan({ ...base, durationMin: 30 }, profile, commercial);
    const long = generatePlan({ ...base, durationMin: 90, muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'] }, profile, commercial);
    expect(short.estimatedMin).toBeLessThanOrEqual(30 + 8);
    expect(long.estimatedMin).toBeLessThanOrEqual(90 + 8);
    expect(long.exercises.length).toBeGreaterThan(short.exercises.length);
  });

  it('第一個動作是主項複合動作並含熱身組', () => {
    const plan = generatePlan(base, profile, commercial);
    const first = plan.exercises[0];
    expect(getExercise(first.exerciseId).type).toBe('compound');
    expect(first.sets.some((s) => s.warmup)).toBe(true);
  });

  it('允許超級組時會出現配對，且配對動作相鄰', () => {
    const plan = generatePlan({ ...base, durationMin: 75, muscles: ['chest', 'back', 'biceps', 'triceps'] }, profile, commercial);
    const groups = plan.exercises.map((p) => p.supersetGroup).filter(Boolean);
    expect(groups.length).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < plan.exercises.length; i++) {
      const g = plan.exercises[i].supersetGroup;
      if (!g) continue;
      const neighbours = [plan.exercises[i - 1]?.supersetGroup, plan.exercises[i + 1]?.supersetGroup];
      expect(neighbours).toContain(g);
    }
  });

  it('不允許超級組時沒有配對', () => {
    const plan = generatePlan({ ...base, allowSupersets: false }, profile, commercial);
    expect(plan.exercises.every((p) => !p.supersetGroup)).toBe(true);
  });

  it('相同 seed 產生相同課表', () => {
    const a = generatePlan(base, profile, commercial);
    const b = generatePlan(base, profile, commercial);
    expect(a.exercises.map((p) => p.exerciseId)).toEqual(b.exercises.map((p) => p.exerciseId));
  });

  it('重訓＋有氧會附加有氧區塊', () => {
    const plan = generatePlan({ ...base, mode: 'both' }, profile, commercial);
    expect(plan.cardio).toBeDefined();
    expect(plan.cardio!.minutes).toBe(15);
    expect(plan.exercises.length).toBeGreaterThan(0);
  });

  it('純有氧只有有氧區塊，高強度為 HIIT', () => {
    const plan = generatePlan({ ...base, mode: 'cardio', intensity: 'high' }, profile, commercial);
    expect(plan.exercises).toHaveLength(0);
    expect(plan.cardio?.style).toBe('hiit');
  });

  it('高強度組數多、次數少、重量高', () => {
    const med = generatePlan({ ...base, allowSupersets: false }, profile, commercial);
    const high = generatePlan({ ...base, allowSupersets: false, intensity: 'high' }, profile, commercial);
    const w = (p: typeof med) => p.exercises[0].sets.filter((s) => !s.warmup)[0].weightKg ?? 0;
    expect(w(high)).toBeGreaterThan(w(med));
  });
});

describe('動作替換', () => {
  it('提供同肌群且該地點可用的替代動作', () => {
    const plan = generatePlan(base, profile, commercial);
    const alts = alternativesFor(plan.exercises[0].exerciseId, plan, commercial);
    expect(alts.length).toBeGreaterThan(0);
    const primary = getExercise(plan.exercises[0].exerciseId).primary;
    expect(alts[0].primary).toBe(primary);
    for (const a of alts) expect(plan.exercises.some((p) => p.exerciseId === a.id)).toBe(false);
  });

  it('替換後保留位置、超級組與主項熱身', () => {
    const plan = generatePlan(base, profile, commercial);
    const alts = alternativesFor(plan.exercises[0].exerciseId, plan, commercial);
    const next = replaceExercise(plan, 0, alts[0].id, profile);
    expect(next.exercises).toHaveLength(plan.exercises.length);
    expect(next.exercises[0].exerciseId).toBe(alts[0].id);
    expect(next.exercises[0].supersetGroup).toBe(plan.exercises[0].supersetGroup);
  });
});

describe('週計畫', () => {
  it('依天數安排訓練日與休息日', () => {
    const { muscles: _m, seed: _s, ...rest } = base;
    const wp = generateWeekPlan(4, rest, profile, commercial);
    expect(wp.days).toHaveLength(7);
    expect(wp.days.filter((d) => !d.rest)).toHaveLength(4);
    for (const d of wp.days) if (!d.rest) expect(d.plan!.exercises.length).toBeGreaterThan(0);
  });
});
