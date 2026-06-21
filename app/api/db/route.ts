import { NextResponse } from "next/server";
import { initDB } from "@/lib/db";

// POST /api/db  — create tables (run once after connecting Vercel Postgres)
export async function POST() {
  try {
    await initDB();
    return NextResponse.json({ ok: true, message: "Tables created (or already existed)" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
