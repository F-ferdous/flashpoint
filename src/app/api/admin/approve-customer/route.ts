import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import districtsData from "@/lib/districts.json";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pendingId, password } = (body || {}) as { pendingId: string; password: string };
    if (!pendingId || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Load pending customer
    const pendingRef = adminDb.collection("pendingCustomers").doc(pendingId);
    const pendingSnap = await pendingRef.get();
    if (!pendingSnap.exists) {
      return NextResponse.json({ error: "Pending customer not found" }, { status: 404 });
    }
    const p = pendingSnap.data() as any;
    const name: string = String(p.fullName || "");
    const loginEmail: string = String(p.username || p.email || "");
    const district: string | null = p.district || null;

    if (!loginEmail || !name) {
      return NextResponse.json({ error: "Pending record missing name or email" }, { status: 400 });
    }

    // Enforce unique email
    try {
      const existing = await adminAuth.getUserByEmail(loginEmail);
      if (existing) {
        return NextResponse.json({ error: "Email address is already in use." }, { status: 409 });
      }
    } catch {}

    // Create Auth user
    const created = await adminAuth.createUser({ email: loginEmail, password, displayName: name });
    const uid = created.uid;

    // Build customer ID
    function getDistrictIdByName(name: string | null | undefined): string {
      const arr = (districtsData as any)?.districts as Array<{ id: string; name: string }>;
      if (!name || !arr) return "00";
      const found = arr.find((d) => d.name.toLowerCase() === String(name).toLowerCase());
      return found?.id?.padStart(2, "0") || "00";
    }
    const distId = getDistrictIdByName(district);
    const initials = String(name || "").trim().split(/\s+/)[0]?.slice(0, 2).toUpperCase().padEnd(2, "X");
    const counterDocRef = adminDb.collection("counters").doc(`customer_${distId}`);
    const customerId = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(counterDocRef);
      const current = (snap.exists ? (snap.data() as any)?.seq : 0) || 0;
      const next = current + 1;
      tx.set(counterDocRef, { seq: next, type: "customer", districtId: distId, updatedAt: Date.now() }, { merge: true });
      return `${distId}C${initials}${String(next).padStart(3, "0")}`;
    });

    // Create Firestore docs
    const customerDoc = {
      uid,
      customerId,
      name,
      email: loginEmail,
      username: loginEmail,
      // WARNING: Storing plaintext password is insecure. Proceeded per product request.
      password,
      status: "Active" as const,
      role: "Customer" as const,
      age: null,
      nid: p.nidNumber || null,
      address: p.address || null,
      district: district,
      bank: null,
      nidPhotoUrl: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await adminDb.collection("customers").doc(uid).set(customerDoc, { merge: true });
    await adminDb.collection("users").doc(uid).set({
      role: "Customer",
      email: loginEmail,
      name,
      username: loginEmail,
      // WARNING: Storing plaintext password is insecure. Proceeded per product request.
      password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }, { merge: true });

    // Remove pending record
    await pendingRef.delete();

    return NextResponse.json({ ok: true, uid, customerId });
  } catch (err: any) {
    console.error("approve-customer error", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
