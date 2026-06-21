"use client";

import { useTraining } from "@/lib/context";
import { planForDate, currentStreak, getLog } from "@/lib/store";
import { calcRecoveryScore, scoreColor } from "@/lib/recovery";
import { Panel } from "@/components/ui/panel";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

function kpi(label: string, value: string | number, color?: string) {
  return (
    <div className="bg-panel2 border border-border rounded-xl p-4">
      <div className="text-xs text-muted uppercase tracking-wide mb-1">{label}</div>
      <div className="text-3xl font-black" style={color ? { color } : {}}>{value}</div>
    </div>
  );
}

export default function HistoryPage() {
  const { db } = useTraining();
  const dates = Object.keys(db.logs).sort();

  if (!dates.length) {
    return (
      <Panel>
        <h2 className="text-xl font-bold mb-2">History</h2>
        <p className="text-muted text-sm">No data yet. Start ticking off your daily checklist and performance trends will appear here.</p>
      </Panel>
    );
  }

  // Aggregate
  let totalChecks = 0;
  const recScores: number[] = [];
  const games: { date: string; log: ReturnType<typeof getLog> }[] = [];

  dates.forEach((d) => {
    const log = db.logs[d];
    totalChecks += Object.values(log.checks).filter(Boolean).length;
    const rs = calcRecoveryScore(log, db.program);
    if (log.recovery.bed || log.recovery.wake) recScores.push(rs.total);
    if (log.isGame) games.push({ date: d, log });
  });

  const avgRec = recScores.length ? Math.round(recScores.reduce((a, b) => a + b, 0) / recScores.length) : 0;
  const streak = currentStreak(db);

  // Chart data
  const recData = dates
    .map((d) => {
      const log = db.logs[d];
      const has = log.recovery.bed || log.recovery.wake;
      return has ? { date: d.slice(5), score: calcRecoveryScore(log, db.program).total } : null;
    })
    .filter(Boolean) as { date: string; score: number }[];

  const wallData = dates
    .filter((d) => db.logs[d].wall.R !== undefined || db.logs[d].wall.L !== undefined)
    .map((d) => ({
      date: d.slice(5),
      R: db.logs[d].wall.R !== "" ? Number(db.logs[d].wall.R) : null,
      L: db.logs[d].wall.L !== "" ? Number(db.logs[d].wall.L) : null,
    }));

  const compData = dates.map((d) => {
    const log = db.logs[d];
    const plan = planForDate(db, d);
    let total = db.program.recovery.length;
    if (plan && !plan.before) plan.dayTpl.blocks.forEach((b) => (total += b.items.length));
    const done = Object.values(log.checks).filter(Boolean).length;
    return { date: d.slice(5), pct: total ? Math.round((done / total) * 100) : 0 };
  });

  // Benchmark progression for all benchmarks
  const benchData: Record<string, { date: string; kg: number }[]> = {};
  db.program.benchmarks?.forEach((b) => { benchData[b.name] = []; });
  dates.forEach((d) => {
    const log = db.logs[d];
    const plan = planForDate(db, d);
    if (!plan || plan.before) return;
    plan.dayTpl.blocks.forEach((blk, bi) => {
      blk.items.forEach((it, ii) => {
        if (it.load && benchData[it.ex] !== undefined) {
          const w = log.weights[`${bi}::${ii}`];
          if (w !== undefined && w !== "") {
            benchData[it.ex].push({ date: d.slice(5), kg: Number(w) });
          }
        }
      });
    });
  });

  const benchColors: Record<string, string> = {
    "Back Squat": "#4cc2ff",
    "Trap-Bar Deadlift": "#3fb950",
    "Bench Press": "#7c5cff",
    "Barbell Shoulder Press": "#f0b252",
    "Weighted Pull-up": "#f08a8a",
  };

  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {kpi("Days logged", dates.length)}
        {kpi("Avg recovery", avgRec, scoreColor(avgRec))}
        {kpi("Streak 🔥", streak)}
        {kpi("Items completed", totalChecks)}
        {kpi("Games played", games.length)}
        {kpi("Cycles", db.cycles.length)}
      </div>

      {/* Recovery trend */}
      {recData.length > 0 && (
        <Panel>
          <h2 className="text-lg font-bold mb-4">Recovery Score Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={recData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3947" />
              <XAxis dataKey="date" tick={{ fill: "#8a99a8", fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#8a99a8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1a2129", border: "1px solid #2c3947", borderRadius: 8 }} />
              <Line type="monotone" dataKey="score" stroke="#3fb950" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      )}

      {/* Benchmark progression */}
      {Object.entries(benchData).some(([, data]) => data.length > 0) && (
        <Panel>
          <h2 className="text-lg font-bold mb-4">Strength Progression</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3947" />
              <XAxis dataKey="date" tick={{ fill: "#8a99a8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#8a99a8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1a2129", border: "1px solid #2c3947", borderRadius: 8 }} />
              <Legend />
              {Object.entries(benchData).filter(([, d]) => d.length > 0).map(([name, data]) => (
                <Line key={name} data={data} type="monotone" dataKey="kg" name={name}
                  stroke={benchColors[name] ?? "#4cc2ff"} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      )}

      {/* Wall ball */}
      {wallData.length > 0 && (
        <Panel>
          <h2 className="text-lg font-bold mb-4">Wall Ball Reps — L vs R</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={wallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3947" />
              <XAxis dataKey="date" tick={{ fill: "#8a99a8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#8a99a8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1a2129", border: "1px solid #2c3947", borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="R" name="Right hand" stroke="#4cc2ff" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="L" name="Left hand" stroke="#7c5cff" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      )}

      {/* Completion */}
      {compData.length > 0 && (
        <Panel>
          <h2 className="text-lg font-bold mb-4">Daily Completion %</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={compData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3947" />
              <XAxis dataKey="date" tick={{ fill: "#8a99a8", fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#8a99a8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1a2129", border: "1px solid #2c3947", borderRadius: 8 }} />
              <Bar dataKey="pct" name="Completion %" fill="#7c5cff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      )}

      {/* Game log table */}
      {games.length > 0 && (
        <Panel>
          <h2 className="text-lg font-bold mb-4">Game Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2 text-xs text-muted uppercase tracking-wide border-b border-border">Date</th>
                  {db.program.gameStats.map((s) => (
                    <th key={s} className="text-left p-2 text-xs text-muted uppercase tracking-wide border-b border-border">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...games].reverse().map(({ date, log }) => (
                  <tr key={date} className="hover:bg-panel2 transition-colors">
                    <td className="p-2 border-b border-border">{date}</td>
                    {db.program.gameStats.map((s) => (
                      <td key={s} className="p-2 border-b border-border">{log.gameStats[s] ?? "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* Daily log */}
      <Panel>
        <h2 className="text-lg font-bold mb-4">Daily Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Date", "Day", "Done", "Recovery", "Sleep", "WB R/L", "Notes"].map((h) => (
                  <th key={h} className="text-left p-2 text-xs text-muted uppercase tracking-wide border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...dates].reverse().map((d) => {
                const log = db.logs[d];
                const plan = planForDate(db, d);
                const rs = calcRecoveryScore(log, db.program);
                const done = Object.values(log.checks).filter(Boolean).length;
                return (
                  <tr key={d} className="hover:bg-panel2 transition-colors cursor-pointer">
                    <td className="p-2 border-b border-border">{d}</td>
                    <td className="p-2 border-b border-border text-muted">
                      {plan && !plan.before ? plan.dayTpl.day : "—"}
                    </td>
                    <td className="p-2 border-b border-border">{done}</td>
                    <td className="p-2 border-b border-border" style={{ color: scoreColor(rs.total) }}>
                      {log.recovery.bed || log.recovery.wake ? rs.total : "—"}
                    </td>
                    <td className="p-2 border-b border-border text-muted">
                      {rs.sleepH != null ? `${rs.sleepH}h` : "—"}
                    </td>
                    <td className="p-2 border-b border-border text-muted">
                      {log.wall.R ?? "–"}/{log.wall.L ?? "–"}
                    </td>
                    <td className="p-2 border-b border-border text-muted">
                      {(log.notes || log.teamComment || log.gameComment || "").slice(0, 30)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
