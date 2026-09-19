import { useEffect, useMemo, useState } from 'react';
import { getExercise } from '../data/exercises';
import { newId } from '../lib/generator';
import { BASE_LIFT_LABEL, estimateBaseLiftFromSet } from '../lib/oneRm';
import { beep, vibrate } from '../lib/sound';
import { useStore } from '../state/store';
import type { BaseLift, RmRecord } from '../types';

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface Timer {
  endsAt: number;
  total: number;
}

export function WorkoutSession() {
  const { state, dispatch } = useStore();
  const workout = state.activeWorkout!;
  const { settings, profile } = state;
  const [now, setNow] = useState(Date.now());
  const [timer, setTimer] = useState<Timer | null>(null);
  const [fired, setFired] = useState(false);
  const [prModal, setPrModal] = useState<{ lift: BaseLift; value: number; current: number }[] | null>(null);
  const [picked, setPicked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const remaining = timer ? Math.max(0, Math.ceil((timer.endsAt - now) / 1000)) : 0;
  useEffect(() => {
    if (timer && remaining === 0 && !fired) {
      setFired(true);
      if (settings.soundOn) beep(3, 990);
      if (settings.vibrateOn) vibrate([200, 100, 200, 100, 400]);
      const t = setTimeout(() => setTimer(null), 4000);
      return () => clearTimeout(t);
    }
  }, [timer, remaining, fired, settings]);

  const startRest = (sec: number) => {
    setFired(false);
    setTimer({ endsAt: Date.now() + sec * 1000, total: sec });
  };

  const plan = state.currentPlan;
  const restFor = (exIndex: number) => plan?.exercises[exIndex]?.restSec ?? settings.defaultRestSec;

  const elapsed = Math.floor((now - new Date(workout.startedAt).getTime()) / 1000);
  const doneSets = workout.exercises.reduce((s, e) => s + e.sets.filter((x) => x.done && !x.warmup).length, 0);
  const totalSets = workout.exercises.reduce((s, e) => s + e.sets.filter((x) => !x.warmup).length, 0);
  const volume = workout.exercises.reduce(
    (s, e) => s + e.sets.filter((x) => x.done && !x.warmup).reduce((v, x) => v + (x.weightKg ?? 0) * (x.reps ?? 0), 0),
    0,
  );

  const prCandidates = useMemo(() => {
    const best: Partial<Record<BaseLift, number>> = {};
    for (const e of workout.exercises) {
      const ex = getExercise(e.exerciseId);
      for (const s of e.sets) {
        if (!s.done || s.warmup || s.weightKg === undefined || !s.reps) continue;
        const est = estimateBaseLiftFromSet(ex, profile, s.weightKg, s.reps);
        if (!est) continue;
        if (est.value > (best[est.lift] ?? -Infinity)) best[est.lift] = est.value;
      }
    }
    const current: Record<BaseLift, number> = { bench: profile.bench1RM, squat: profile.squat1RM, pullup: profile.pullupAdded1RM };
    return (Object.keys(best) as BaseLift[])
      .filter((l) => best[l]! > current[l] + 0.4)
      .map((l) => ({ lift: l, value: best[l]!, current: current[l] }));
  }, [workout, profile]);

  const finish = () => {
    if (prCandidates.length) {
      setPicked(Object.fromEntries(prCandidates.map((c) => [c.lift, true])));
      setPrModal(prCandidates);
      return;
    }
    dispatch({ type: 'finishWorkout' });
  };

  const confirmFinish = () => {
    for (const c of prModal ?? []) {
      if (!picked[c.lift]) continue;
      const record: RmRecord = { id: newId(), lift: c.lift, date: new Date().toISOString().slice(0, 10), value: c.value, source: 'estimated', bodyweightKg: profile.weightKg };
      dispatch({ type: 'addRmRecord', record });
    }
    setPrModal(null);
    dispatch({ type: 'finishWorkout' });
  };

  const groupShown = new Set<string>();

  return (
    <div>
      <div className="card tight">
        <div className="card-title">
          <h2>{workout.title}</h2>
          <span className="dim">⏱ {fmt(elapsed)}</span>
        </div>
        <div className="row" style={{ marginTop: 6 }}>
          <div className="stat">
            <div className="v">
              {doneSets}/{totalSets}
            </div>
            <div className="l">完成組數</div>
          </div>
          <div className="stat">
            <div className="v">{Math.round(volume)}</div>
            <div className="l">總量 kg</div>
          </div>
          <div className="stat">
            <div className="v">{settings.defaultRestSec}s</div>
            <div className="l">預設休息</div>
          </div>
        </div>
      </div>

      {workout.exercises.map((e, ei) => {
        const ex = getExercise(e.exerciseId);
        const showGroup = e.supersetGroup && !groupShown.has(e.supersetGroup);
        if (e.supersetGroup) groupShown.add(e.supersetGroup);
        const timed = e.sets.some((s) => typeof s.targetReps === 'string' && s.targetReps.endsWith('秒'));
        return (
          <div key={`${e.exerciseId}-${ei}`}>
            {showGroup && <div className="superset-label">⚡ 超級組 {e.supersetGroup}</div>}
            <div className={`ex-card ${e.supersetGroup ? 'superset' : ''}`}>
              <div className="ex-head">
                <div>
                  <div className="ex-name">
                    {ei + 1}. {ex.name}
                  </div>
                  <div className="ex-en">
                    {ex.nameEn}
                    {ex.perHand ? '・每手' : ''}
                    {ex.bodyweight ? '・徒手（填額外負重）' : ''}
                  </div>
                </div>
                <button className="sm auto ghost" onClick={() => startRest(restFor(ei))}>
                  休息 {restFor(ei)}s
                </button>
              </div>
              {ex.tip && (
                <details className="tip" style={{ marginBottom: 6 }}>
                  <summary style={{ cursor: 'pointer' }}>動作要點</summary>
                  <div style={{ marginTop: 4 }}>{ex.tip}</div>
                </details>
              )}
              <div className="sets">
                <div className="set-row head">
                  <span>組</span>
                  <span>kg</span>
                  <span>{timed ? '秒' : '次'}</span>
                  <span></span>
                </div>
                {e.sets.map((s, si) => (
                  <div key={si} className={`set-row ${s.warmup ? 'warm' : ''} ${s.done ? 'done' : ''}`}>
                    <span className="n">
                      {s.warmup ? '熱身' : `#${e.sets.slice(0, si + 1).filter((x) => !x.warmup).length}`}
                      <br />
                      <small>{s.targetReps}</small>
                    </span>
                    <input
                      className="small"
                      type="number"
                      step="0.5"
                      inputMode="decimal"
                      value={s.weightKg ?? ''}
                      placeholder={s.targetWeightKg?.toString() ?? '自選'}
                      onChange={(ev) => dispatch({ type: 'updateActiveSet', exIndex: ei, setIndex: si, patch: { weightKg: ev.target.value === '' ? undefined : Number(ev.target.value) } })}
                    />
                    <input
                      className="small"
                      type="number"
                      inputMode="numeric"
                      value={s.reps ?? ''}
                      onChange={(ev) => dispatch({ type: 'updateActiveSet', exIndex: ei, setIndex: si, patch: { reps: ev.target.value === '' ? undefined : Number(ev.target.value) } })}
                    />
                    <button
                      className={`check ${s.done ? 'on' : ''}`}
                      onClick={() => {
                        const done = !s.done;
                        dispatch({ type: 'updateActiveSet', exIndex: ei, setIndex: si, patch: { done } });
                        if (done) startRest(s.warmup ? 45 : restFor(ei));
                      }}
                    >
                      {s.done ? '✓' : ''}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {workout.cardio && (
        <div className="ex-card" style={{ borderLeft: '4px solid var(--green)' }}>
          <div className="ex-head">
            <div>
              <div className="ex-name">🏃 {getExercise(workout.cardio.exerciseId).name}</div>
              <div className="ex-en">{workout.cardio.minutes} 分鐘</div>
            </div>
            <button className={`check ${workout.cardio.done ? 'on' : ''}`} style={{ width: 44, height: 40 }} onClick={() => dispatch({ type: 'setActiveCardioDone', done: !workout.cardio!.done })}>
              {workout.cardio.done ? '✓' : ''}
            </button>
          </div>
          <p style={{ fontSize: 14 }}>{workout.cardio.description}</p>
        </div>
      )}

      <label className="field">
        <span>備註</span>
        <textarea rows={2} value={workout.notes ?? ''} onChange={(e) => dispatch({ type: 'setActiveNotes', notes: e.target.value })} placeholder="今天狀態、哪個動作有感…" />
      </label>

      <div className="row" style={{ marginBottom: 80 }}>
        <button className="danger" onClick={() => confirm('確定放棄這次訓練？不會保存紀錄。') && dispatch({ type: 'discardWorkout' })}>
          放棄
        </button>
        <button className="success" onClick={finish}>
          ✔ 完成訓練
        </button>
      </div>

      {timer && (
        <div className="timer">
          <div className="time">{remaining === 0 ? 'GO!' : fmt(remaining)}</div>
          <div className="bar">
            <div style={{ width: `${(remaining / timer.total) * 100}%` }} />
          </div>
          <button className="sm" onClick={() => setTimer((t) => (t ? { ...t, endsAt: t.endsAt + 30000, total: t.total + 30 } : t))}>
            +30s
          </button>
          <button className="sm ghost" onClick={() => setTimer(null)}>
            跳過
          </button>
        </div>
      )}

      {prModal && (
        <div className="modal-bg">
          <div className="modal">
            <h2>🎉 偵測到新的 1RM 推估</h2>
            <p className="dim">依今天完成的組數以 Epley 公式推算，勾選要更新的項目：</p>
            {prModal.map((c) => (
              <label key={c.lift} className="alt-item" style={{ cursor: 'pointer' }}>
                <span>
                  {BASE_LIFT_LABEL[c.lift]}：{c.current} → <strong>{c.value} kg</strong>
                  {c.lift === 'pullup' ? '（額外負重）' : ''}
                </span>
                <input type="checkbox" checked={!!picked[c.lift]} onChange={(e) => setPicked({ ...picked, [c.lift]: e.target.checked })} style={{ width: 22, height: 22 }} />
              </label>
            ))}
            <div className="row" style={{ marginTop: 12 }}>
              <button onClick={() => { setPrModal(null); dispatch({ type: 'finishWorkout' }); }}>都不更新</button>
              <button className="primary" onClick={confirmFinish}>
                更新並完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
