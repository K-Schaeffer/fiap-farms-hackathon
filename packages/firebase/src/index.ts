import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  Auth,
  Persistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { getReactNativePersistence } from './temp/nativePersistence';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAIkVXHuaQVUhxIlzRZ-_-i-syrJffHbbc',
  authDomain: 'fiap-farms-hackathon.firebaseapp.com',
  projectId: 'fiap-farms-hackathon',
  storageBucket: 'fiap-farms-hackathon.firebasestorage.app',
  messagingSenderId: '402002365606',
  appId: '1:402002365606:web:798c30d0c626e360eab867',
};

export interface FirebaseInstance {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

// Singleton instance
let firebaseInstance: FirebaseInstance | null = null;

const _isReactNative = (): boolean => {
  // Check if running in React Native environment
  return (
    typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
  );
};

// Helper function to get appropriate persistence
const _getPersistence = (): Persistence => {
  if (_isReactNative()) {
    return getReactNativePersistence(ReactNativeAsyncStorage);
  }

  return browserSessionPersistence;
};

const _initializeFirebase = (): FirebaseInstance => {
  let app: FirebaseApp;
  let auth: Auth;

  // Check if Firebase app already exists
  if (getApps().length > 0) {
    app = getApp();
    auth = getAuth(app);
  } else {
    // Initialize new app
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: _getPersistence(),
    });
  }

  const db: Firestore = getFirestore(app);

  // Store singleton instance
  firebaseInstance = { app, auth, db };

  return firebaseInstance;
};

export const getFirebase = (): FirebaseInstance => {
  // Initialize with default persistence if not already done
  if (!firebaseInstance) {
    return _initializeFirebase();
  }

  return firebaseInstance;
};

// Utility to check if Firebase is initialized
export const isFirebaseInitialized = (): boolean => {
  return firebaseInstance !== null;
};

// Re-export utilities
export {
  getFirebaseAuth,
  getFirebaseDb,
  getFirebaseApp,
} from './utils/getFirebase';
