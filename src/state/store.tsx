import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { DEFAULT_GYMS } from '../data/equipment';
import type {
  AppState, GeneratorInput, Gym, LoggedSet, Plan, Profile, RmRecord, Settings, WeekPlan, WorkoutLog,
} from '../types';

const STORAGE_KEY = 'super-training-v1';

export const DEFAULT_PROFILE: Profile = {
  age: 30,
  heightCm: 187.7,
  weightKg: 107,
  bench1RM: 0,
  squat1RM: 0,
  pullupAdded1RM: 0,
};

export const DEFAULT_SETTINGS: Settings = {
  defaultRestSec: 90,
  soundOn: true,
  vibrateOn: true,
};

export const initialState: AppState = {
  profile: DEFAULT_PROFILE,
  gyms: DEFAULT_GYMS,
  settings: DEFAULT_SETTINGS,
  logs: [],
  rmRecords: [],
};

export type Action =
  | { type: 'setProfile'; profile: Partial<Profile> }
  | { type: 'setSettings'; settings: Partial<Settings> }
  | { type: 'upsertGym'; gym: Gym }
  | { type: 'deleteGym'; id: string }
  | { type: 'setCurrentPlan'; plan?: Plan }
  | { type: 'setLastInput'; input: GeneratorInput }
  | { type: 'setWeekPlan'; weekPlan?: WeekPlan }
  | { type: 'updateWeekDayPlan'; dayIndex: number; plan: Plan }
  | { type: 'startWorkout'; workout: WorkoutLog }
  | { type: 'updateActiveSet'; exIndex: number; setIndex: number; patch: Partial<LoggedSet> }
  | { type: 'setActiveCardioDone'; done: boolean }
  | { type: 'setActiveNotes'; notes: string }
  | { type: 'finishWorkout' }
  | { type: 'discardWorkout' }
  | { type: 'deleteLog'; id: string }
  | { type: 'addRmRecord'; record: RmRecord }
  | { type: 'deleteRmRecord'; id: string }
  | { type: 'importState'; state: AppState }
  | { type: 'reset' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'setProfile':
      return { ...state, profile: { ...state.profile, ...action.profile } };
    case 'setSettings':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'upsertGym': {
      const exists = state.gyms.some((g) => g.id === action.gym.id);
      return { ...state, gyms: exists ? state.gyms.map((g) => (g.id === action.gym.id ? action.gym : g)) : [...state.gyms, action.gym] };
    }
    case 'deleteGym':
      return { ...state, gyms: state.gyms.filter((g) => g.id !== action.id) };
    case 'setCurrentPlan':
      return { ...state, currentPlan: action.plan };
    case 'setLastInput':
      return { ...state, lastInput: action.input };
    case 'setWeekPlan':
      return { ...state, weekPlan: action.weekPlan };
    case 'updateWeekDayPlan':
      if (!state.weekPlan) return state;
      return {
        ...state,
        weekPlan: {
          ...state.weekPlan,
          days: state.weekPlan.days.map((d) => (d.dayIndex === action.dayIndex ? { ...d, plan: action.plan } : d)),
        },
      };
    case 'startWorkout':
      return { ...state, activeWorkout: action.workout };
    case 'updateActiveSet': {
      if (!state.activeWorkout) return state;
      const exercises = state.activeWorkout.exercises.map((ex, i) =>
        i !== action.exIndex
          ? ex
          : { ...ex, sets: ex.sets.map((s, j) => (j === action.setIndex ? { ...s, ...action.patch } : s)) },
      );
      return { ...state, activeWorkout: { ...state.activeWorkout, exercises } };
    }
    case 'setActiveCardioDone':
      if (!state.activeWorkout?.cardio) return state;
      return { ...state, activeWorkout: { ...state.activeWorkout, cardio: { ...state.activeWorkout.cardio, done: action.done } } };
    case 'setActiveNotes':
      if (!state.activeWorkout) return state;
      return { ...state, activeWorkout: { ...state.activeWorkout, notes: action.notes } };
    case 'finishWorkout': {
      if (!state.activeWorkout) return state;
      const finished: WorkoutLog = { ...state.activeWorkout, finishedAt: new Date().toISOString() };
      return { ...state, activeWorkout: undefined, logs: [finished, ...state.logs] };
    }
    case 'discardWorkout':
      return { ...state, activeWorkout: undefined };
    case 'deleteLog':
      return { ...state, logs: state.logs.filter((l) => l.id !== action.id) };
    case 'addRmRecord': {
      const records = [...state.rmRecords, action.record].sort((a, b) => a.date.localeCompare(b.date));
      const profile = { ...state.profile };
      // 最新的紀錄同步到 profile
      const sameLift = records.filter((r) => r.lift === action.record.lift);
      const latest = sameLift[sameLift.length - 1];
      if (latest && latest.id === action.record.id) {
        if (action.record.lift === 'bench') profile.bench1RM = action.record.value;
        if (action.record.lift === 'squat') profile.squat1RM = action.record.value;
        if (action.record.lift === 'pullup') profile.pullupAdded1RM = action.record.value;
      }
      return { ...state, rmRecords: records, profile };
    }
    case 'deleteRmRecord':
      return { ...state, rmRecords: state.rmRecords.filter((r) => r.id !== action.id) };
    case 'importState':
      return { ...initialState, ...action.state };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...initialState,
      ...parsed,
      profile: { ...DEFAULT_PROFILE, ...parsed.profile },
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      gyms: parsed.gyms?.length ? parsed.gyms : DEFAULT_GYMS,
    };
  } catch {
    return initialState;
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* 私密模式或空間不足時忽略 */
  }
}

interface StoreValue {
  state: AppState;
  dispatch: (a: Action) => void;
}

const StoreContext = createContext<StoreValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  useEffect(() => {
    saveState(state);
  }, [state]);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function exportStateJson(state: AppState): string {
  return JSON.stringify(state, null, 2);
}
