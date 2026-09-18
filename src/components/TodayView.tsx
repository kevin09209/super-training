import { useState } from 'react';
import { generatePlan, replaceExercise } from '../lib/generator';
import { useStore } from '../state/store';
import type { GeneratorInput, Plan } from '../types';
import { GeneratorForm } from './GeneratorForm';
import { PlanView } from './PlanView';

interface Props {
  onStart: (plan: Plan) => void;
  goSettings: () => void;
}

export function TodayView({ onStart, goSettings }: Props) {
  const { state, dispatch } = useStore();
  const { profile, currentPlan } = state;
  const [editing, setEditing] = useState(!currentPlan);

  const gymFor = (gymId: string) => state.gyms.find((g) => g.id === gymId) ?? state.gyms[0];
  const missing1RM = !profile.bench1RM || !profile.squat1RM;

  const generate = (input: GeneratorInput) => {
    const plan = generatePlan(input, profile, gymFor(input.gymId));
    dispatch({ type: 'setLastInput', input });
    dispatch({ type: 'setCurrentPlan', plan });
    setEditing(false);
    window.scrollTo({ top: 0 });
  };

  if (editing || !currentPlan) {
    return (
      <div>
        {missing1RM && (
          <div className="card tight" style={{ borderColor: 'var(--accent)' }}>
            <div className="row">
              <span style={{ fontSize: 14 }}>尚未設定臥推／深蹲／引體 1RM，重量建議會顯示「自選」。</span>
              <button className="sm auto primary" onClick={goSettings}>
                去設定
              </button>
            </div>
          </div>
        )}
        <div className="card">
          <div className="card-title">
            <h2>產生今日課表</h2>
            {currentPlan && (
              <button className="sm ghost" onClick={() => setEditing(false)}>
                取消
              </button>
            )}
          </div>
          <p className="dim" style={{ marginBottom: 12 }}>
            {profile.age} 歲・{profile.heightCm} cm・{profile.weightKg} kg・臥推 {profile.bench1RM || '—'}・深蹲 {profile.squat1RM || '—'}・引體 {profile.pullupAdded1RM >= 0 ? '+' : ''}
            {profile.pullupAdded1RM} kg
          </p>
          <GeneratorForm initial={state.lastInput} submitLabel="產生課表" onSubmit={generate} />
        </div>
      </div>
    );
  }

  const gym = gymFor(currentPlan.input.gymId);

  return (
    <div>
      <div className="card-title" style={{ marginBottom: 10 }}>
        <h2 style={{ margin: 0 }}>{currentPlan.title}</h2>
      </div>
      <div className="row" style={{ marginBottom: 12 }}>
        <button onClick={() => setEditing(true)}>調整條件</button>
        <button onClick={() => generate({ ...currentPlan.input, seed: Date.now() })}>🎲 換一組</button>
      </div>
      <p className="dim" style={{ marginTop: -6, marginBottom: 10 }}>
        地點：{gym.name}。每個動作都可點「替換」換成同肌群動作。
      </p>

      <PlanView
        plan={currentPlan}
        gym={gym}
        onReplace={(i, id) => dispatch({ type: 'setCurrentPlan', plan: replaceExercise(currentPlan, i, id, profile) })}
        onReplaceCardio={(id) =>
          currentPlan.cardio && dispatch({ type: 'setCurrentPlan', plan: { ...currentPlan, cardio: { ...currentPlan.cardio, exerciseId: id } } })
        }
      />

      <div className="sticky-actions">
        <button className="primary block" onClick={() => onStart(currentPlan)}>
          ▶ 開始訓練
        </button>
      </div>
    </div>
  );
}
