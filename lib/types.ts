// ─── Training Program ────────────────────────────────────────────────────────

export type BlockType =
  | "lift"
  | "skill"
  | "cond"
  | "mob"
  | "team"
  | "recov"
  | "pillar"
  | "plyo"
  | "mb"
  | "speed";

export interface TrainingItem {
  ex: string;
  spec: string;
  restSec: number;
  cue?: string;
  load?: boolean;
  wall?: "L" | "R";
  test?: boolean;
}

export interface TrainingBlock {
  name: string;
  type: BlockType;
  items: TrainingItem[];
}

export interface TrainingDay {
  day: string;
  focus: string;
  blocks: TrainingBlock[];
}

export interface Benchmark {
  name: string;
  group: "Upper" | "Lower";
  prog: string;
}

export interface RecoveryItem {
  key: string;
  label: string;
}

export interface Program {
  name: string;
  style: string;
  cycleWeeks?: number;
  progressionUpperKg: number;
  progressionLowerKg: number;
  progressionPct: number;
  caffeineLimitMg: number;
  sleepTargetH: number;
  bedtimeTarget: string;
  goals: string[];
  exosSequence: [string, string][];
  benchmarks: Benchmark[];
  principles: string[];
  gameStats: string[];
  recovery: RecoveryItem[];
  weeks: TrainingDay[][];
}

// ─── Logging ─────────────────────────────────────────────────────────────────

export interface RecoveryLog {
  bed: string;
  wake: string;
  caffMg: string;
  caffTime: string;
  stretch: boolean;
}

export interface DayLog {
  date: string;
  checks: Record<string, boolean>;
  weights: Record<string, number | "">;
  reps: Record<string, string>;
  wall: {
    L?: number | "";
    R?: number | "";
    Lmisses?: number | "";
    Rmisses?: number | "";
  };
  recovery: RecoveryLog;
  teamComment: string;
  gameComment: string;
  gameStats: Record<string, number | "">;
  isGame: boolean;
  notes: string;
}

// ─── Cycles ──────────────────────────────────────────────────────────────────

export interface Cycle {
  id: string;
  name: string;
  startDate: string;
  weeks: number;
  progressionPct: number;
  cycleNumber: number;
}

// ─── App State ───────────────────────────────────────────────────────────────

export interface AppDB {
  program: Program;
  cycles: Cycle[];
  logs: Record<string, DayLog>;
}

// ─── Derived / Computed ──────────────────────────────────────────────────────

export interface RecoveryScore {
  total: number;
  sleepH: number | null;
  parts: {
    dur: number;
    timing: number;
    caff: number;
    stretch: number;
    base: number;
  };
}

export interface PlanForDate {
  cycle: Cycle;
  weekNum: number;
  weekIdx: number;
  dayIndex: number;
  dayName: string;
  dayTpl: TrainingDay;
  finished: boolean;
  diffDays: number;
  before?: never;
}

export interface PlanBefore {
  cycle: Cycle;
  before: true;
}

export type DayPlan = PlanForDate | PlanBefore | null;
