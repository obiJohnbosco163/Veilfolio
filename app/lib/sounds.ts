'use client';

const STORAGE_KEY = 'veilfolio:sound';

let ctx: AudioContext | null = null;
let enabled = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) !== 'off' : true;

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(value: boolean): void {
  enabled = value;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, { dur = 0.08, type = 'sine', gain = 0.06, freqEnd, when = 0 }: {
  dur?: number; type?: OscillatorType; gain?: number; freqEnd?: number; when?: number;
} = {}): void {
  const c = getCtx();
  if (!c || !enabled) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + dur);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(amp).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  click(): void {
    tone(480, { dur: 0.05, type: 'triangle', gain: 0.045 });
  },
  pop(): void {
    tone(620, { dur: 0.06, type: 'sine', gain: 0.05, freqEnd: 900 });
  },
  connect(): void {
    tone(440, { dur: 0.09, type: 'triangle', gain: 0.07 });
    tone(660, { dur: 0.14, type: 'triangle', gain: 0.07, when: 0.07 });
  },
  disconnect(): void {
    tone(660, { dur: 0.08, type: 'triangle', gain: 0.06 });
    tone(440, { dur: 0.12, type: 'triangle', gain: 0.06, when: 0.06 });
  },
  toggle(on: boolean): void {
    tone(on ? 620 : 520, { dur: 0.07, type: 'sine', gain: 0.06 });
    tone(on ? 880 : 360, { dur: 0.1, type: 'sine', gain: 0.06, freqEnd: on ? 990 : 300, when: 0.05 });
  },
  step(): void {
    tone(520, { dur: 0.06, type: 'triangle', gain: 0.055 });
  },
  submit(): void {
    tone(523, { dur: 0.07, type: 'triangle', gain: 0.07 });
    tone(659, { dur: 0.09, type: 'triangle', gain: 0.07, when: 0.07 });
  },
  success(): void {
    tone(523, { dur: 0.09, type: 'sine', gain: 0.08 });
    tone(659, { dur: 0.09, type: 'sine', gain: 0.08, when: 0.08 });
    tone(784, { dur: 0.16, type: 'sine', gain: 0.08, when: 0.16 });
  },
  error(): void {
    tone(220, { dur: 0.14, type: 'sawtooth', gain: 0.05, freqEnd: 150 });
    tone(180, { dur: 0.18, type: 'sawtooth', gain: 0.04, freqEnd: 120, when: 0.08 });
  },
} as const;