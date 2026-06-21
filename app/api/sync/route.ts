import { NextRequest, NextResponse } from "next/server";
import { getAllLogs, getAllCycles, upsertLog, upsertCycle, deleteCycle } from "@/lib/db";
import type { DayLog, Cycle } from "@/lib/types";

// GET /api/sync  — pull all data from Postgres
export async function GET() {
  try {
    const [logs, cycles] = await Promise.all([getAllLogs(), getAllCycles()]);
    return NextResponse.json({ logs, cycles });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Return empty instead of error so the app degrades gracefully
    console.error("sync GET error:", msg);
    return NextResponse.json({ logs: {}, cycles: [], error: msg });
  }
}

// POST /api/sync  — push changes to Postgres
// Body: { logs?: Record<string,DayLog>, cycles?: Cycle[], deletedCycleIds?: string[] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      logs?: Record<string, DayLog>;
      cycles?: Cycle[];
      deletedCycleIds?: string[];
    };

    const ops: Promise<void>[] = [];

    if (body.logs) {
      Object.values(body.logs).forEach((log) => ops.push(upsertLog(log)));
    }
    if (body.cycles) {
      body.cycles.forEach((c) => ops.push(upsertCycle(c)));
    }
    if (body.deletedCycleIds) {
      body.deletedCycleIds.forEach((id) => ops.push(deleteCycle(id)));
    }

    await Promise.all(ops);
    return NextResponse.json({ ok: true, synced: ops.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("sync POST error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
