import { useState } from 'react';
import { generatePlan, replaceExercise } from '../lib/generator';
import { generateWeekPlan, SPLITS } from '../lib/weekPlanner';
import { useStore } from '../state/store';
import type { GeneratorInput, Plan } from '../types';
import { defaultInput, GeneratorForm } from './GeneratorForm';
import { PlanView, setsSummary } from './PlanView';
import { getExercise } from '../data/exercises';

interface Props {
  onStart: (plan: Plan) => void;
}

export function WeekView({ onStart }: Props) {
  const { state, dispatch } = useStore();
  const { weekPlan, profile } = state;
  const [editing, setEditing] = useState(!weekPlan);
  const [days, setDays] = useState(weekPlan?.daysPerWeek ?? 4);
  const [open, setOpen] = useState<number | null>(null);

  const gymFor = (gymId: string) => state.gyms.find((g) => g.id === gymId) ?? state.gyms[0];

  const generate = (input: GeneratorInput) => {
    const { muscles: _m, seed: _s, ...base } = input;
    const wp = generateWeekPlan(days, base, profile, gymFor(input.gymId));
    dispatch({ type: 'setLastInput', input });
    dispatch({ type: 'setWeekPlan', weekPlan: wp });
    setEditing(false);
    setOpen(null);
  };

  if (editing || !weekPlan) {
    return (
      <div className="card">
        <div className="card-title">
          <h2>產生每週計畫</h2>
          {weekPlan && (
            <button className="sm ghost" onClick={() => setEditing(false)}>
              取消
            </button>
          )}
        </div>
        <label className="field">
          <span>每週訓練天數</span>
          <div className="seg">
            {[2, 3, 4, 5, 6].map((d) => (
              <button key={d} type="button" className={days === d ? 'on' : ''} onClick={() => setDays(d)}>
                {d} 天
              </button>
            ))}
          </div>
          <small>分化方式：{SPLITS[days].name}</small>
        </label>
        <GeneratorForm
          initial={state.lastInput ?? defaultInput(state.gyms[0]?.id ?? '')}
          hideMuscles
          submitLabel="產生一週課表"
          onSubmit={generate}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="card-title" style={{ marginBottom: 10 }}>
        <h2 style={{ margin: 0 }}>
          每週 {weekPlan.daysPerWeek} 天・{weekPlan.splitName}
        </h2>
        <button className="sm" onClick={() => setEditing(true)}>
          重新設定
        </button>
      </div>

      {weekPlan.days.map((d) => {
        const isOpen = open === d.dayIndex;
        if (d.rest) {
          return (
            <div key={d.dayIndex} className="card tight" style={{ opacity: 0.6 }}>
              😴 {d.label}
            </div>
          );
        }
        const plan = d.plan!;
        const gym = gymFor(plan.input.gymId);
        return (
          <div key={d.dayIndex} className="card tight">
            <div className="card-title" onClick={() => setOpen(isOpen ? null : d.dayIndex)} style={{ cursor: 'pointer' }}>
              <div>
                <strong>{d.label}</strong>
                <div className="dim" style={{ fontSize: 13 }}>
                  {plan.estimatedMin} 分鐘・{plan.exercises.length} 個動作
                  {plan.cardio ? '・＋有氧' : ''}
                </div>
              </div>
              <span className="dim">{isOpen ? '▲' : '▼'}</span>
            </div>
            {!isOpen && (
              <div className="dim" style={{ fontSize: 13, marginTop: 4 }}>
                {plan.exercises
                  .slice(0, 4)
                  .map((p) => `${getExercise(p.exerciseId).name} ${setsSummary(p).split(' @')[0]}`)
                  .join('、')}
                {plan.exercises.length > 4 ? '…' : ''}
              </div>
            )}
            {isOpen && (
              <div style={{ marginTop: 10 }}>
                <div className="row" style={{ marginBottom: 10 }}>
                  <button
                    onClick={() => {
                      const next = generatePlan({ ...plan.input, seed: Date.now() }, profile, gym);
                      dispatch({ type: 'updateWeekDayPlan', dayIndex: d.dayIndex, plan: { ...next, title: plan.title } });
                    }}
                  >
                    🎲 換一組
                  </button>
                  <button className="primary" onClick={() => onStart(plan)}>
                    ▶ 開始此訓練
                  </button>
                </div>
                <PlanView
                  plan={plan}
                  gym={gym}
                  onReplace={(i, id) => dispatch({ type: 'updateWeekDayPlan', dayIndex: d.dayIndex, plan: replaceExercise(plan, i, id, profile) })}
                  onReplaceCardio={(id) =>
                    plan.cardio && dispatch({ type: 'updateWeekDayPlan', dayIndex: d.dayIndex, plan: { ...plan, cardio: { ...plan.cardio, exerciseId: id } } })
                  }
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
