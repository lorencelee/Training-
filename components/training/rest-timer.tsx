"use client";

import { useState, useEffect, useRef } from "react";

function fmtSec(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

function beep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.start();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

interface RestTimerProps {
  seconds: number;
  label: string;
}

export function RestTimer({ seconds, label }: RestTimerProps) {
  const [active, setActive] = useState(false);
  const [left, setLeft] = useState(seconds);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  function start() {
    setLeft(seconds);
    setActive(true);
  }

  function stop() {
    if (interval.current) clearInterval(interval.current);
    setActive(false);
    setLeft(seconds);
  }

  useEffect(() => {
    if (!active) return;
    interval.current = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval.current!);
          setActive(false);
          beep();
          return seconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (interval.current) clearInterval(interval.current); };
  }, [active, seconds]);

  if (!active) {
    return (
      <button
        onClick={start}
        className="text-xs bg-panel2 border border-border rounded-lg px-2.5 py-1 text-muted hover:border-accent hover:text-txt transition-colors"
      >
        ⏱ Rest {fmtSec(seconds)}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-accent2/20 border border-accent2 rounded-lg px-3 py-1.5">
      <span className="text-xs text-muted">{label}</span>
      <span className="font-mono font-bold text-accent2 text-sm">{fmtSec(left)}</span>
      <button onClick={() => setLeft((l) => l + 15)} className="text-xs text-muted hover:text-txt">+15s</button>
      <button onClick={stop} className="text-xs text-muted hover:text-txt">Stop</button>
    </div>
  );
}
