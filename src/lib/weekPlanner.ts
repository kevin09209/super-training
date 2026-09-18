import type { GeneratorInput, Gym, MuscleGroup, Profile, WeekPlan } from '../types';
import { generatePlan, newId } from './generator';

interface SplitDay {
  label: string;
  muscles: MuscleGroup[];
}

interface SplitTemplate {
  name: string;
  /** 一週七天（週一 = 0）哪幾天訓練，對應 days 的順序 */
  weekdays: number[];
  days: SplitDay[];
}

const PUSH: MuscleGroup[] = ['chest', 'shoulders', 'triceps'];
const PULL: MuscleGroup[] = ['back', 'biceps', 'core'];
const LEGS: MuscleGroup[] = ['quads', 'hamstrings', 'glutes', 'calves'];
const UPPER: MuscleGroup[] = ['chest', 'back', 'shoulders', 'biceps', 'triceps'];
const LOWER: MuscleGroup[] = ['quads', 'hamstrings', 'glutes', 'calves', 'core'];
const FULL_A: MuscleGroup[] = ['quads', 'chest', 'back', 'core'];
const FULL_B: MuscleGroup[] = ['hamstrings', 'glutes', 'shoulders', 'back', 'chest'];

export const SPLITS: Record<number, SplitTemplate> = {
  2: {
    name: '全身 ×2',
    weekdays: [0, 3],
    days: [
      { label: '全身 A', muscles: FULL_A },
      { label: '全身 B', muscles: FULL_B },
    ],
  },
  3: {
    name: '推／拉／腿',
    weekdays: [0, 2, 4],
    days: [
      { label: '推', muscles: PUSH },
      { label: '拉', muscles: PULL },
      { label: '腿', muscles: LEGS },
    ],
  },
  4: {
    name: '上／下 ×2',
    weekdays: [0, 1, 3, 4],
    days: [
      { label: '上肢 A', muscles: UPPER },
      { label: '下肢 A', muscles: LOWER },
      { label: '上肢 B', muscles: UPPER },
      { label: '下肢 B', muscles: LOWER },
    ],
  },
  5: {
    name: '推／拉／腿 ＋ 上／下',
    weekdays: [0, 1, 2, 4, 5],
    days: [
      { label: '推', muscles: PUSH },
      { label: '拉', muscles: PULL },
      { label: '腿', muscles: LEGS },
      { label: '上肢', muscles: UPPER },
      { label: '下肢', muscles: LOWER },
    ],
  },
  6: {
    name: '推／拉／腿 ×2',
    weekdays: [0, 1, 2, 3, 4, 5],
    days: [
      { label: '推 A', muscles: PUSH },
      { label: '拉 A', muscles: PULL },
      { label: '腿 A', muscles: LEGS },
      { label: '推 B', muscles: PUSH },
      { label: '拉 B', muscles: PULL },
      { label: '腿 B', muscles: LEGS },
    ],
  },
};

export const WEEKDAY_LABEL = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

export function generateWeekPlan(
  daysPerWeek: number,
  base: Omit<GeneratorInput, 'muscles' | 'seed'>,
  profile: Profile,
  gym: Gym,
): WeekPlan {
  const tpl = SPLITS[Math.min(6, Math.max(2, daysPerWeek))];
  const seedBase = Date.now();
  const days = WEEKDAY_LABEL.map((wd, i) => {
    const idx = tpl.weekdays.indexOf(i);
    if (idx === -1) return { dayIndex: i, label: `${wd}・休息`, rest: true };
    const d = tpl.days[idx];
    const plan = generatePlan({ ...base, muscles: d.muscles, seed: seedBase + i * 7919 }, profile, gym);
    return { dayIndex: i, label: `${wd}・${d.label}`, rest: false, plan: { ...plan, title: `${d.label}｜${plan.title}` } };
  });
  return { id: newId(), createdAt: new Date().toISOString(), daysPerWeek: tpl.days.length, splitName: tpl.name, days };
}
