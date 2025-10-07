import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function Page({ params }: { params: { uid: string } }) {
  const id = params.uid;
  let refUid = id;
  try {
    const snap = await adminDb.collection("customers").where("customerId", "==", id).limit(1).get();
    if (!snap.empty) {
      refUid = snap.docs[0].id; // actual auth uid
    }
  } catch {}
  redirect(`/signup?ref=${encodeURIComponent(refUid)}`);
}
