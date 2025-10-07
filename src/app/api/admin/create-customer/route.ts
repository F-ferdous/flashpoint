import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import districtsData from "@/lib/districts.json";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      username,
      password,
      age,
      nid,
      address,
      district,
      bank,
      nidPhotoUrl,
    } = body || {};

    if (!email || !password || !username || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Enforce unique email in Firebase Auth
    let uid: string;
    try {
      const existing = await adminAuth.getUserByEmail(email);
      if (existing) {
        return NextResponse.json({ error: "Email address is already in use." }, { status: 409 });
      }
    } catch {}
    const created = await adminAuth.createUser({ email, password, displayName: name });
    uid = created.uid;

    // Build customer ID: <districtId><C><first2Upper><serial3>
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

    // Save customer doc
    const customerDoc = {
      uid,
      customerId,
      name,
      email,
      username,
      // WARNING: Storing plaintext password is insecure. Proceeded per product request.
      password,
      status: "Active" as const,
      role: "Customer" as const,
      age: age ?? null,
      nid: nid ?? null,
      address: address ?? null,
      district: district ?? null,
      bank: bank ?? null,
      nidPhotoUrl: nidPhotoUrl ?? null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await adminDb.collection("customers").doc(uid).set(customerDoc, { merge: true });

    // Also create users/{uid} doc for role-based redirects
    await adminDb.collection("users").doc(uid).set({
      role: "Customer",
      email,
      name,
      username,
      // WARNING: Storing plaintext password is insecure. Proceeded per product request.
      password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }, { merge: true });

    return NextResponse.json({ ok: true, uid, customerId });
  } catch (err: any) {
    console.error("create-customer error", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
