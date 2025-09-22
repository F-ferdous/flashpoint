import { NextRequest, NextResponse } from "next/server";

// Builds an AdGate offerwall URL: https://wall.adgaterewards.com/offerwall?api_key=API_TOKEN&user_id=UID
// We keep the token on the server and only return the full URL to the client.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const apiToken = process.env.ADGATE_API_TOKEN;

  if (!uid) {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }
  if (!apiToken) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const url = new URL("https://wall.adgaterewards.com/offerwall");
  url.searchParams.set("api_key", apiToken);
  url.searchParams.set("user_id", uid);
  // Optional styling params can be added here, e.g. theme, hide_header, offerwall_v
  // url.searchParams.set("offerwall_v", "3");

  return NextResponse.json({ url: url.toString() });
}
