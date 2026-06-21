"use client";

import { useTraining } from "@/lib/context";
import { bestWeightForExercise } from "@/lib/store";
import { Tag } from "@/components/ui/tag";
import { Panel } from "@/components/ui/panel";

const WEEK_LABELS = [
  "Week 1 · Reintroduce",
  "Week 2 · Build",
  "Week 3 · Peak",
  "Week 4 · Deload + 1RM Test",
];

function fmtSec(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export default function ProgramPage() {
  const { db } = useTraining();
  const p = db.program;

  return (
    <>
      <Panel>
        <h2 className="text-xl font-bold mb-1">{p.name}</h2>
        <p className="text-muted text-sm mb-4">
          {p.weeks.length}-week mesocycle · +{p.progressionUpperKg}kg upper / +{p.progressionLowerKg}kg lower
          when clean · sleep target {p.sleepTargetH}h · bedtime {p.bedtimeTarget} · caffeine cap {p.caffeineLimitMg}mg
        </p>
        <div className="bg-panel2 border-l-4 border-accent text-sm p-3 rounded mb-4">
          Your complete program — every set, rep, rest, and coaching cue. No external reference needed.
        </div>

        {/* Goals */}
        <div className="mb-4">
          <div className="text-sm font-bold mb-2">Goals (priority order):</div>
          <div className="flex flex-wrap gap-2">
            {p.goals.map((g, i) => (
              <span key={i} className="text-xs bg-accent2/20 text-accent2 border border-accent2/30 rounded-full px-3 py-1">{g}</span>
            ))}
          </div>
        </div>

        {/* Principles */}
        {p.principles && (
          <ul className="text-sm text-muted space-y-1 list-disc list-inside">
            {p.principles.map((pr, i) => <li key={i}>{pr}</li>)}
          </ul>
        )}
      </Panel>

      {/* EXOS Sequence */}
      {p.exosSequence && (
        <Panel>
          <h2 className="text-lg font-bold mb-3">EXOS Session Sequence</h2>
          <p className="text-muted text-sm mb-3">Every strength day follows this 8-component order. Prep earns the right to load.</p>
          <div className="grid grid-cols-2 gap-2">
            {p.exosSequence.map(([title, desc], i) => (
              <div key={i} className="flex gap-3 bg-panel2 border border-border rounded-xl p-3">
                <span className="text-accent font-black text-lg w-5 flex-none">{i + 1}</span>
                <div>
                  <div className="font-bold text-sm">{title}</div>
                  <div className="text-xs text-muted">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Benchmarks */}
      {p.benchmarks && (
        <Panel>
          <h2 className="text-lg font-bold mb-3">Benchmark Lifts</h2>
          <p className="text-muted text-sm mb-3">Progress by adding load when all sets are clean. True 1RM tested in Week 4.</p>
          <div className="grid grid-cols-2 gap-3">
            {p.benchmarks.map((b, i) => {
              const res = bestWeightForExercise(db, b.name);
              return (
                <div key={i} className="flex items-center gap-3 bg-panel2 border border-border rounded-xl p-3">
                  <div className="flex-1">
                    <div className="font-bold text-sm">{b.name}</div>
                    <div className="text-xs text-muted">{b.group} · {b.prog}</div>
                  </div>
                  <div className="text-2xl font-black text-accent">
                    {res.best != null ? `${res.best}kg` : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Week-by-week program */}
      {p.weeks.map((week, wi) => (
        <Panel key={wi}>
          <h2 className="text-lg font-bold text-accent2 mb-3">{WEEK_LABELS[wi] ?? `Week ${wi + 1}`}</h2>
          {week.map((day, di) => {
            let exCount = 0;
            let restTotal = 0;
            day.blocks.forEach((b) => b.items.forEach((it) => { exCount++; restTotal += it.restSec || 0; }));

            return (
              <details key={di} className="border border-border rounded-xl mb-2 overflow-hidden">
                <summary className="cursor-pointer p-3 font-bold text-sm bg-panel2 hover:bg-panel flex items-center gap-2 select-none">
                  <span className="text-accent">▸</span>
                  {day.day} — {day.focus}
                  <span className="text-muted font-normal ml-auto text-xs">
                    {exCount} items · ~{Math.round(restTotal / 60)} min rest
                  </span>
                </summary>
                <div className="p-3 space-y-3">
                  {day.blocks.map((blk, bi) => (
                    <div key={bi} className="border border-border rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 bg-panel2 px-3 py-2">
                        <span className="font-bold text-sm">{blk.name}</span>
                        <Tag type={blk.type} />
                      </div>
                      {blk.items.map((it, ii) => (
                        <div key={ii} className="px-3 py-2 border-t border-border flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          <span className="font-semibold flex-1">
                            {it.ex}
                            {it.wall && <span className="ml-1 text-xs bg-cyan-950 text-cyan-300 rounded px-1.5 py-0.5">{it.wall === "L" ? "Left hand" : "Right hand"}</span>}
                            {it.test && <span className="ml-1 text-xs bg-red-600 text-white rounded px-1.5 py-0.5">1RM TEST</span>}
                          </span>
                          <span className="text-muted">{it.spec}{it.load ? " · log weight" : ""}</span>
                          <span className="text-muted">{it.restSec ? `⏱ ${fmtSec(it.restSec)}` : "—"}</span>
                          {it.cue && <span className="w-full text-xs text-muted italic">💡 {it.cue}</span>}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
        </Panel>
      ))}

      {/* Daily lifestyle */}
      <Panel>
        <h2 className="text-lg font-bold mb-3">Daily Lifestyle & Recovery</h2>
        <div className="flex flex-wrap gap-2">
          {p.recovery.map((r, i) => (
            <span key={i} className="text-xs bg-panel2 border border-border rounded-full px-3 py-1.5 text-muted">{r.label}</span>
          ))}
        </div>
      </Panel>
    </>
  );
}
