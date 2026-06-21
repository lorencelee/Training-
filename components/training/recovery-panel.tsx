"use client";

import { useTraining } from "@/lib/context";
import { calcRecoveryScore, scoreColor } from "@/lib/recovery";
import { getLog } from "@/lib/store";
import { Panel } from "@/components/ui/panel";

interface Props { date: string }

export function RecoveryPanel({ date }: Props) {
  const { db, updateLog } = useTraining();
  const log = getLog(db, date);
  const score = calcRecoveryScore(log, db.program);

  function set(key: string, value: string | boolean) {
    updateLog(date, (l) => ({ ...l, recovery: { ...l.recovery, [key]: value } }));
  }

  const r = log.recovery;
  const col = scoreColor(score.total);
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - score.total / 100);

  return (
    <Panel>
      <h2 className="text-lg font-bold mb-1">Recovery Score</h2>
      <p className="text-muted text-sm mb-4">Sleep · caffeine · stretching → daily readiness</p>

      <div className="flex gap-6 flex-wrap items-start">
        {/* Ring */}
        <div className="relative w-28 h-28 flex-none">
          <svg width="112" height="112" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#2c3947" strokeWidth="12" />
            <circle cx="60" cy="60" r={radius} fill="none" stroke={col} strokeWidth="12"
              strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: col }}>{score.total}</span>
            <span className="text-xs text-muted">readiness</span>
          </div>
        </div>

        {/* Inputs */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">Bedtime</label>
              <input type="time" value={r.bed} onChange={(e) => set("bed", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">Wake time</label>
              <input type="time" value={r.wake} onChange={(e) => set("wake", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">Caffeine (mg)</label>
              <input type="number" min="0" step="10" placeholder="e.g. 150" value={r.caffMg}
                onChange={(e) => set("caffMg", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">Last caffeine time</label>
              <input type="time" value={r.caffTime} onChange={(e) => set("caffTime", e.target.value)} />
            </div>
          </div>

          <label className="flex items-center gap-2 mt-3 cursor-pointer">
            <input type="checkbox" checked={r.stretch} onChange={(e) => set("stretch", e.target.checked)} />
            <span className="text-sm">Stretching / mobility done</span>
          </label>

          <div className="flex gap-4 flex-wrap mt-3 text-xs">
            <span style={{ color: "#3fb950" }}>Sleep {score.sleepH != null ? score.sleepH + "h" : "—"} ({score.parts.dur}/40)</span>
            <span style={{ color: "#4cc2ff" }}>Timing {score.parts.timing}/15</span>
            <span style={{ color: "#d29922" }}>Caffeine {score.parts.caff}/20</span>
            <span style={{ color: "#7c5cff" }}>Stretch {score.parts.stretch}/15</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}
