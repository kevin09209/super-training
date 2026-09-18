import { useState } from 'react';
import { MUSCLE_LABEL, MUSCLE_ORDER, MUSCLE_PRESETS } from '../data/muscles';
import { INTENSITY } from '../lib/oneRm';
import { useStore } from '../state/store';
import type { GeneratorInput, Intensity, Mode, MuscleGroup } from '../types';

const DURATIONS = [30, 45, 60, 75, 90];

interface Props {
  initial?: GeneratorInput;
  /** 週計畫模式不需要選部位 */
  hideMuscles?: boolean;
  submitLabel: string;
  onSubmit: (input: GeneratorInput) => void;
  children?: React.ReactNode;
}

export function defaultInput(gymId: string): GeneratorInput {
  return {
    durationMin: 60,
    muscles: ['chest', 'shoulders', 'triceps'],
    mode: 'strength',
    intensity: 'medium',
    gymId,
    allowSupersets: true,
    cardioMin: 15,
  };
}

export function GeneratorForm({ initial, hideMuscles, submitLabel, onSubmit, children }: Props) {
  const { state } = useStore();
  const gyms = state.gyms;
  const [input, setInput] = useState<GeneratorInput>(() => {
    const base = initial ?? defaultInput(gyms[0]?.id ?? '');
    return gyms.some((g) => g.id === base.gymId) ? base : { ...base, gymId: gyms[0]?.id ?? '' };
  });
  const set = <K extends keyof GeneratorInput>(k: K, v: GeneratorInput[K]) => setInput((s) => ({ ...s, [k]: v }));

  const toggleMuscle = (m: MuscleGroup) =>
    set('muscles', input.muscles.includes(m) ? input.muscles.filter((x) => x !== m) : [...input.muscles, m]);

  const presetActive = (ms: MuscleGroup[]) =>
    ms.length === input.muscles.length && ms.every((m) => input.muscles.includes(m));

  const canSubmit = input.mode === 'cardio' || hideMuscles || input.muscles.length > 0;

  return (
    <div>
      <label className="field">
        <span>訓練地點（決定可用器材）</span>
        <select value={input.gymId} onChange={(e) => set('gymId', e.target.value)}>
          {gyms.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}（{g.equipment.length} 種器材）
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>預計訓練時間（分鐘）</span>
        <div className="row">
          <div className="chips">
            {DURATIONS.map((d) => (
              <span key={d} className={`chip ${input.durationMin === d ? 'on' : ''}`} onClick={() => set('durationMin', d)}>
                {d}
              </span>
            ))}
          </div>
          <input
            className="auto small"
            style={{ width: 80 }}
            type="number"
            min={15}
            max={180}
            value={input.durationMin}
            onChange={(e) => set('durationMin', Math.max(15, Math.min(180, Number(e.target.value) || 15)))}
          />
        </div>
      </label>

      <label className="field">
        <span>類型</span>
        <div className="seg">
          {(
            [
              ['strength', '重訓'],
              ['both', '重訓＋有氧'],
              ['cardio', '純有氧'],
            ] as [Mode, string][]
          ).map(([v, l]) => (
            <button key={v} type="button" className={input.mode === v ? 'on' : ''} onClick={() => set('mode', v)}>
              {l}
            </button>
          ))}
        </div>
      </label>

      {input.mode === 'both' && (
        <label className="field">
          <span>其中有氧時間（分鐘）</span>
          <div className="chips">
            {[10, 15, 20, 30].map((d) => (
              <span key={d} className={`chip ${input.cardioMin === d ? 'on' : ''}`} onClick={() => set('cardioMin', d)}>
                {d}
              </span>
            ))}
          </div>
        </label>
      )}

      {!hideMuscles && input.mode !== 'cardio' && (
        <label className="field">
          <span>訓練部位</span>
          <div className="chips" style={{ marginBottom: 8 }}>
            {MUSCLE_PRESETS.map((p) => (
              <span key={p.id} className={`chip sm ${presetActive(p.muscles) ? 'on' : ''}`} onClick={() => set('muscles', [...p.muscles])}>
                {p.label}
              </span>
            ))}
          </div>
          <div className="chips">
            {MUSCLE_ORDER.map((m) => (
              <span key={m} className={`chip ${input.muscles.includes(m) ? 'on' : ''}`} onClick={() => toggleMuscle(m)}>
                {MUSCLE_LABEL[m]}
              </span>
            ))}
          </div>
        </label>
      )}

      <label className="field">
        <span>訓練強度</span>
        <div className="seg">
          {(Object.keys(INTENSITY) as Intensity[]).map((k) => (
            <button key={k} type="button" className={input.intensity === k ? 'on' : ''} onClick={() => set('intensity', k)}>
              {INTENSITY[k].short}
            </button>
          ))}
        </div>
        <small>{INTENSITY[input.intensity].description}</small>
      </label>

      {input.mode !== 'cardio' && (
        <label className="field">
          <span>超級組</span>
          <div className="seg">
            <button type="button" className={input.allowSupersets ? 'on' : ''} onClick={() => set('allowSupersets', true)}>
              允許（省時間、多動作）
            </button>
            <button type="button" className={!input.allowSupersets ? 'on' : ''} onClick={() => set('allowSupersets', false)}>
              不要
            </button>
          </div>
        </label>
      )}

      {children}

      <button className="primary block" disabled={!canSubmit} onClick={() => onSubmit(input)}>
        {submitLabel}
      </button>
    </div>
  );
}
