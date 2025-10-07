import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// AdGem Postback Endpoint
// Expected minimal pattern per vendor note: /api/adgem/postback?appid={app_id}&userid={user_id}
// We also try to read payout/amount and transaction id if provided for better ledger entries.
// Respond with '1' on success, '0' on failure (common S2S convention).
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const appId = searchParams.get('appid') || searchParams.get('app_id');
    const userId = searchParams.get('userid') || searchParams.get('user_id');
    const transactionId =
      searchParams.get('tx') ||
      searchParams.get('transaction_id') ||
      searchParams.get('trans_id') ||
      `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`; // fallback if not provided

    // payout in dollars (float). Accept several common keys.
    const payoutStr =
      searchParams.get('payout') ||
      searchParams.get('amount') ||
      searchParams.get('reward') ||
      '0';
    const payout = parseFloat(payoutStr) || 0;

    if (!appId || !userId) {
      console.log('[adgem postback] missing params', { appId, userId });
      return new NextResponse('0', { status: 400 });
    }

    // Optional: basic app id check
    const expectedAppId = process.env.ADGEM_APP_ID;
    if (expectedAppId && expectedAppId !== appId) {
      console.warn('[adgem postback] app mismatch', { expectedAppId, appId });
      // Do not reject hard if accounts rotate; you can switch to 400 if you prefer strict.
    }

    const pointsEarned = Math.floor(payout * 100); // $1 = 100 points

    const userRef = adminDb.collection('users').doc(userId);
    const adgemTxnRef = userRef.collection('adgem_transactions').doc(transactionId);

    await adminDb.runTransaction(async (trx) => {
      const existing = await trx.get(adgemTxnRef);
      if (existing.exists) {
        // idempotent: already processed
        return;
      }

      const userSnap = await trx.get(userRef);
      const currentPoints = userSnap.exists ? (userSnap.data()?.points || 0) : 0;

      trx.set(adgemTxnRef, {
        transactionId,
        payout,
        pointsEarned,
        status: 'completed',
        source: 'adgem',
        createdAt: (global as any).Timestamp ? (global as any).Timestamp.now() : new Date(),
      });

      trx.update(userRef, {
        points: currentPoints + pointsEarned,
        updatedAt: new Date(),
      });

      trx.set(userRef.collection('offerwall_ledger').doc(), {
        amount: pointsEarned,
        offer_name: 'AdGem Offer',
        source: 'adgem',
        transactionId,
        ts: new Date(),
      });
    });

    return new NextResponse('1', { status: 200 });
  } catch (err) {
    console.error('[adgem postback] error', err);
    return new NextResponse('0', { status: 500 });
  }
}
