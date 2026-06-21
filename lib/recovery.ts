import type { DayLog, RecoveryScore, Program } from "./types";

function toMin(t: string): number {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function sleepHours(bed: string, wake: string): number | null {
  if (!bed || !wake) return null;
  let b = toMin(bed);
  let w = toMin(wake);
  if (w <= b) w += 1440; // wake next day
  return Math.round(((w - b) / 60) * 10) / 10;
}

export function calcRecoveryScore(log: DayLog, program: Program): RecoveryScore {
  const r = log.recovery;
  const sleepH = sleepHours(r.bed, r.wake);

  // Sleep duration (40 pts)
  let dur = 0;
  const tgt = program.sleepTargetH;
  if (sleepH !== null) {
    if (sleepH >= tgt) dur = 40;
    else if (sleepH <= 4) dur = 4;
    else dur = Math.round(((sleepH - 4) / (tgt - 4)) * 36 + 4);
    if (sleepH > tgt + 1.5) dur = 36; // slight oversleep ding
  }

  // Sleep timing — bedtime vs target (15 pts)
  let timing = 0;
  if (r.bed) {
    let bm = toMin(r.bed);
    let tm = toMin(program.bedtimeTarget || "23:00");
    if (bm < toMin("12:00")) bm += 1440;
    if (tm < toMin("12:00")) tm += 1440;
    const lateBy = bm - tm;
    timing = lateBy <= 0 ? 15 : Math.max(0, Math.round(15 - lateBy / 15));
  }

  // Caffeine (20 pts)
  let caff = 20;
  if (r.caffMg !== "" && r.caffMg !== null) {
    const mg = Number(r.caffMg) || 0;
    const cap = program.caffeineLimitMg;
    if (mg > cap) caff -= Math.min(12, Math.round(((mg - cap) / 25) * 3));
    if (r.caffTime) {
      const cm = toMin(r.caffTime);
      if (cm >= toMin("15:00"))
        caff -= Math.min(10, Math.round(((cm - toMin("15:00")) / 30) * 2) + 2);
    }
    caff = Math.max(0, caff);
  }

  // Stretching (15 pts)
  const stretch = r.stretch ? 15 : 0;

  // Baseline (10 pts)
  const base = 10;

  const total = Math.max(0, Math.min(100, dur + timing + caff + stretch + base));
  return { total, sleepH, parts: { dur, timing, caff, stretch, base } };
}

export function scoreColor(score: number): string {
  if (score >= 80) return "#3fb950";
  if (score >= 60) return "#d29922";
  return "#f85149";
}
