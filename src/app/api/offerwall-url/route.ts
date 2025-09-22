import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  const appId = process.env.OFFERTORO_APP_ID;
  const secretKey = process.env.OFFERTORO_SECRET_KEY;

  if (!uid) {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }
  if (!appId || !secretKey) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const hash = crypto
    .createHash("md5")
    .update(`${appId}${uid}${secretKey}`)
    .digest("hex");

  const url = `https://www.offertoro.com/ifr/show/${appId}/${uid}/${hash}`;
  return NextResponse.json({ url });
}
