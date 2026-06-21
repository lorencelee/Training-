import { sql } from "@vercel/postgres";
import type { DayLog, Cycle } from "./types";

// ─── Schema init ──────────────────────────────────────────────────────────────

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS training_logs (
      date        TEXT PRIMARY KEY,
      data        JSONB NOT NULL DEFAULT '{}',
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS training_cycles (
      id          TEXT PRIMARY KEY,
      data        JSONB NOT NULL DEFAULT '{}',
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

// ─── Logs ─────────────────────────────────────────────────────────────────────

export async function getAllLogs(): Promise<Record<string, DayLog>> {
  const { rows } = await sql`SELECT date, data FROM training_logs ORDER BY date`;
  const out: Record<string, DayLog> = {};
  rows.forEach((r) => { out[r.date] = r.data as DayLog; });
  return out;
}

export async function upsertLog(log: DayLog) {
  await sql`
    INSERT INTO training_logs (date, data, updated_at)
    VALUES (${log.date}, ${JSON.stringify(log)}, NOW())
    ON CONFLICT (date) DO UPDATE
      SET data = EXCLUDED.data, updated_at = NOW()
  `;
}

// ─── Cycles ───────────────────────────────────────────────────────────────────

export async function getAllCycles(): Promise<Cycle[]> {
  const { rows } = await sql`SELECT data FROM training_cycles ORDER BY (data->>'startDate')`;
  return rows.map((r) => r.data as Cycle);
}

export async function upsertCycle(cycle: Cycle) {
  await sql`
    INSERT INTO training_cycles (id, data, updated_at)
    VALUES (${cycle.id}, ${JSON.stringify(cycle)}, NOW())
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data, updated_at = NOW()
  `;
}

export async function deleteCycle(id: string) {
  await sql`DELETE FROM training_cycles WHERE id = ${id}`;
}
