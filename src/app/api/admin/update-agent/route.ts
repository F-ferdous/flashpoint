import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, updates } = body || {} as { uid: string; updates: any };
    if (!uid || !updates) {
      return NextResponse.json({ error: "Missing uid or updates" }, { status: 400 });
    }

    // Normalize fields
    const allowed: any = {};
    const fields = [
      "name","email","username","age","nid","trade","address","district","bank",
      "status","statusReason","nidPhotoUrl","tradePhotoUrl","password"
    ];
    for (const k of fields) {
      if (k in updates) allowed[k] = updates[k];
    }
    allowed.updatedAt = Date.now();

    // Update agent profile
    await adminDb.collection("agents").doc(uid).set(allowed, { merge: true });

    // Removed syncing to 'users' collection per new requirement. All agent data stays in 'agents'.

    // If password provided, update Firebase Auth user password as well
    if (typeof allowed.password === "string" && allowed.password.trim().length > 0) {
      await adminAuth.updateUser(uid, { password: String(allowed.password) });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("update-agent error", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
