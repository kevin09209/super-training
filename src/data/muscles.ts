import type { MuscleGroup } from '../types';

export const MUSCLE_LABEL: Record<MuscleGroup, string> = {
  chest: '胸',
  back: '背',
  shoulders: '肩',
  biceps: '二頭',
  triceps: '三頭',
  quads: '股四頭',
  hamstrings: '腿後',
  glutes: '臀',
  calves: '小腿',
  core: '核心',
  cardio: '有氧',
};

export const MUSCLE_ORDER: MuscleGroup[] = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'core',
];

/** 越大的肌群優先安排、分配越多動作 */
export const MUSCLE_PRIORITY: Record<MuscleGroup, number> = {
  quads: 10,
  back: 9,
  chest: 9,
  hamstrings: 8,
  glutes: 7,
  shoulders: 6,
  triceps: 4,
  biceps: 4,
  core: 3,
  calves: 2,
  cardio: 0,
};

/** 每個肌群在一次訓練中最多幾個動作 */
export const MUSCLE_MAX_EXERCISES: Record<MuscleGroup, number> = {
  chest: 3,
  back: 3,
  quads: 3,
  hamstrings: 2,
  glutes: 2,
  shoulders: 3,
  triceps: 2,
  biceps: 2,
  core: 2,
  calves: 1,
  cardio: 1,
};

/** 拮抗肌 / 不互相干擾的超級組配對 */
export const SUPERSET_PAIRS: [MuscleGroup, MuscleGroup][] = [
  ['chest', 'back'],
  ['biceps', 'triceps'],
  ['quads', 'hamstrings'],
  ['shoulders', 'back'],
  ['chest', 'biceps'],
  ['back', 'triceps'],
  ['glutes', 'core'],
  ['calves', 'core'],
  ['quads', 'core'],
  ['shoulders', 'biceps'],
  ['hamstrings', 'calves'],
];

export interface MusclePreset {
  id: string;
  label: string;
  muscles: MuscleGroup[];
}

export const MUSCLE_PRESETS: MusclePreset[] = [
  { id: 'push', label: '推（胸肩三頭）', muscles: ['chest', 'shoulders', 'triceps'] },
  { id: 'pull', label: '拉（背二頭）', muscles: ['back', 'biceps'] },
  { id: 'legs', label: '腿（四頭腿後臀）', muscles: ['quads', 'hamstrings', 'glutes', 'calves'] },
  { id: 'upper', label: '上肢', muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'] },
  { id: 'lower', label: '下肢', muscles: ['quads', 'hamstrings', 'glutes', 'calves', 'core'] },
  { id: 'full', label: '全身', muscles: ['quads', 'chest', 'back', 'shoulders', 'hamstrings', 'core'] },
];
