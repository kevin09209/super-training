import { useState } from 'react';
import { getExercise } from '../data/exercises';
import { MUSCLE_LABEL } from '../data/muscles';
import { alternativesFor, cardioAlternatives } from '../lib/generator';
import type { Exercise, Gym, Plan, PlannedExercise } from '../types';

interface Props {
  plan: Plan;
  gym: Gym;
  onReplace: (index: number, newId: string) => void;
  onReplaceCardio?: (newId: string) => void;
}

export function tierBadge(ex: Exercise) {
  if (ex.tier === 1) return <span className="badge accent">CP 值高</span>;
  if (ex.tier === 2) return <span className="badge">常用</span>;
  return <span className="badge">補充</span>;
}

export function setsSummary(pe: PlannedExercise): string {
  const work = pe.sets.filter((s) => !s.warmup);
  if (work.length === 0) return '';
  const first = work[0];
  const reps = first.seconds ? `${first.seconds} 秒` : `${first.reps} 下`;
  const w = first.weightKg !== undefined && first.weightKg !== 0 ? ` @ ${first.weightKg} kg` : '';
  return `${work.length} 組 × ${reps}${w}`;
}

export function PlanView({ plan, gym, onReplace, onReplaceCardio }: Props) {
  const [replacing, setReplacing] = useState<number | 'cardio' | null>(null);

  const alts: Exercise[] =
    replacing === null ? [] : replacing === 'cardio' ? cardioAlternatives(plan, gym) : alternativesFor(plan.exercises[replacing].exerciseId, plan, gym);

  const groupLabelShown = new Set<string>();

  return (
    <div>
      <div className="card tight">
        <div className="row">
          <div className="stat">
            <div className="v">{plan.estimatedMin}</div>
            <div className="l">預估分鐘</div>
          </div>
          <div className="stat">
            <div className="v">{plan.exercises.length}</div>
            <div className="l">動作</div>
          </div>
          <div className="stat">
            <div className="v">{plan.exercises.reduce((s, p) => s + p.sets.filter((x) => !x.warmup).length, 0)}</div>
            <div className="l">正式組</div>
          </div>
        </div>
        {plan.warmupNote && <p className="dim" style={{ marginTop: 6 }}>🔥 {plan.warmupNote}</p>}
      </div>

      {plan.exercises.map((pe, i) => {
        const ex = getExercise(pe.exerciseId);
        const isMain = !!pe.main;
        const showGroup = pe.supersetGroup && !groupLabelShown.has(pe.supersetGroup);
        if (pe.supersetGroup) groupLabelShown.add(pe.supersetGroup);
        return (
          <div key={`${pe.exerciseId}-${i}`}>
            {showGroup && <div className="superset-label">⚡ 超級組 {pe.supersetGroup}：以下兩個動作交替，做完一輪再休息</div>}
            <div className={`ex-card ${pe.supersetGroup ? 'superset' : ''} ${isMain ? 'main' : ''}`}>
              <div className="ex-head">
                <div>
                  <div className="ex-name">
                    {i + 1}. {ex.name}
                  </div>
                  <div className="ex-en">{ex.nameEn}</div>
                </div>
                <button className="sm auto" onClick={() => setReplacing(i)}>
                  替換
                </button>
              </div>
              <div className="ex-meta">
                {tierBadge(ex)}
                <span className="badge">{MUSCLE_LABEL[ex.primary]}</span>
                {ex.secondary.slice(0, 2).map((m) => (
                  <span key={m} className="badge">
                    +{MUSCLE_LABEL[m]}
                  </span>
                ))}
                {isMain && <span className="badge green">主項</span>}
              </div>
              <div className="plan-sets">
                <strong>{setsSummary(pe)}</strong>
                {pe.note && <span className="dim">・{pe.note}</span>}
                <div className="dim">
                  休息 {pe.restSec} 秒・{pe.rpe}
                </div>
                {pe.sets.some((s) => s.warmup) && (
                  <div className="dim">
                    熱身：{pe.sets.filter((s) => s.warmup).map((s) => `${s.weightKg}kg×${s.reps}`).join('、')}
                  </div>
                )}
              </div>
              {ex.tip && <div className="tip">{ex.tip}</div>}
            </div>
          </div>
        );
      })}

      {plan.cardio && (
        <div className="ex-card" style={{ borderLeft: '4px solid var(--green)' }}>
          <div className="ex-head">
            <div>
              <div className="ex-name">🏃 {getExercise(plan.cardio.exerciseId).name}</div>
              <div className="ex-en">
                {plan.cardio.style === 'liss' ? 'LISS 低強度穩態' : plan.cardio.style === 'intervals' ? '間歇' : 'HIIT 高強度間歇'}・{plan.cardio.minutes} 分鐘
              </div>
            </div>
            {onReplaceCardio && (
              <button className="sm auto" onClick={() => setReplacing('cardio')}>
                替換
              </button>
            )}
          </div>
          <p style={{ fontSize: 14 }}>{plan.cardio.description}</p>
          {getExercise(plan.cardio.exerciseId).tip && <div className="tip">{getExercise(plan.cardio.exerciseId).tip}</div>}
        </div>
      )}

      {replacing !== null && (
        <div className="modal-bg" onClick={() => setReplacing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="card-title">
              <h2>替換{replacing === 'cardio' ? '有氧' : `「${getExercise(plan.exercises[replacing].exerciseId).name}」`}</h2>
              <button className="sm ghost" onClick={() => setReplacing(null)}>
                關閉
              </button>
            </div>
            <small>依 {gym.name} 的器材篩選，同肌群優先。</small>
            {alts.length === 0 && <div className="empty">此地點沒有其他可替換的動作</div>}
            {alts.map((a) => (
              <div
                key={a.id}
                className="alt-item"
                onClick={() => {
                  if (replacing === 'cardio') onReplaceCardio?.(a.id);
                  else onReplace(replacing, a.id);
                  setReplacing(null);
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{a.name}</div>
                  <div className="ex-en">{a.nameEn}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {tierBadge(a)}
                  <span className="badge">{MUSCLE_LABEL[a.primary]}</span>
                  <span className="badge">{a.type === 'compound' ? '複合' : a.type === 'isolation' ? '孤立' : '有氧'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
