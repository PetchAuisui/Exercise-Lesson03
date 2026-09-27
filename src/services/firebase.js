import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAGdKi6xW-6uDZV4lY944z_2WncSf8x9-I",
  authDomain: "exercise-lesson03.firebaseapp.com",
  databaseURL: "https://exercise-lesson03-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "exercise-lesson03",
  storageBucket: "exercise-lesson03.firebasestorage.app",
  messagingSenderId: "918836295079",
  appId: "1:918836295079:web:55a7ffee9097feeebff282",
  measurementId: "G-LWWRVWCZB5"
};

// Default / fallback Firebase configuration
// Can be loaded from:
// 1. LocalStorage override ('ws_firebase_config') for easy dynamic setup
// 2. Environment variables (VITE_FIREBASE_*)
// 3. DEFAULT_FIREBASE_CONFIG (built-in production config)
const getStoredConfig = () => {
  try {
    const raw = localStorage.getItem('ws_firebase_config');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
};

export const getFirebaseConfig = () => {
  const stored = getStoredConfig();
  if (stored && stored.databaseURL) {
    return stored;
  }

  // Read from Vite environment variables if available
  const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
  const envConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    databaseURL: env.VITE_FIREBASE_DATABASE_URL || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.VITE_FIREBASE_APP_ID || ''
  };

  if (envConfig.databaseURL || envConfig.projectId) {
    return envConfig;
  }

  return DEFAULT_FIREBASE_CONFIG;
};

export const saveFirebaseConfig = (config) => {
  try {
    if (!config) {
      localStorage.removeItem('ws_firebase_config');
    } else {
      localStorage.setItem('ws_firebase_config', JSON.stringify(config));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('firebase-config-updated'));
    }
    return true;
  } catch (err) {
    console.error('Failed to save Firebase config:', err);
    return false;
  }
};

let app = null;
let database = null;

export const initFirebase = () => {
  const config = getFirebaseConfig();
  if (!config || !config.databaseURL) {
    return { app: null, database: null, isConfigured: false };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    database = getDatabase(app);
    return { app, database, isConfigured: true };
  } catch (err) {
    console.error('Error initializing Firebase:', err);
    return { app: null, database: null, isConfigured: false, error: err };
  }
};

export const getFirebaseDB = () => {
  if (!database) {
    const res = initFirebase();
    return res.database;
  }
  return database;
};
