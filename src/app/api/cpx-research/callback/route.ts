import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { admin } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract CPX Research callback parameters
    const transactionId = searchParams.get('transaction_id');
    const userId = searchParams.get('user_id');
    const reward = searchParams.get('reward');
    const currency = searchParams.get('currency_name') || 'USD';
    const timestamp = searchParams.get('timestamp');
    const ip = searchParams.get('ip');
    const status = searchParams.get('status'); // 1 for completed, 2 for chargeback
    const hash = searchParams.get('hash');

    // Validate required parameters
    if (!transactionId || !userId || !reward || !timestamp || !hash) {
      console.log('Missing required parameters:', { transactionId, userId, reward, timestamp, hash });
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get CPX Research secure hash from environment
    const secureHash = process.env.CPX_RESEARCH_SECURE_HASH;
    if (!secureHash) {
      console.log('CPX Research secure hash not configured');
      return NextResponse.json({ error: 'CPX Research not configured' }, { status: 500 });
    }

    // Verify the callback hash (security measure)
    // CPX Research sends: MD5(transaction_id + user_id + reward + currency + timestamp + status + ip + secure_hash)
    const expectedHashString = `${transactionId}${userId}${reward}${currency}${timestamp}${status || '1'}${ip || ''}${secureHash}`;
    const expectedHash = crypto.createHash('md5').update(expectedHashString).digest('hex');

    if (hash !== expectedHash) {
      console.log('Hash verification failed:', { 
        received: hash, 
        expected: expectedHash, 
        hashString: expectedHashString 
      });
      return NextResponse.json({ error: 'Invalid hash' }, { status: 400 });
    }

    // Handle the reward based on status
    if (status === '1') {
      // Completed survey - add rewards
      await processReward(userId, parseFloat(reward), transactionId, currency);
    } else if (status === '2') {
      // Chargeback - deduct rewards
      await processChargeback(userId, parseFloat(reward), transactionId, currency);
    }

    // Respond with success (CPX Research expects this)
    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('CPX Research callback error:', error);
    return new NextResponse('0', { status: 500 });
  }
}

async function processReward(userId: string, rewardAmount: number, transactionId: string, currency: string) {
  try {
    const db = admin.firestore();
    
    // Check if transaction already processed (prevent duplicates)
    const existingTransaction = await db
      .collection('users')
      .doc(userId)
      .collection('cpx_transactions')
      .doc(transactionId)
      .get();

    if (existingTransaction.exists) {
      console.log('Transaction already processed:', transactionId);
      return;
    }

    // Convert reward to points (you can adjust the conversion rate)
    const pointsEarned = Math.floor(rewardAmount * 100); // $1 = 100 points

    // Update user points
    const userRef = db.collection('users').doc(userId);
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const currentPoints = userDoc.exists ? (userDoc.data()?.points || 0) : 0;
      
      // Update user points
      transaction.update(userRef, {
        points: currentPoints + pointsEarned,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Add transaction record
      transaction.set(userRef.collection('cpx_transactions').doc(transactionId), {
        transactionId,
        rewardAmount,
        currency,
        pointsEarned,
        status: 'completed',
        source: 'cpx_research',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Add to earnings ledger
      transaction.set(userRef.collection('offerwall_ledger').doc(), {
        amount: pointsEarned,
        offer_name: 'CPX Research Survey',
        source: 'cpx_research',
        transactionId,
        ts: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    console.log(`Processed CPX Research reward for user ${userId}: $${rewardAmount} = ${pointsEarned} points`);

  } catch (error) {
    console.error('Error processing CPX Research reward:', error);
    throw error;
  }
}

async function processChargeback(userId: string, rewardAmount: number, transactionId: string, currency: string) {
  try {
    const db = admin.firestore();
    const pointsToDeduct = Math.floor(rewardAmount * 100); // Same conversion rate

    // Update user points (deduct)
    const userRef = db.collection('users').doc(userId);
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const currentPoints = userDoc.exists ? (userDoc.data()?.points || 0) : 0;
      const newPoints = Math.max(0, currentPoints - pointsToDeduct); // Don't go negative
      
      // Update user points
      transaction.update(userRef, {
        points: newPoints,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Update transaction record
      transaction.update(userRef.collection('cpx_transactions').doc(transactionId), {
        status: 'chargeback',
        chargebackAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Add chargeback to ledger
      transaction.set(userRef.collection('offerwall_ledger').doc(), {
        amount: -pointsToDeduct,
        offer_name: 'CPX Research Chargeback',
        source: 'cpx_research_chargeback',
        transactionId,
        ts: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    console.log(`Processed CPX Research chargeback for user ${userId}: -${pointsToDeduct} points`);

  } catch (error) {
    console.error('Error processing CPX Research chargeback:', error);
    throw error;
  }
}