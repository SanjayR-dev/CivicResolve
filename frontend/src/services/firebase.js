import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getComplaints } from './api.js';

// Firebase configuration from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your_api_key'
);

let app = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('[CivicResolve Firebase] Connected successfully to project:', firebaseConfig.projectId);
  } catch (err) {
    console.warn('[CivicResolve Firebase] Initialization failed, using local real-time synchronization:', err.message);
  }
} else {
  console.log('[CivicResolve] Firebase credentials not supplied; utilizing resilient real-time syncing.');
}

/**
 * Real-time subscription to complaints collection.
 * If Firebase is configured, utilizes Firestore onSnapshot real-time listener.
 * If not configured, uses low-latency polling to keep citizen and admin dashboards in continuous sync!
 */
export function subscribeToComplaints(callback, errorCallback, intervalMs = 3000) {
  if (db && isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'complaints'), orderBy('created_at', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const complaints = [];
        snapshot.forEach((doc) => {
          complaints.push({ id: doc.id, ...doc.data() });
        });
        callback(complaints);
      }, (err) => {
        console.error('[Firestore onSnapshot error]', err);
        if (errorCallback) errorCallback(err);
      });
      return unsubscribe;
    } catch (e) {
      console.warn('Firestore onSnapshot failed, falling back to interval syncing:', e);
    }
  }

  // Resilient real-time sync mechanism
  let active = true;

  const fetchLatest = async () => {
    try {
      const res = await getComplaints();
      if (active && res.success) {
        callback(res.complaints);
      }
    } catch (err) {
      if (active && errorCallback) {
        errorCallback(err);
      }
    }
  };

  // Initial fetch
  fetchLatest();

  // Polling loop
  const timer = setInterval(fetchLatest, intervalMs);

  return () => {
    active = false;
    clearInterval(timer);
  };
}

export { app, db, storage, isFirebaseConfigured };
