import { NextRequest, NextResponse } from 'next/server';

// Generates an AdGem offerwall URL for the current user
// AdGem typically needs an app id and a user id to attribute offers.
// We read APP ID from env and accept `userId` from the query string.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const appId = process.env.ADGEM_APP_ID;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    if (!appId) {
      return NextResponse.json({ error: 'AdGem not configured. Missing ADGEM_APP_ID' }, { status: 500 });
    }

    // AdGem offerwall base URL pattern (documented by AdGem). If your account uses a different base, update here.
    // Example public wall endpoint (subject to your account configuration):
    // https://wall.adgem.com/offerwall?appid={APP_ID}&userid={USER_ID}
    const baseUrl = 'https://wall.adgem.com/offerwall';
    const params = new URLSearchParams({ appid: appId, userid: userId });
    const url = `${baseUrl}?${params.toString()}`;

    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error('AdGem URL generation error:', err);
    return NextResponse.json({ error: 'Failed to generate AdGem URL' }, { status: 500 });
  }
}
