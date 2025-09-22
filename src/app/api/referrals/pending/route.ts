import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Disabled: referral backend has been removed.
export async function GET(_req: NextRequest) {
  return NextResponse.json({ error: "Referral pending API disabled" }, { status: 410 });
}
