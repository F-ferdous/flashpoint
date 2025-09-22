import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import bcrypt from "bcryptjs";

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
      trade,
      address,
      district,
      bank,
    } = body || {};

    if (!email || !password || !username || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create Auth user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Hash password for storage in Firestore (never store plain text)
    const passwordHash = await bcrypt.hash(password, 12);

    // Save agent doc
    const agentDoc = {
      uid: userRecord.uid,
      name,
      email,
      username,
      passwordHash,
      status: "Pending" as const,
      age: age ?? null,
      nid: nid ?? null,
      trade: trade ?? null,
      address: address ?? null,
      district: district ?? null,
      bank: bank ?? null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await adminDb.collection("agents").doc(userRecord.uid).set(agentDoc);

    return NextResponse.json({ ok: true, uid: userRecord.uid });
  } catch (err: any) {
    console.error("create-agent error", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
