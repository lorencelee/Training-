"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useTraining } from "@/lib/context";
import { activeCycle, planForDate, todayISO } from "@/lib/store";

const navItems = [
  { href: "/training",         label: "Today" },
  { href: "/training/program", label: "Program" },
  { href: "/training/game",    label: "Game Day" },
  { href: "/training/history", label: "History" },
  { href: "/training/settings",label: "Settings" },
];

// Future modules go here:
// { href: "/nutrition", label: "Nutrition" },
// { href: "/journal",   label: "Journal" },

export function Nav() {
  const pathname = usePathname();
  const { db } = useTraining();
  const cycle = activeCycle(db);
  const plan = cycle ? planForDate(db, todayISO()) : null;

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 py-3">
          <div>
            <div className="font-bold text-base">🥍 Personal OS</div>
            <div className="text-xs text-muted">Training · Local</div>
          </div>
          <div className="ml-auto">
            {cycle && plan && !plan.before ? (
              <span className="text-xs bg-panel2 border border-border rounded-full px-3 py-1.5 text-muted">
                <span className="text-txt font-semibold">{cycle.name}</span>
                {!plan.before && "weekNum" in plan && (
                  <> · Wk {plan.weekNum}/{cycle.weeks} · {plan.dayTpl.day}</>
                )}
              </span>
            ) : (
              <span className="text-xs text-muted">No cycle — go to Settings</span>
            )}
          </div>
        </div>

        <nav className="flex gap-1 pb-2 flex-wrap">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                pathname === item.href
                  ? "bg-accent text-bg"
                  : "text-muted hover:text-txt hover:bg-panel"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
