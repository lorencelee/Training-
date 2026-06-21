import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const secret = process.env.APP_SECRET;

  // If no secret set, allow (dev mode)
  if (!secret || password === secret) {
    const cookieStore = await cookies();
    cookieStore.set("session", secret ?? "dev", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Wrong password" }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.json({ ok: true });
}
