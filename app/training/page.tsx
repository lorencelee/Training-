"use client";

import { useState } from "react";
import { useTraining } from "@/lib/context";
import { planForDate, todayISO } from "@/lib/store";
import { RecoveryPanel } from "@/components/training/recovery-panel";
import { Checklist } from "@/components/training/checklist";
import { Panel } from "@/components/ui/panel";
import Link from "next/link";

function shiftDate(date: string, days: number): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function prettyDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "short", day: "numeric",
  });
}

export default function TodayPage() {
  const { db } = useTraining();
  const [date, setDate] = useState(todayISO());
  const plan = planForDate(db, date);

  return (
    <>
      {/* Date bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button onClick={() => setDate(shiftDate(date, -1))}
          className="px-3 py-1.5 text-sm rounded-lg bg-panel2 border border-border text-muted hover:text-txt transition-colors">
          ◀ Prev
        </button>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
        <button onClick={() => setDate(shiftDate(date, 1))}
          className="px-3 py-1.5 text-sm rounded-lg bg-panel2 border border-border text-muted hover:text-txt transition-colors">
          Next ▶
        </button>
        <button onClick={() => setDate(todayISO())}
          className="px-3 py-1.5 text-sm rounded-lg bg-panel2 border border-border text-muted hover:text-txt transition-colors">
          Today
        </button>
        <span className="ml-auto text-sm text-muted">{prettyDate(date)}</span>
      </div>

      {/* No cycle */}
      {!plan && (
        <Panel>
          <h2 className="text-lg font-bold mb-1">No active cycle</h2>
          <p className="text-muted text-sm mb-4">Go to Settings and start your first cycle to generate the daily plan & checklist.</p>
          <Link href="/training/settings" className="inline-block px-4 py-2 bg-accent text-bg font-bold rounded-xl text-sm">
            Go to Settings
          </Link>
        </Panel>
      )}

      {/* Before cycle start */}
      {plan?.before && (
        <Panel>
          <h2 className="text-lg font-bold mb-1">Cycle hasn&apos;t started yet</h2>
          <p className="text-muted text-sm">Your cycle starts on <strong>{plan.cycle.startDate}</strong>.</p>
        </Panel>
      )}

      {/* Active day */}
      {plan && !plan.before && (
        <>
          <RecoveryPanel date={date} />
          <Checklist
            date={date}
            dayTpl={plan.dayTpl}
            weekNum={plan.weekNum}
            totalWeeks={plan.cycle.weeks}
            finished={plan.finished}
          />
        </>
      )}
    </>
  );
}
