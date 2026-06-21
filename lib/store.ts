"use client";

import type { AppDB, DayLog, Cycle, Program } from "./types";
import { DEFAULT_PROGRAM } from "./program";

const LS_KEY = "personalOS_training_v1";

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyLog(date: string): DayLog {
  return {
    date,
    checks: {},
    weights: {},
    reps: {},
    wall: {},
    recovery: { bed: "", wake: "", caffMg: "", caffTime: "", stretch: false },
    teamComment: "",
    gameComment: "",
    gameStats: {},
    isGame: false,
    notes: "",
  };
}

function freshDB(): AppDB {
  return { program: DEFAULT_PROGRAM, cycles: [], logs: {} };
}

export function loadDB(): AppDB {
  if (typeof window === "undefined") return freshDB();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as AppDB;
  } catch {}
  return freshDB();
}

export function saveDB(db: AppDB): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

export function getLog(db: AppDB, date: string): DayLog {
  return db.logs[date] ?? emptyLog(date);
}

export function setLog(db: AppDB, log: DayLog): AppDB {
  return { ...db, logs: { ...db.logs, [log.date]: log } };
}

// ─── Cycle helpers ────────────────────────────────────────────────────────────

export function activeCycle(db: AppDB): Cycle | null {
  if (!db.cycles.length) return null;
  const today = todayISO();
  const started = db.cycles.filter((c) => c.startDate <= today).sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  return started[0] ?? db.cycles[db.cycles.length - 1];
}

export function createCycle(db: AppDB, startDate: string): AppDB {
  const p = db.program;
  const n = db.cycles.length + 1;
  const cycle: Cycle = {
    id: "c" + Date.now(),
    name: `${p.name} — Cycle ${n}`,
    startDate,
    weeks: p.weeks.length,
    progressionPct: p.progressionPct,
    cycleNumber: n,
  };
  return { ...db, cycles: [...db.cycles, cycle] };
}

export interface PlanResult {
  cycle: Cycle;
  weekNum: number;
  weekIdx: number;
  dayIndex: number;
  dayTpl: AppDB["program"]["weeks"][0][0];
  finished: boolean;
  before?: boolean;
}

export function planForDate(db: AppDB, dateStr: string): PlanResult | null {
  const cycle = activeCycle(db);
  if (!cycle) return null;

  const startD = new Date(cycle.startDate + "T00:00:00");
  const d = new Date(dateStr + "T00:00:00");

  if (d < startD) return { cycle, weekNum: 0, weekIdx: 0, dayIndex: 0, dayTpl: db.program.weeks[0][0], finished: false, before: true };

  // Anchor to the Sunday of the start week
  const startSun = new Date(startD);
  startSun.setDate(startD.getDate() - startD.getDay());

  const totalWeeks = db.program.weeks.length;
  const weekRaw = Math.floor((d.getTime() - startSun.getTime()) / (7 * 86400000));
  const finished = weekRaw >= totalWeeks;
  const weekIdx = Math.max(0, Math.min(weekRaw, totalWeeks - 1));
  const dayIndex = d.getDay(); // 0 = Sun, 6 = Sat

  return {
    cycle,
    weekNum: weekIdx + 1,
    weekIdx,
    dayIndex,
    dayTpl: db.program.weeks[weekIdx][dayIndex],
    finished,
  };
}

export function checkId(blockIdx: number, itemIdx: number): string {
  return `${blockIdx}::${itemIdx}`;
}

// ─── History queries ──────────────────────────────────────────────────────────

export function bestWeightForExercise(db: AppDB, exName: string): { best: number | null; latest: number | null; latestDate: string | null } {
  let best: number | null = null;
  let latest: number | null = null;
  let latestDate: string | null = null;

  Object.keys(db.logs)
    .sort()
    .forEach((date) => {
      const log = db.logs[date];
      const plan = planForDate(db, date);
      if (!plan || plan.before) return;
      plan.dayTpl.blocks.forEach((blk, bi) => {
        blk.items.forEach((it, ii) => {
          if (it.ex === exName) {
            const w = log.weights[checkId(bi, ii)];
            if (w !== undefined && w !== "") {
              const n = Number(w);
              if (best === null || n > best) best = n;
              latest = n;
              latestDate = date;
            }
          }
        });
      });
    });

  return { best, latest, latestDate };
}

export function prevWeightFor(db: AppDB, exName: string, beforeDate: string): number | null {
  const dates = Object.keys(db.logs).filter((d) => d < beforeDate).sort().reverse();
  for (const d of dates) {
    const log = db.logs[d];
    const plan = planForDate(db, d);
    if (!plan || plan.before) continue;
    let found: number | null = null;
    plan.dayTpl.blocks.forEach((blk, bi) => {
      blk.items.forEach((it, ii) => {
        if (it.ex === exName && found === null) {
          const w = log.weights[checkId(bi, ii)];
          if (w !== undefined && w !== "") found = Number(w);
        }
      });
    });
    if (found !== null) return found;
  }
  return null;
}

export function currentStreak(db: AppDB): number {
  let streak = 0;
  const d = new Date(todayISO() + "T00:00:00");
  while (true) {
    const ds = d.toISOString().slice(0, 10);
    const log = db.logs[ds];
    if (log && Object.values(log.checks).some(Boolean)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}
