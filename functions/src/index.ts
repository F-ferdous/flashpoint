import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import crypto from "crypto";

admin.initializeApp();

// OfferToro postback endpoint
// Configure this URL in OfferToro dashboard as the postback/callback URL
export const offerToroCallback = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response<any>) => {
  try {
    const { user_id, amount, sig, transaction_id, offer_id, offer_name } = req.query as Record<string, string | undefined>;

    const secretKey = process.env.OFFERTORO_SECRET_KEY || functions.config().offertoro?.secret;

    if (!user_id || !amount || !sig) {
      return res.status(400).send("Missing required params");
    }
    if (!secretKey) {
      console.error("OfferToro secret not configured");
      return res.status(500).send("Server misconfigured");
    }

    // Validate signature
    const expectedSig = crypto
      .createHash("md5")
      .update(`${user_id}${amount}${secretKey}`)
      .digest("hex");

    if (sig !== expectedSig) {
      console.warn("Invalid signature", { user_id, amount, sig, expectedSig });
      return res.status(400).send("Invalid signature");
    }

    const points = Number(amount);
    if (!Number.isFinite(points) || points <= 0) {
      return res.status(400).send("Invalid amount");
    }

    const db = admin.firestore();
    const userRef = db.collection("users").doc(user_id);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists) {
        // initialize user doc if missing; points start at 0
        tx.set(userRef, { uid: user_id, points: 0 }, { merge: true });
      }
      tx.update(userRef, {
        points: admin.firestore.FieldValue.increment(points),
      });

      // Write a ledger entry for audit
      const ledgerRef = userRef.collection("offerwall_ledger").doc(transaction_id || db.collection("_tmp").doc().id);
      tx.set(ledgerRef, {
        ts: admin.firestore.FieldValue.serverTimestamp(),
        provider: "OfferToro",
        amount: points,
        transaction_id: transaction_id || null,
        offer_id: offer_id || null,
        offer_name: offer_name || null,
        raw: { user_id, amount, sig },
      });
    });

    return res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error");
  }
});
