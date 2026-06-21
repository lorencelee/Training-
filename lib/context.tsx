"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AppDB, DayLog } from "./types";
import { loadDB, saveDB, setLog, getLog } from "./store";

interface TrainingCtx {
  db: AppDB;
  updateLog: (date: string, updater: (log: DayLog) => DayLog) => void;
  updateDB: (updater: (db: AppDB) => AppDB) => void;
}

const Ctx = createContext<TrainingCtx | null>(null);

export function TrainingProvider({ children }: { children: React.ReactNode }) {
  const [db, setDB] = useState<AppDB>(() => loadDB());

  // Persist on every change
  useEffect(() => {
    saveDB(db);
  }, [db]);

  const updateLog = useCallback((date: string, updater: (log: DayLog) => DayLog) => {
    setDB((prev) => setLog(prev, updater(getLog(prev, date))));
  }, []);

  const updateDB = useCallback((updater: (db: AppDB) => AppDB) => {
    setDB((prev) => updater(prev));
  }, []);

  return <Ctx.Provider value={{ db, updateLog, updateDB }}>{children}</Ctx.Provider>;
}

export function useTraining(): TrainingCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTraining must be used inside TrainingProvider");
  return ctx;
}
