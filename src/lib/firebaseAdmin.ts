// Firebase Admin initialization for server-side (API routes)
// Uses env-provided service account credentials. Do NOT expose these to the client.

import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

export const adminReady = Boolean(projectId && clientEmail && privateKey);
if (!adminReady) {
  // Avoid throwing here; let APIs respond with clear 500s instead of crashing the build.
  console.warn('[firebaseAdmin] Missing admin credentials. Set FIREBASE_ADMIN_* in .env.local');
}

export const adminApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: adminReady ? cert({ projectId: projectId!, clientEmail: clientEmail!, privateKey: privateKey! }) : undefined,
    });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
