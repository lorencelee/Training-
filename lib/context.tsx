"use client";

import React, {
  createContext, useContext, useEffect, useState,
  useCallback, useRef,
} from "react";
import type { AppDB, DayLog } from "./types";
import { loadDB, saveDB, setLog, getLog } from "./store";

export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "offline";

interface TrainingCtx {
  db: AppDB;
  syncStatus: SyncStatus;
  updateLog: (date: string, updater: (log: DayLog) => DayLog) => void;
  updateDB: (updater: (db: AppDB) => AppDB) => void;
  forcePull: () => Promise<void>;
  forcePush: () => Promise<void>;
}

const Ctx = createContext<TrainingCtx | null>(null);

const DEBOUNCE_MS = 800; // wait 800ms after last change before syncing

export function TrainingProvider({ children }: { children: React.ReactNode }) {
  const [db, setDB] = useState<AppDB>(() => loadDB());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const pendingSync = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedRef = useRef<string>("");

  // ── Persist to localStorage on every change ──────────────────────────────
  useEffect(() => {
    saveDB(db);
  }, [db]);

  // ── Pull from Postgres on first load ─────────────────────────────────────
  useEffect(() => {
    pull();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function pull() {
    setSyncStatus("syncing");
    try {
      const res = await fetch("/api/sync");
      if (!res.ok) throw new Error(await res.text());
      const { logs, cycles } = await res.json();

      setDB((prev) => {
        // Merge: DB from server wins for any dates it has
        const merged = {
          ...prev,
          logs: { ...prev.logs, ...logs },
          cycles: cycles.length > 0 ? cycles : prev.cycles,
        };
        saveDB(merged);
        return merged;
      });
      setSyncStatus("synced");
    } catch (e) {
      console.warn("Pull failed (offline or DB not set up yet):", e);
      setSyncStatus("offline");
    }
  }

  async function push(snapshot: AppDB) {
    setSyncStatus("syncing");
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs: snapshot.logs, cycles: snapshot.cycles }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSyncStatus("synced");
      lastSyncedRef.current = JSON.stringify({ logs: snapshot.logs, cycles: snapshot.cycles });
    } catch (e) {
      console.warn("Push failed (offline or DB not set up yet):", e);
      setSyncStatus("offline");
    }
  }

  // ── Schedule a debounced push whenever DB changes ─────────────────────────
  const schedulePush = useCallback((snapshot: AppDB) => {
    if (pendingSync.current) clearTimeout(pendingSync.current);
    pendingSync.current = setTimeout(() => {
      const key = JSON.stringify({ logs: snapshot.logs, cycles: snapshot.cycles });
      if (key !== lastSyncedRef.current) push(snapshot);
    }, DEBOUNCE_MS);
  }, []);

  // ── Public mutators ───────────────────────────────────────────────────────
  const updateLog = useCallback((date: string, updater: (log: DayLog) => DayLog) => {
    setDB((prev) => {
      const next = setLog(prev, updater(getLog(prev, date)));
      schedulePush(next);
      return next;
    });
  }, [schedulePush]);

  const updateDB = useCallback((updater: (db: AppDB) => AppDB) => {
    setDB((prev) => {
      const next = updater(prev);
      schedulePush(next);
      return next;
    });
  }, [schedulePush]);

  const forcePull = useCallback(() => pull(), []);
  const forcePush = useCallback(() => push(db), [db]);

  return (
    <Ctx.Provider value={{ db, syncStatus, updateLog, updateDB, forcePull, forcePush }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTraining(): TrainingCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTraining must be used inside TrainingProvider");
  return ctx;
}
