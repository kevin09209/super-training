let ctx: AudioContext | undefined;

function getCtx(): AudioContext | undefined {
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return undefined;
  }
}

/** 使用者第一次互動時呼叫，讓 iOS 允許之後播放聲音 */
export function primeAudio() {
  getCtx();
}

export function beep(times = 1, freq = 880) {
  const c = getCtx();
  if (!c) return;
  for (let i = 0; i < times; i++) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = c.currentTime + i * 0.25;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }
}

export function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* 不支援時忽略 */
  }
}
