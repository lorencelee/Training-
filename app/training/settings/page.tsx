"use client";

import { useState } from "react";
import { useTraining } from "@/lib/context";
import { createCycle, todayISO } from "@/lib/store";
import { Panel } from "@/components/ui/panel";

export default function SettingsPage() {
  const { db, updateDB, syncStatus, forcePull, forcePush } = useTraining();
  const p = db.program;
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function setProg(key: string, value: unknown) {
    updateDB((d) => ({ ...d, program: { ...d.program, [key]: value } }));
  }

  // Default start date = next Sunday
  const nextSun = new Date();
  nextSun.setDate(nextSun.getDate() + ((7 - nextSun.getDay()) % 7 || 7));
  const [startDate, setStartDate] = useState(
    db.cycles.length ? nextSun.toISOString().slice(0, 10) : todayISO()
  );

  function onStartCycle() {
    updateDB((d) => createCycle(d, startDate));
    showToast("Cycle generated!");
  }

  function delCycle(i: number) {
    if (!confirm("Delete this cycle?")) return;
    updateDB((d) => ({ ...d, cycles: d.cycles.filter((_, idx) => idx !== i) }));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `personal-os-backup-${todayISO()}.json`;
    a.click();
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        updateDB(() => parsed);
        showToast("Imported successfully!");
      } catch {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  }

  function resetAll() {
    if (!confirm("Erase ALL data and reset to defaults?")) return;
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.reload();
    }
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-good text-bg font-bold px-5 py-3 rounded-xl z-50 shadow-xl">
          {toast}
        </div>
      )}

      {/* Cycle control */}
      <Panel>
        <h2 className="text-lg font-bold mb-1">Cycle Control</h2>
        <p className="text-muted text-sm mb-4">
          Each cycle is a {p.weeks.length}-week mesocycle (W1 reintroduce → W2 build → W3 peak → W4 deload + 1RM test).
          Your logged weights carry forward as the &quot;last weight&quot; reference into each new cycle.
        </p>
        <div className="flex gap-2 items-center flex-wrap mb-4">
          <button onClick={onStartCycle}
            className="px-4 py-2 bg-accent text-bg font-bold rounded-xl text-sm hover:brightness-110 transition">
            {db.cycles.length ? "Generate Next Cycle ▶" : "Start First Cycle ▶"}
          </button>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-auto" />
          <span className="text-muted text-sm">start date{db.cycles.length ? " (defaults to next Sunday)" : ""}</span>
        </div>
        <div className="bg-panel2 border-l-4 border-accent text-sm p-3 rounded mb-4">
          Tip: start on (or in the week of) a Sunday — the plan anchors weekday roles (Sun lower power, Sat game, etc.) to the calendar.
        </div>

        {db.cycles.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["#", "Name", "Start", "Weeks", ""].map((h) => (
                    <th key={h} className="text-left p-2 text-xs text-muted uppercase tracking-wide border-b border-border">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {db.cycles.map((cy, i) => (
                  <tr key={cy.id} className="hover:bg-panel2">
                    <td className="p-2 border-b border-border">{cy.cycleNumber}</td>
                    <td className="p-2 border-b border-border">{cy.name}</td>
                    <td className="p-2 border-b border-border">{cy.startDate}</td>
                    <td className="p-2 border-b border-border">{cy.weeks}</td>
                    <td className="p-2 border-b border-border text-right">
                      <button onClick={() => delCycle(i)}
                        className="text-xs text-muted hover:text-bad transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Program settings */}
      <Panel>
        <h2 className="text-lg font-bold mb-4">Program Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">Program name</label>
            <input value={p.name} onChange={(e) => setProg("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">Progression upper (kg)</label>
            <input type="number" step="0.5" value={p.progressionUpperKg} onChange={(e) => setProg("progressionUpperKg", Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">Progression lower (kg)</label>
            <input type="number" step="0.5" value={p.progressionLowerKg} onChange={(e) => setProg("progressionLowerKg", Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">Sleep target (hours)</label>
            <input type="number" step="0.25" value={p.sleepTargetH} onChange={(e) => setProg("sleepTargetH", Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">Bedtime target</label>
            <input type="time" value={p.bedtimeTarget} onChange={(e) => setProg("bedtimeTarget", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">Caffeine cap (mg)</label>
            <input type="number" step="10" value={p.caffeineLimitMg} onChange={(e) => setProg("caffeineLimitMg", Number(e.target.value))} />
          </div>
        </div>
      </Panel>

      {/* Game stat fields */}
      <Panel>
        <h2 className="text-lg font-bold mb-2">Game Stat Fields</h2>
        <p className="text-muted text-sm mb-3">Comma-separated. Edit to match your team&apos;s tracking.</p>
        <textarea
          value={p.gameStats.join(", ")}
          onChange={(e) => setProg("gameStats", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
        />
      </Panel>

      {/* Daily lifestyle items */}
      <Panel>
        <h2 className="text-lg font-bold mb-2">Daily Lifestyle Items</h2>
        <p className="text-muted text-sm mb-3">One per line — these appear as daily checklist items.</p>
        <textarea
          value={p.recovery.map((r) => r.label).join("\n")}
          onChange={(e) => setProg("recovery", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean).map((l) => ({
            key: l.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 20),
            label: l,
          })))}
        />
      </Panel>

      {/* Sync / Database */}
      <Panel>
        <h2 className="text-lg font-bold mb-2">Cloud Sync — Vercel Postgres</h2>
        <p className="text-muted text-sm mb-4">
          Status: <span className={syncStatus === "synced" ? "text-good" : syncStatus === "offline" ? "text-muted" : "text-warn"}>
            {syncStatus === "synced" ? "✓ Synced" : syncStatus === "syncing" ? "Syncing…" : syncStatus === "offline" ? "Offline / DB not set up" : syncStatus}
          </span>
        </p>

        <div className="bg-panel2 border-l-4 border-accent text-sm p-3 rounded mb-4">
          <strong>First-time setup:</strong> After connecting Vercel Postgres in the Vercel dashboard,
          click <em>Initialise Database</em> once to create the tables, then <em>Push to Cloud</em>
          to upload your local data.
        </div>

        <div className="flex gap-3 flex-wrap mb-2">
          <button
            onClick={async () => {
              const r = await fetch("/api/db", { method: "POST" });
              const j = await r.json();
              showToast(j.ok ? "Database tables created!" : ("Error: " + j.error));
            }}
            className="px-4 py-2 text-sm rounded-xl bg-panel2 border border-border hover:border-accent transition-colors">
            🗄 Initialise Database
          </button>
          <button onClick={() => { forcePush(); showToast("Pushing to cloud…"); }}
            className="px-4 py-2 text-sm rounded-xl bg-accent text-bg font-bold hover:brightness-110 transition">
            ⬆ Push to Cloud
          </button>
          <button onClick={() => { forcePull(); showToast("Pulling from cloud…"); }}
            className="px-4 py-2 text-sm rounded-xl bg-panel2 border border-border hover:border-accent transition-colors">
            ⬇ Pull from Cloud
          </button>
          <a href="/api/auth" onClick={async (e) => { e.preventDefault(); await fetch("/api/auth", { method: "DELETE" }); window.location.href = "/login"; }}
            className="px-4 py-2 text-sm rounded-xl bg-panel2 border border-border text-muted hover:text-txt cursor-pointer transition-colors">
            Sign out
          </a>
        </div>
      </Panel>

      {/* Data management */}
      <Panel>
        <h2 className="text-lg font-bold mb-2">Local Data</h2>
        <p className="text-muted text-sm mb-4">Export a JSON backup of everything stored locally.</p>
        <div className="flex gap-3 flex-wrap">
          <button onClick={exportData}
            className="px-4 py-2 text-sm rounded-xl bg-panel2 border border-border hover:border-accent transition-colors">
            ⬇ Export backup (JSON)
          </button>
          <label className="px-4 py-2 text-sm rounded-xl bg-accent text-bg font-bold cursor-pointer hover:brightness-110 transition">
            ⬆ Import backup
            <input type="file" accept="application/json" className="hidden" onChange={importData} />
          </label>
          <button onClick={resetAll}
            className="px-4 py-2 text-sm rounded-xl bg-bad text-white font-bold hover:brightness-110 transition">
            Reset everything
          </button>
        </div>
      </Panel>
    </>
  );
}
