export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'cardio';

export type Equipment =
  | 'barbell'
  | 'rack'
  | 'bench'
  | 'dumbbell'
  | 'ezBar'
  | 'kettlebell'
  | 'band'
  | 'cable'
  | 'smith'
  | 'pullupBar'
  | 'dipStation'
  | 'trapBar'
  | 'landmine'
  | 'latPulldown'
  | 'rowMachine'
  | 'chestPress'
  | 'shoulderPress'
  | 'pecDeck'
  | 'legPress'
  | 'hackSquat'
  | 'legCurl'
  | 'legExtension'
  | 'hipThrustMachine'
  | 'calfMachine'
  | 'abMachine'
  | 'treadmill'
  | 'bike'
  | 'rower'
  | 'elliptical'
  | 'stairmaster'
  | 'skiErg'
  | 'jumpRope'
  | 'bodyweight';

export type BaseLift = 'bench' | 'pullup' | 'squat';

export type ExerciseType = 'compound' | 'isolation' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  primary: MuscleGroup;
  secondary: MuscleGroup[];
  /** 需要「全部」具備的器材 */
  equipment: Equipment[];
  type: ExerciseType;
  /** 1 = 公認 CP 值最高的核心動作，2 = 常見主力輔助動作，3 = 補充動作 */
  tier: 1 | 2 | 3;
  /** 以某個基準 1RM 乘上比例估算此動作的 1RM */
  load?: { base: BaseLift; ratio: number };
  /** 單邊 / 每手重量（啞鈴類） */
  perHand?: boolean;
  /** 以自身體重為主要負荷 */
  bodyweight?: boolean;
  /** 有氧型態 */
  cardioStyle?: 'liss' | 'hiit' | 'any';
  tip?: string;
}

export type Intensity = 'low' | 'medium' | 'high';
export type Mode = 'strength' | 'cardio' | 'both';

export interface Profile {
  age: number;
  heightCm: number;
  weightKg: number;
  /** 1RM，引體為「額外負重」(kg)，可為負數代表輔助 */
  bench1RM: number;
  squat1RM: number;
  pullupAdded1RM: number;
}

export interface Gym {
  id: string;
  name: string;
  equipment: Equipment[];
}

export interface GeneratorInput {
  durationMin: number;
  muscles: MuscleGroup[];
  mode: Mode;
  intensity: Intensity;
  gymId: string;
  allowSupersets: boolean;
  cardioMin: number;
  seed?: number;
}

export interface SetPlan {
  reps: number | string;
  /** kg；undefined 代表自選重量 */
  weightKg?: number;
  /** 熱身組 */
  warmup?: boolean;
  /** 有氧：秒數 */
  seconds?: number;
}

export interface PlannedExercise {
  exerciseId: string;
  sets: SetPlan[];
  restSec: number;
  rpe: string;
  /** 同 supersetGroup 的動作交替進行 */
  supersetGroup?: string;
  /** 當日主項（大重量複合動作） */
  main?: boolean;
  note?: string;
}

export interface Plan {
  id: string;
  title: string;
  createdAt: string;
  input: GeneratorInput;
  exercises: PlannedExercise[];
  cardio?: CardioBlock;
  estimatedMin: number;
  warmupNote?: string;
}

export interface CardioBlock {
  exerciseId: string;
  style: 'liss' | 'intervals' | 'hiit';
  minutes: number;
  description: string;
  intervals?: { workSec: number; restSec: number; rounds: number };
}

export interface LoggedSet {
  targetReps: number | string;
  targetWeightKg?: number;
  weightKg?: number;
  reps?: number;
  done: boolean;
  warmup?: boolean;
}

export interface LoggedExercise {
  exerciseId: string;
  sets: LoggedSet[];
  supersetGroup?: string;
}

export interface WorkoutLog {
  id: string;
  planId?: string;
  title: string;
  startedAt: string;
  finishedAt?: string;
  exercises: LoggedExercise[];
  cardio?: CardioBlock & { done?: boolean };
  notes?: string;
}

export interface RmRecord {
  id: string;
  lift: BaseLift;
  date: string;
  /** kg；引體為額外負重 */
  value: number;
  source: 'manual' | 'estimated';
  bodyweightKg?: number;
}

export interface WeekDayPlan {
  dayIndex: number;
  label: string;
  rest: boolean;
  plan?: Plan;
}

export interface WeekPlan {
  id: string;
  createdAt: string;
  daysPerWeek: number;
  splitName: string;
  days: WeekDayPlan[];
}

export interface Settings {
  defaultRestSec: number;
  soundOn: boolean;
  vibrateOn: boolean;
}

export interface AppState {
  profile: Profile;
  gyms: Gym[];
  settings: Settings;
  currentPlan?: Plan;
  weekPlan?: WeekPlan;
  activeWorkout?: WorkoutLog;
  logs: WorkoutLog[];
  rmRecords: RmRecord[];
  lastInput?: GeneratorInput;
}
