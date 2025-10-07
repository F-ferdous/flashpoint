import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, updates } = (body || {}) as { uid: string; updates: any };
    if (!uid || !updates) {
      return NextResponse.json({ error: "Missing uid or updates" }, { status: 400 });
    }

    // Allow-list fields that can be updated
    const allowed: any = {};
    const fields = [
      "name",
      "email",
      "username",
      "age",
      "nid",
      "address",
      "district",
      "bank",
      "nidPhotoUrl",
      "password",
      "status",
      "statusReason",
    ];
    for (const k of fields) {
      if (k in updates) allowed[k] = updates[k];
    }
    allowed.updatedAt = Date.now();

    // Update Firestore: customers/{uid}
    await adminDb.collection("customers").doc(uid).set(allowed, { merge: true });

    // Sync subset to users/{uid}
    const userAllowed: any = {};
    for (const k of ["name", "email", "username"]) {
      if (k in allowed) userAllowed[k] = allowed[k];
    }
    if (Object.keys(userAllowed).length > 0) {
      userAllowed.updatedAt = allowed.updatedAt;
      await adminDb.collection("users").doc(uid).set(userAllowed, { merge: true });
    }

    // If password provided, update Firebase Auth as well
    if (typeof allowed.password === "string" && allowed.password.trim().length > 0) {
      await adminAuth.updateUser(uid, { password: String(allowed.password) });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("update-customer error", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
