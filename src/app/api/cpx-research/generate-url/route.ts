import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get CPX Research credentials from environment
    const appId = process.env.CPX_RESEARCH_APP_ID;
    const secureHash = process.env.CPX_RESEARCH_SECURE_HASH;
    const subId1 = process.env.CPX_RESEARCH_SUBID_1 || '';
    const subId2 = process.env.CPX_RESEARCH_SUBID_2 || '';

    if (!appId || !secureHash) {
      return NextResponse.json({ 
        error: 'CPX Research not configured. Please add your credentials to .env.local',
        missingCredentials: ['CPX_RESEARCH_APP_ID', 'CPX_RESEARCH_SECURE_HASH']
      }, { status: 500 });
    }

    // Generate secure hash for user authentication
    // CPX Research requires: MD5(appId + userId + secureHash)
    const hashString = `${appId}${userId}${secureHash}`;
    const hash = crypto.createHash('md5').update(hashString).digest('hex');

    // Construct CPX Research URL
    const baseUrl = 'https://offers.cpx-research.com/index.php';
    const params = new URLSearchParams({
      app_id: appId,
      ext_user_id: userId,
      secure_hash: hash,
      subid_1: subId1,
      subid_2: subId2,
    });

    const cpxUrl = `${baseUrl}?${params.toString()}`;

    return NextResponse.json({ 
      success: true, 
      url: cpxUrl,
      message: 'CPX Research URL generated successfully'
    });

  } catch (error) {
    console.error('CPX Research URL generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate CPX Research URL' 
    }, { status: 500 });
  }
}