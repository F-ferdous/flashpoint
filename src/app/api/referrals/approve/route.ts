import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb, adminReady } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeUsername(fullName: string) {
  const base = (fullName || "user")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")[0] || "user";
  return `${base}@fsalbd.com`;
}

function makePassword() {
  // 8 digit numeric password
  let s = "";
  for (let i = 0; i < 8; i++) s += Math.floor(Math.random() * 10).toString();
  return s;
}

export async function POST(req: NextRequest) {
  try {
    if (!adminReady) {
      return NextResponse.json({ error: "Server not configured for admin" }, { status: 500 });
    }
    const body = await req.json();
    const { pendingId } = body || {};
    if (!pendingId) {
      return NextResponse.json({ error: "Missing pendingId" }, { status: 400 });
    }

    const pendingRef = adminDb.collection("pendingUsers").doc(String(pendingId));
    const snap = await pendingRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Pending not found" }, { status: 404 });
    }
    const p = snap.data() as any;
    if (p.status && p.status !== "Pending") {
      return NextResponse.json({ error: "Already processed" }, { status: 400 });
    }

    const fullName = String(p.fullName || "");
    const referrerUid = String(p.referrerUid || "");
    const contactEmail = String(p.email || "").toLowerCase();
    let username = makeUsername(fullName);
    const password = makePassword();

    // Create auth user using the generated username as email per spec.
    // If it already exists, retry with a numeric suffix.
    let userRecord;
    for (let i = 0; i < 3; i++) {
      try {
        userRecord = await adminAuth.createUser({
          email: username,
          password,
          displayName: fullName,
        });
        break;
      } catch (err: any) {
        const code = err?.errorInfo?.code || err?.code;
        if (code === 'auth/email-already-exists' || code === 'email-already-exists') {
          username = username.replace('@fsalbd.com', `${Math.floor(Math.random() * 1000)}@fsalbd.com`);
          continue;
        }
        throw err;
      }
    }
    if (!userRecord) {
      return NextResponse.json({ error: 'Unable to create user after retries' }, { status: 500 });
    }

    // Build user doc with role
    const userDoc = {
      uid: userRecord.uid,
      role: "user" as const,
      username,
      password, // WARNING: storing plaintext per spec; consider hashing in future
      name: fullName,
      contactEmail,
      phone: p.phone ?? null,
      nidNumber: p.nidNumber ?? null,
      district: p.district ?? null,
      address: p.address ?? null,
      referrerUid,
      points: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await adminDb.collection("users").doc(userRecord.uid).set(userDoc, { merge: true });

    // Mark pending as approved
    await pendingRef.update({ status: "Approved", approvedAt: Date.now(), updatedAt: Date.now(), approvedUid: userRecord.uid });

    // Credit referrer points
    if (referrerUid) {
      // Detect if referrer is a normal user (not an agent)
      const refUserSnap = await adminDb.collection("users").doc(referrerUid).get();
      if (refUserSnap.exists) {
        // User referral: +150 points
        await adminDb.collection("users").doc(referrerUid).set({ points: FieldValue.increment(150), updatedAt: Date.now() }, { merge: true });
      } else {
        // Fallback to agent referral: +100 points
        await adminDb.collection("agents").doc(referrerUid).set({ points: FieldValue.increment(100), updatedAt: Date.now() }, { merge: true });
      }
    }

    return NextResponse.json({ ok: true, uid: userRecord.uid, username, password });
  } catch (err: any) {
    console.error("approve referral error", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
