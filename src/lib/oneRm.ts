import type { BaseLift, Exercise, Intensity, Profile } from '../types';

/** Epley 公式：由「重量 × 次數」推估 1RM */
export function epley1RM(weightKg: number, reps: number): number {
  if (reps <= 0) return 0;
  if (reps === 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

/** 由 1RM 與目標次數反推可用重量 */
export function weightForReps(oneRm: number, reps: number): number {
  if (reps <= 1) return oneRm;
  return oneRm / (1 + reps / 30);
}

export function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export const BASE_LIFT_LABEL: Record<BaseLift, string> = {
  bench: '臥推',
  squat: '深蹲',
  pullup: '引體向上',
};

/** 取得基準動作的 1RM（引體回傳「體重 + 負重」的總負荷） */
export function baseLift1RM(profile: Profile, lift: BaseLift): number {
  switch (lift) {
    case 'bench':
      return profile.bench1RM;
    case 'squat':
      return profile.squat1RM;
    case 'pullup':
      return profile.weightKg + profile.pullupAdded1RM;
  }
}

export interface IntensityConfig {
  label: string;
  short: string;
  /** 主要複合動作使用的 %1RM */
  compoundPct: number;
  /** 孤立 / 輔助動作使用的 %1RM */
  isoPct: number;
  compoundReps: [number, number];
  isoReps: [number, number];
  compoundSets: number;
  isoSets: number;
  restCompoundSec: number;
  restIsoSec: number;
  rpe: string;
  description: string;
}

export const INTENSITY: Record<Intensity, IntensityConfig> = {
  low: {
    label: '輕鬆 / 肌耐力',
    short: '輕鬆',
    compoundPct: 0.62,
    isoPct: 0.55,
    compoundReps: [12, 15],
    isoReps: [15, 20],
    compoundSets: 3,
    isoSets: 3,
    restCompoundSec: 75,
    restIsoSec: 45,
    rpe: 'RPE 6–7',
    description: '約 60–65% 1RM，12–15 下，休息短，適合恢復日或減脂期。',
  },
  medium: {
    label: '中等 / 增肌',
    short: '中等',
    compoundPct: 0.72,
    isoPct: 0.65,
    compoundReps: [8, 10],
    isoReps: [10, 15],
    compoundSets: 4,
    isoSets: 3,
    restCompoundSec: 120,
    restIsoSec: 60,
    rpe: 'RPE 7–8',
    description: '約 70–75% 1RM，8–12 下，最典型的增肌區間。',
  },
  high: {
    label: '高強度 / 肌力',
    short: '高強度',
    compoundPct: 0.82,
    isoPct: 0.72,
    compoundReps: [4, 6],
    isoReps: [8, 10],
    compoundSets: 4,
    isoSets: 3,
    restCompoundSec: 180,
    restIsoSec: 90,
    rpe: 'RPE 8–9',
    description: '約 80–85% 1RM，4–6 下，主攻最大肌力，休息要足。',
  },
};

export interface LoadSuggestion {
  /** 建議重量（kg）；undefined 代表自選 */
  kg?: number;
  /** 顯示文字，例如「80 kg」「每手 30 kg」「+10 kg 負重」「徒手」 */
  label: string;
}

function roundingStep(ex: Exercise): number {
  if (ex.perHand) return 2;
  if (ex.equipment.some((e) => ['barbell', 'ezBar', 'trapBar', 'smith', 'landmine'].includes(e))) return 2.5;
  return 5;
}

/** 依 1RM 與強度百分比，推算某動作的建議負荷 */
export function suggestLoad(ex: Exercise, profile: Profile, pct: number): LoadSuggestion {
  if (ex.type === 'cardio') return { label: '' };
  if (!ex.load) {
    if (ex.bodyweight) return { label: '徒手' };
    return { label: '自選重量' };
  }
  const base = baseLift1RM(profile, ex.load.base);
  if (!base || base <= 0) {
    return { label: ex.bodyweight ? '徒手' : '自選重量（請先設定 1RM）' };
  }
  const est1RM = base * ex.load.ratio;
  const target = est1RM * pct;

  if (ex.bodyweight) {
    // 引體向上類：總負荷 = 體重 + 負重。
    // 自體重動作用 Epley 換算會嚴重低估徒手次數，所以只要做得起徒手就不建議輔助。
    if (ex.load.base === 'pullup' && profile.pullupAdded1RM < 0) {
      const assist = roundTo(-profile.pullupAdded1RM + 5, 5);
      return { kg: -assist, label: `彈力帶輔助（約 ${assist} kg）` };
    }
    const added = roundTo(target - profile.weightKg, 2.5);
    if (added >= 2.5) return { kg: added, label: `負重 +${added} kg` };
    return { kg: 0, label: '徒手' };
  }

  const step = roundingStep(ex);
  const kg = Math.max(step, roundTo(target, step));
  return { kg, label: ex.perHand ? `每手 ${kg} kg` : `${kg} kg` };
}

/** 依單組實際成績推估 1RM，並換算回基準動作 */
export function estimateBaseLiftFromSet(
  ex: Exercise,
  profile: Profile,
  weightKg: number,
  reps: number,
): { lift: BaseLift; value: number } | undefined {
  if (!ex.load || reps <= 0 || reps > 12) return undefined;
  const total = ex.bodyweight ? profile.weightKg + weightKg : weightKg;
  const e1rm = epley1RM(total, reps) / ex.load.ratio;
  if (ex.load.base === 'pullup') {
    return { lift: 'pullup', value: Math.round((e1rm - profile.weightKg) * 2) / 2 };
  }
  return { lift: ex.load.base, value: Math.round(e1rm * 2) / 2 };
}
