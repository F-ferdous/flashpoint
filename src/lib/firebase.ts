// Firebase client initialization for Next.js (App Router)
// Uses environment variables to configure the Firebase web SDK.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Guard against re-initialization during fast refresh in dev
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Commonly used Firebase services
export const auth = getAuth(app);
// Explicitly persist auth state across tabs/reloads
setPersistence(auth, browserLocalPersistence).catch(() => {
  // Non-fatal: persistence might fail in some environments (e.g., private mode)
});
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
