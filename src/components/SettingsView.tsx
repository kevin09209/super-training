import { useRef, useState } from 'react';
import { ALL_EQUIPMENT, EQUIPMENT } from '../data/equipment';
import { newId } from '../lib/generator';
import { BASE_LIFT_LABEL, epley1RM } from '../lib/oneRm';
import { exportStateJson, useStore } from '../state/store';
import type { AppState, BaseLift, Equipment, Gym, Profile } from '../types';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function SettingsView() {
  const { state, dispatch } = useStore();
  const { profile, gyms, settings } = state;
  const [form, setForm] = useState<Profile>(profile);
  const [calc, setCalc] = useState<{ lift: BaseLift; w: string; r: string } | null>(null);
  const [editGym, setEditGym] = useState<Gym | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const num = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: Number(e.target.value) });

  const saveProfile = () => {
    const changed: [BaseLift, number, number][] = [
      ['bench', profile.bench1RM, form.bench1RM],
      ['squat', profile.squat1RM, form.squat1RM],
      ['pullup', profile.pullupAdded1RM, form.pullupAdded1RM],
    ];
    dispatch({ type: 'setProfile', profile: form });
    for (const [lift, before, after] of changed) {
      if (before !== after) {
        dispatch({ type: 'addRmRecord', record: { id: newId(), lift, date: today(), value: after, source: 'manual', bodyweightKg: form.weightKg } });
      }
    }
    alert('已儲存');
  };

  const applyCalc = () => {
    if (!calc) return;
    const w = Number(calc.w);
    const r = Number(calc.r);
    if (!r) return;
    let v: number;
    if (calc.lift === 'pullup') v = Math.round((epley1RM(form.weightKg + w, r) - form.weightKg) * 2) / 2;
    else v = Math.round(epley1RM(w, r) * 2) / 2;
    setForm({ ...form, [calc.lift === 'bench' ? 'bench1RM' : calc.lift === 'squat' ? 'squat1RM' : 'pullupAdded1RM']: v });
    setCalc(null);
  };

  const toggleEquip = (id: Equipment) => {
    if (!editGym) return;
    const has = editGym.equipment.includes(id);
    setEditGym({ ...editGym, equipment: has ? editGym.equipment.filter((e) => e !== id) : [...editGym.equipment, id] });
  };

  const exportData = () => {
    const blob = new Blob([exportStateJson(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `super-training-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    file.text().then((txt) => {
      try {
        const parsed = JSON.parse(txt) as AppState;
        if (!parsed.profile || !parsed.gyms) throw new Error('bad');
        if (confirm('匯入會覆蓋目前所有資料，確定？')) {
          dispatch({ type: 'importState', state: parsed });
          setForm(parsed.profile);
        }
      } catch {
        alert('檔案格式不正確');
      }
    });
  };

  const groups = Array.from(new Set(EQUIPMENT.map((e) => e.group)));

  return (
    <div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>個人資料</h2>
        <div className="grid3">
          <label className="field">
            <span>年齡</span>
            <input type="number" value={form.age} onChange={num('age')} />
          </label>
          <label className="field">
            <span>身高 cm</span>
            <input type="number" step="0.1" value={form.heightCm} onChange={num('heightCm')} />
          </label>
          <label className="field">
            <span>體重 kg</span>
            <input type="number" step="0.1" value={form.weightKg} onChange={num('weightKg')} />
          </label>
        </div>

        <h3>最大重量（1RM）</h3>
        {(
          [
            ['bench', 'bench1RM', '臥推 1RM (kg)'],
            ['squat', 'squat1RM', '深蹲 1RM (kg)'],
            ['pullup', 'pullupAdded1RM', '引體向上 1RM 額外負重 (kg，徒手填 0)'],
          ] as [BaseLift, keyof Profile, string][]
        ).map(([lift, key, label]) => (
          <label key={key} className="field">
            <span>{label}</span>
            <div className="row">
              <input type="number" step="0.5" value={form[key]} onChange={num(key)} />
              <button className="sm auto" onClick={() => setCalc({ lift, w: '', r: '' })}>
                用重量×次數推算
              </button>
            </div>
          </label>
        ))}
        {calc && (
          <div className="card tight" style={{ borderColor: 'var(--accent)' }}>
            <div className="dim" style={{ marginBottom: 6 }}>
              {BASE_LIFT_LABEL[calc.lift]}：輸入最近一次做到力竭的「重量 × 次數」（12 下以內較準）
            </div>
            <div className="row">
              <input type="number" step="0.5" placeholder={calc.lift === 'pullup' ? '負重 kg' : '重量 kg'} value={calc.w} onChange={(e) => setCalc({ ...calc, w: e.target.value })} />
              <input type="number" placeholder="次數" value={calc.r} onChange={(e) => setCalc({ ...calc, r: e.target.value })} />
              <button className="auto primary" onClick={applyCalc}>
                套用
              </button>
              <button className="auto ghost" onClick={() => setCalc(null)}>
                取消
              </button>
            </div>
          </div>
        )}
        <button className="primary block" onClick={saveProfile}>
          儲存
        </button>
      </div>

      <div className="card">
        <div className="card-title">
          <h2>訓練地點與器材</h2>
          <button className="sm" onClick={() => setEditGym({ id: newId(), name: '新地點', equipment: ['dumbbell', 'bench', 'bodyweight'] })}>
            ＋ 新增
          </button>
        </div>
        {gyms.map((g) => (
          <div key={g.id} className="log-item row">
            <div>
              <strong>{g.name}</strong>
              <div className="dim" style={{ fontSize: 13 }}>
                {g.equipment.length} / {ALL_EQUIPMENT.length} 種器材
              </div>
            </div>
            <button className="sm auto" onClick={() => setEditGym(g)}>
              編輯
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>計時器</h2>
        <label className="field">
          <span>預設組間休息（秒，課表有指定時以課表為準）</span>
          <input type="number" value={settings.defaultRestSec} onChange={(e) => dispatch({ type: 'setSettings', settings: { defaultRestSec: Number(e.target.value) || 60 } })} />
        </label>
        <div className="row">
          <button className={settings.soundOn ? 'primary' : ''} onClick={() => dispatch({ type: 'setSettings', settings: { soundOn: !settings.soundOn } })}>
            🔔 提示音 {settings.soundOn ? '開' : '關'}
          </button>
          <button className={settings.vibrateOn ? 'primary' : ''} onClick={() => dispatch({ type: 'setSettings', settings: { vibrateOn: !settings.vibrateOn } })}>
            📳 震動 {settings.vibrateOn ? '開' : '關'}
          </button>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>資料</h2>
        <p className="dim">所有資料只存在此裝置的瀏覽器裡。換手機前請先匯出備份。</p>
        <div className="row">
          <button onClick={exportData}>匯出備份</button>
          <button onClick={() => fileRef.current?.click()}>匯入備份</button>
          <input ref={fileRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} />
        </div>
        <button className="danger block" style={{ marginTop: 10 }} onClick={() => confirm('清除所有資料？此動作無法復原。') && dispatch({ type: 'reset' })}>
          清除所有資料
        </button>
      </div>

      {editGym && (
        <div className="modal-bg" onClick={() => setEditGym(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <label className="field">
              <span>地點名稱</span>
              <input type="text" value={editGym.name} onChange={(e) => setEditGym({ ...editGym, name: e.target.value })} />
            </label>
            <div className="row" style={{ marginBottom: 8 }}>
              <button className="sm" onClick={() => setEditGym({ ...editGym, equipment: [...ALL_EQUIPMENT] })}>
                全選
              </button>
              <button className="sm" onClick={() => setEditGym({ ...editGym, equipment: [] })}>
                全不選
              </button>
            </div>
            {groups.map((grp) => (
              <div key={grp} className="equip-group">
                <h4>{grp}</h4>
                <div className="chips">
                  {EQUIPMENT.filter((e) => e.group === grp).map((e) => (
                    <span key={e.id} className={`chip sm ${editGym.equipment.includes(e.id) ? 'on' : ''}`} onClick={() => toggleEquip(e.id)}>
                      {e.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className="row" style={{ marginTop: 14 }}>
              {gyms.length > 1 && gyms.some((g) => g.id === editGym.id) && (
                <button
                  className="danger auto"
                  onClick={() => {
                    if (confirm(`刪除「${editGym.name}」？`)) {
                      dispatch({ type: 'deleteGym', id: editGym.id });
                      setEditGym(null);
                    }
                  }}
                >
                  刪除
                </button>
              )}
              <button className="ghost" onClick={() => setEditGym(null)}>
                取消
              </button>
              <button
                className="primary"
                onClick={() => {
                  dispatch({ type: 'upsertGym', gym: editGym });
                  setEditGym(null);
                }}
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
