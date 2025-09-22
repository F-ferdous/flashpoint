import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Disabled: referral backend has been removed in favor of referral-only UI flow.
export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: "Referral signup API disabled" }, { status: 410 });
}
