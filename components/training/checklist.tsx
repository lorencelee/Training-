"use client";

import { useTraining } from "@/lib/context";
import { getLog, checkId, prevWeightFor } from "@/lib/store";
import { Tag } from "@/components/ui/tag";
import { RestTimer } from "./rest-timer";
import type { TrainingDay } from "@/lib/types";
import { clsx } from "clsx";

interface Props {
  date: string;
  dayTpl: TrainingDay;
  weekNum: number;
  totalWeeks: number;
  finished: boolean;
}

export function Checklist({ date, dayTpl, weekNum, totalWeeks, finished }: Props) {
  const { db, updateLog } = useTraining();
  const log = getLog(db, date);

  // Count all items
  const allIds: string[] = [];
  dayTpl.blocks.forEach((blk, bi) => blk.items.forEach((_, ii) => allIds.push(checkId(bi, ii))));
  db.program.recovery.forEach((r) => allIds.push("rec::" + r.key));

  const doneCount = allIds.filter((id) => log.checks[id]).length;
  const pct = allIds.length ? Math.round((doneCount / allIds.length) * 100) : 0;

  const isTeamDay = dayTpl.blocks.some((b) => b.type === "team");

  function toggle(id: string, val: boolean) {
    updateLog(date, (l) => ({ ...l, checks: { ...l.checks, [id]: val } }));
  }
  function setWeight(id: string, val: string) {
    updateLog(date, (l) => ({ ...l, weights: { ...l.weights, [id]: val === "" ? "" : Number(val) } }));
  }
  function setReps(id: string, val: string) {
    updateLog(date, (l) => ({ ...l, reps: { ...l.reps, [id]: val } }));
  }
  function setWall(side: string, val: string) {
    updateLog(date, (l) => ({ ...l, wall: { ...l.wall, [side]: val === "" ? "" : Number(val) } }));
  }
  function setField(key: string, val: string) {
    updateLog(date, (l) => ({ ...l, [key]: val }));
  }

  return (
    <div className="bg-panel border border-border rounded-2xl p-5 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap mb-3">
        <h2 className="text-lg font-bold">{dayTpl.day}: {dayTpl.focus}</h2>
        <span className="ml-auto text-xs bg-accent2/20 text-accent2 border border-accent2/30 rounded-full px-2.5 py-1">
          Week {weekNum}/{totalWeeks}
        </span>
        {finished && (
          <span className="text-xs bg-good/20 text-good border border-good/30 rounded-full px-2.5 py-1">
            Cycle complete
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2.5 bg-panel2 rounded-full border border-border overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent to-good rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-bold w-10 text-right">{pct}%</span>
      </div>
      <p className="text-muted text-sm mb-4">{doneCount} of {allIds.length} items completed</p>

      {/* Blocks */}
      {dayTpl.blocks.map((blk, bi) => (
        <div key={bi}>
          <div className="flex items-center gap-2 mt-5 mb-2">
            <h3 className="font-bold text-accent text-sm">{blk.name}</h3>
            <Tag type={blk.type} />
          </div>

          {blk.items.map((it, ii) => {
            const id = checkId(bi, ii);
            const done = !!log.checks[id];
            const prevW = it.load ? prevWeightFor(db, it.ex, date) : null;

            return (
              <div key={ii} className={clsx(
                "flex gap-3 p-3 border rounded-xl mb-2 transition-all",
                done ? "opacity-50 bg-green-950/30 border-green-900" : "bg-panel2 border-border"
              )}>
                <div className="flex-none mt-0.5">
                  <input type="checkbox" checked={done} onChange={(e) => toggle(id, e.target.checked)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={clsx("font-bold text-sm", done && "line-through")}>
                    {it.ex}
                    {it.wall && (
                      <span className="ml-2 text-xs bg-cyan-950 text-cyan-300 rounded px-1.5 py-0.5">
                        {it.wall === "L" ? "Left hand" : "Right hand"}
                      </span>
                    )}
                    {it.test && <span className="ml-2 text-xs bg-red-600 text-white rounded px-1.5 py-0.5">1RM TEST</span>}
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    <span className="font-semibold text-txt">{it.spec}</span>
                    {it.restSec > 0 && <> · rest <span className="text-txt">{Math.floor(it.restSec / 60)}:{String(it.restSec % 60).padStart(2, "0")}</span></>}
                    {it.cue && <> · <em>{it.cue}</em></>}
                  </div>

                  {/* Rest timer */}
                  {it.restSec > 0 && (
                    <div className="mt-2">
                      <RestTimer seconds={it.restSec} label={`After ${it.ex}`} />
                    </div>
                  )}

                  {/* Weight logging */}
                  {it.load && (
                    <div className="flex gap-2 mt-2 flex-wrap items-end">
                      <div>
                        <label className="text-xs text-muted font-semibold uppercase tracking-wide block mb-1">Weight (kg)</label>
                        <input type="number" step="0.5" placeholder="load" className="w-24"
                          value={log.weights[id] ?? ""} onChange={(e) => setWeight(id, e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs text-muted font-semibold uppercase tracking-wide block mb-1">Reps done</label>
                        <input type="text" placeholder={it.spec} className="w-28"
                          value={log.reps[id] ?? ""} onChange={(e) => setReps(id, e.target.value)} />
                      </div>
                      {prevW !== null && (
                        <span className="text-xs text-muted self-end pb-2">last: <span className="text-txt font-semibold">{prevW}kg</span></span>
                      )}
                    </div>
                  )}

                  {/* Wall ball */}
                  {it.wall && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <div>
                        <label className="text-xs text-muted font-semibold uppercase tracking-wide block mb-1">
                          {it.wall === "L" ? "Left" : "Right"} hand reps
                        </label>
                        <input type="number" min="0" placeholder="reps" className="w-24"
                          value={log.wall[it.wall] ?? ""} onChange={(e) => setWall(it.wall!, e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs text-muted font-semibold uppercase tracking-wide block mb-1">Drops/misses</label>
                        <input type="number" min="0" placeholder="opt" className="w-24"
                          value={log.wall[(it.wall + "misses") as keyof typeof log.wall] ?? ""}
                          onChange={(e) => setWall(it.wall + "misses", e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Team comment */}
      {isTeamDay && (
        <div className="mt-5">
          <h3 className="font-bold text-accent text-sm mb-2">Session Reflection</h3>
          <textarea
            placeholder="How did team training feel? Focus areas, energy, what to improve..."
            value={log.teamComment}
            onChange={(e) => setField("teamComment", e.target.value)}
          />
        </div>
      )}

      {/* Daily lifestyle */}
      <div className="mt-5">
        <h3 className="font-bold text-accent text-sm mb-2">Lifestyle & Recovery</h3>
        {db.program.recovery.map((r) => {
          const id = "rec::" + r.key;
          const done = !!log.checks[id];
          return (
            <div key={id} className={clsx(
              "flex gap-3 p-3 border rounded-xl mb-2 transition-all",
              done ? "opacity-50 bg-green-950/30 border-green-900" : "bg-panel2 border-border"
            )}>
              <input type="checkbox" checked={done} onChange={(e) => toggle(id, e.target.checked)} />
              <span className={clsx("text-sm font-semibold", done && "line-through")}>{r.label}</span>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="mt-5">
        <h3 className="font-bold text-accent text-sm mb-2">Day Notes</h3>
        <textarea
          placeholder="Anything else about today..."
          value={log.notes}
          onChange={(e) => setField("notes", e.target.value)}
        />
      </div>
    </div>
  );
}
