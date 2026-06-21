"use client";

import { useState } from "react";
import { useTraining } from "@/lib/context";
import { getLog, todayISO } from "@/lib/store";
import { Panel } from "@/components/ui/panel";

function prettyDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "short", day: "numeric",
  });
}

export default function GameDayPage() {
  const { db, updateLog } = useTraining();
  const [date, setDate] = useState(todayISO());
  const log = getLog(db, date);
  const p = db.program;

  function setStat(stat: string, val: string) {
    updateLog(date, (l) => ({ ...l, gameStats: { ...l.gameStats, [stat]: val === "" ? "" : Number(val) } }));
  }
  function setField(key: string, val: string | boolean) {
    updateLog(date, (l) => ({ ...l, [key]: val }));
  }

  const goals = Number(log.gameStats["Goals"] ?? 0);
  const assists = Number(log.gameStats["Assists"] ?? 0);
  const shots = Number(log.gameStats["Shots"] ?? 0);
  const sog = Number(log.gameStats["Shots on Goal"] ?? 0);
  const fow = Number(log.gameStats["Faceoffs Won"] ?? 0);
  const fol = Number(log.gameStats["Faceoffs Lost"] ?? 0);
  const foTotal = fow + fol;

  return (
    <>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
        <button onClick={() => setDate(todayISO())}
          className="px-3 py-1.5 text-sm rounded-lg bg-panel2 border border-border text-muted hover:text-txt">
          Today
        </button>
        <label className="flex items-center gap-2 ml-auto cursor-pointer">
          <input type="checkbox" checked={log.isGame} onChange={(e) => setField("isGame", e.target.checked)} />
          <span className="text-sm">Mark as game</span>
        </label>
      </div>

      <Panel>
        <h2 className="text-xl font-bold mb-1">Game Day Stats</h2>
        <p className="text-muted text-sm mb-4">{prettyDate(date)}</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {p.gameStats.map((stat) => (
            <div key={stat}>
              <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">{stat}</label>
              <input type="number" step="any" value={log.gameStats[stat] ?? ""}
                onChange={(e) => setStat(stat, e.target.value)} />
            </div>
          ))}
        </div>

        {/* Computed */}
        {(shots > 0 || foTotal > 0) && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {shots > 0 && (
              <div className="bg-panel2 border border-border rounded-xl p-3">
                <div className="text-2xl font-black text-accent">{shots > 0 ? Math.round((goals / shots) * 100) : 0}%</div>
                <div className="text-xs text-muted uppercase tracking-wide">Shot %</div>
              </div>
            )}
            {sog > 0 && (
              <div className="bg-panel2 border border-border rounded-xl p-3">
                <div className="text-2xl font-black text-accent">{Math.round((goals / sog) * 100)}%</div>
                <div className="text-xs text-muted uppercase tracking-wide">SOG %</div>
              </div>
            )}
            {foTotal > 0 && (
              <div className="bg-panel2 border border-border rounded-xl p-3">
                <div className="text-2xl font-black text-accent">{Math.round((fow / foTotal) * 100)}%</div>
                <div className="text-xs text-muted uppercase tracking-wide">FO Win %</div>
              </div>
            )}
            <div className="bg-panel2 border border-border rounded-xl p-3">
              <div className="text-2xl font-black text-good">{goals + assists}</div>
              <div className="text-xs text-muted uppercase tracking-wide">Points</div>
            </div>
          </div>
        )}
      </Panel>

      <Panel>
        <h2 className="text-lg font-bold mb-3">Game Reflection</h2>
        <textarea
          style={{ minHeight: 140 }}
          placeholder="Performance, decision-making, energy, matchups, what to work on next..."
          value={log.gameComment}
          onChange={(e) => setField("gameComment", e.target.value)}
        />
      </Panel>
    </>
  );
}
