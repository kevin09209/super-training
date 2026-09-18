import { useState } from 'react';
import { getExercise } from '../data/exercises';
import { newId } from '../lib/generator';
import { BASE_LIFT_LABEL, epley1RM } from '../lib/oneRm';
import { useStore } from '../state/store';
import type { BaseLift, RmRecord, WorkoutLog } from '../types';
import { OneRmChart } from './OneRmChart';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function logVolume(l: WorkoutLog) {
  return l.exercises.reduce((s, e) => s + e.sets.filter((x) => x.done && !x.warmup).reduce((v, x) => v + (x.weightKg ?? 0) * (x.reps ?? 0), 0), 0);
}

function logDuration(l: WorkoutLog) {
  if (!l.finishedAt) return 0;
  return Math.round((new Date(l.finishedAt).getTime() - new Date(l.startedAt).getTime()) / 60000);
}

export function HistoryView() {
  const { state, dispatch } = useStore();
  const { logs, rmRecords, profile } = state;
  const [lift, setLift] = useState<BaseLift>('bench');
  const [date, setDate] = useState(today());
  const [value, setValue] = useState('');
  const [calcW, setCalcW] = useState('');
  const [calcR, setCalcR] = useState('');
  const [openLog, setOpenLog] = useState<string | null>(null);

  const weekAgo = Date.now() - 7 * 86400000;
  const thisWeek = logs.filter((l) => new Date(l.startedAt).getTime() > weekAgo);
  const records = rmRecords.filter((r) => r.lift === lift);
  const current = lift === 'bench' ? profile.bench1RM : lift === 'squat' ? profile.squat1RM : profile.pullupAdded1RM;

  const calcEst = () => {
    const w = Number(calcW);
    const r = Number(calcR);
    if (!w && lift !== 'pullup') return undefined;
    if (!r) return undefined;
    if (lift === 'pullup') {
      const total = epley1RM(profile.weightKg + w, r);
      return Math.round((total - profile.weightKg) * 2) / 2;
    }
    return Math.round(epley1RM(w, r) * 2) / 2;
  };
  const est = calcEst();

  const addRecord = (v: number) => {
    const record: RmRecord = { id: newId(), lift, date, value: v, source: 'manual', bodyweightKg: profile.weightKg };
    dispatch({ type: 'addRmRecord', record });
    setValue('');
    setCalcW('');
    setCalcR('');
  };

  return (
    <div>
      <div className="card tight">
        <div className="row">
          <div className="stat">
            <div className="v">{logs.length}</div>
            <div className="l">總訓練次數</div>
          </div>
          <div className="stat">
            <div className="v">{thisWeek.length}</div>
            <div className="l">近 7 天</div>
          </div>
          <div className="stat">
            <div className="v">{Math.round(thisWeek.reduce((s, l) => s + logVolume(l), 0) / 1000 * 10) / 10}t</div>
            <div className="l">近 7 天總量</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <h2>1RM 進度</h2>
          <span className="dim">
            目前 {current}
            {lift === 'pullup' ? ' kg 負重' : ' kg'}
          </span>
        </div>
        <div className="seg" style={{ margin: '10px 0' }}>
          {(Object.keys(BASE_LIFT_LABEL) as BaseLift[]).map((l) => (
            <button key={l} className={lift === l ? 'on' : ''} onClick={() => setLift(l)}>
              {BASE_LIFT_LABEL[l]}
            </button>
          ))}
        </div>
        <OneRmChart points={records.map((r) => ({ date: r.date, value: r.value }))} />

        <h3>新增紀錄</h3>
        <div className="row">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="number" step="0.5" placeholder={lift === 'pullup' ? '額外負重 kg' : '1RM kg'} value={value} onChange={(e) => setValue(e.target.value)} />
          <button className="auto primary" disabled={value === ''} onClick={() => addRecord(Number(value))}>
            新增
          </button>
        </div>
        <p className="dim" style={{ marginTop: 10 }}>或用「重量 × 次數」推算（Epley）：</p>
        <div className="row">
          <input type="number" step="0.5" placeholder={lift === 'pullup' ? '負重 kg（0=徒手）' : '重量 kg'} value={calcW} onChange={(e) => setCalcW(e.target.value)} />
          <input type="number" placeholder="次數" value={calcR} onChange={(e) => setCalcR(e.target.value)} />
          <button className="auto" disabled={est === undefined} onClick={() => est !== undefined && addRecord(est)}>
            {est !== undefined ? `≈ ${est} kg 新增` : '推算'}
          </button>
        </div>

        {records.length > 0 && (
          <>
            <h3>歷史</h3>
            {[...records].reverse().slice(0, 8).map((r) => (
              <div key={r.id} className="log-item row">
                <span>
                  {r.date}・<strong>{r.value} kg</strong> <span className="badge">{r.source === 'manual' ? '手動' : '推估'}</span>
                </span>
                <button className="sm ghost auto danger" onClick={() => confirm('刪除這筆紀錄？') && dispatch({ type: 'deleteRmRecord', id: r.id })}>
                  刪除
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>訓練紀錄</h2>
        {logs.length === 0 && <div className="empty">完成第一次訓練後，紀錄會出現在這裡。</div>}
        {logs.map((l) => {
          const isOpen = openLog === l.id;
          return (
            <div key={l.id} className="log-item">
              <div className="row" onClick={() => setOpenLog(isOpen ? null : l.id)} style={{ cursor: 'pointer' }}>
                <div>
                  <strong>{l.title}</strong>
                  <div className="dim" style={{ fontSize: 13 }}>
                    {new Date(l.startedAt).toLocaleDateString('zh-TW')}・{logDuration(l)} 分鐘・總量 {Math.round(logVolume(l))} kg
                  </div>
                </div>
                <span className="dim auto">{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div style={{ marginTop: 8, fontSize: 14 }}>
                  {l.exercises.map((e, i) => {
                    const done = e.sets.filter((s) => s.done && !s.warmup);
                    return (
                      <div key={i} style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{getExercise(e.exerciseId).name}</span>
                        <span className="dim">
                          {' '}
                          {done.length === 0 ? '未完成' : done.map((s) => `${s.weightKg ?? '徒手'}×${s.reps ?? '-'}`).join('、')}
                        </span>
                      </div>
                    );
                  })}
                  {l.cardio && (
                    <div className="dim">
                      🏃 {getExercise(l.cardio.exerciseId).name} {l.cardio.minutes} 分鐘 {l.cardio.done ? '✓' : '（未完成）'}
                    </div>
                  )}
                  {l.notes && <div className="tip">{l.notes}</div>}
                  <button className="sm ghost danger" style={{ marginTop: 8 }} onClick={() => confirm('刪除這筆訓練紀錄？') && dispatch({ type: 'deleteLog', id: l.id })}>
                    刪除紀錄
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
