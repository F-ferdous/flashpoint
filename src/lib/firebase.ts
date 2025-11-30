import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAafotIveq0Ymd8RWxbZpbnBjMGQ7t1SlE",
  authDomain: "gesaflash-775ec.firebaseapp.com",
  projectId: "gesaflash-775ec",
  storageBucket: "gesaflash-775ec.firebasestorage.app",
  messagingSenderId: "68325647865",
  appId: "1:68325647865:web:6188a7b5e1dd203c184928",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
export default app;
