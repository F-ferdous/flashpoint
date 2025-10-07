import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, phone, address, profilePhotoUrl } = body || {} as { uid: string; phone?: string; address?: string; profilePhotoUrl?: string };
    if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

    const updates: any = { updatedAt: Date.now() };
    if (typeof phone === "string") updates.phone = phone || null;
    if (typeof address === "string") updates.address = address || null;
    if (typeof profilePhotoUrl === "string" && profilePhotoUrl.length > 0) updates.profilePhotoUrl = profilePhotoUrl;

    await adminDb.collection("customers").doc(uid).set(updates, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("customer/update-profile error", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
