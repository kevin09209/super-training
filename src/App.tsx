import { useEffect, useState } from 'react';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { TodayView } from './components/TodayView';
import { WeekView } from './components/WeekView';
import { WorkoutSession } from './components/WorkoutSession';
import { primeAudio } from './lib/sound';
import { useStore } from './state/store';
import type { Plan, WorkoutLog } from './types';
import { newId } from './lib/generator';
import { getExercise } from './data/exercises';

type Tab = 'today' | 'week' | 'history' | 'settings';

const TABS: { id: Tab; label: string; ico: string }[] = [
  { id: 'today', label: '今日訓練', ico: '🏋️' },
  { id: 'week', label: '週計畫', ico: '📅' },
  { id: 'history', label: '紀錄', ico: '📈' },
  { id: 'settings', label: '設定', ico: '⚙️' },
];

export function workoutFromPlan(plan: Plan): WorkoutLog {
  return {
    id: newId(),
    planId: plan.id,
    title: plan.title,
    startedAt: new Date().toISOString(),
    exercises: plan.exercises.map((pe) => {
      const ex = getExercise(pe.exerciseId);
      return {
        exerciseId: pe.exerciseId,
        supersetGroup: pe.supersetGroup,
        sets: pe.sets.map((s) => {
          const lo = typeof s.reps === 'number' ? s.reps : parseInt(String(s.reps).split(/[–-]/)[0], 10);
          return {
            targetReps: s.seconds ? `${s.seconds} 秒` : s.reps,
            targetWeightKg: s.weightKg,
            weightKg: s.weightKg ?? (ex.bodyweight ? 0 : undefined),
            reps: s.seconds ?? (Number.isFinite(lo) ? lo : undefined),
            done: false,
            warmup: s.warmup,
          };
        }),
      };
    }),
    cardio: plan.cardio ? { ...plan.cardio, done: false } : undefined,
  };
}

export default function App() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState<Tab>('today');

  useEffect(() => {
    const prime = () => {
      primeAudio();
      window.removeEventListener('pointerdown', prime);
    };
    window.addEventListener('pointerdown', prime);
    return () => window.removeEventListener('pointerdown', prime);
  }, []);

  const startWorkout = (plan: Plan) => {
    if (state.activeWorkout && !confirm('已有進行中的訓練，要放棄並開始新的嗎？')) return;
    dispatch({ type: 'setCurrentPlan', plan });
    dispatch({ type: 'startWorkout', workout: workoutFromPlan(plan) });
    setTab('today');
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          Super<span>Training</span>
        </h1>
        <span className="sub">
          {state.profile.heightCm} cm・{state.profile.weightKg} kg
        </span>
      </header>

      {state.activeWorkout && tab !== 'today' && (
        <div className="card tight" style={{ borderColor: 'var(--accent)' }}>
          <div className="row">
            <span>🏃 訓練進行中：{state.activeWorkout.title}</span>
            <button className="sm auto primary" onClick={() => setTab('today')}>回到訓練</button>
          </div>
        </div>
      )}

      {tab === 'today' && (state.activeWorkout ? <WorkoutSession /> : <TodayView onStart={startWorkout} goSettings={() => setTab('settings')} />)}
      {tab === 'week' && <WeekView onStart={startWorkout} />}
      {tab === 'history' && <HistoryView />}
      {tab === 'settings' && <SettingsView />}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            <span className="ico">{t.ico}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
