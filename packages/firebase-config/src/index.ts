import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, Auth, Persistence } from 'firebase/auth';
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

export const getFirebase = (
  authPersistence?: Persistence
): FirebaseInstance => {
  let app: FirebaseApp;
  let auth: Auth;

  const hasApp = getApps().length > 0;

  if (!hasApp) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: authPersistence,
    });
  } else {
    app = getApp();
    auth = getAuth(app);
  }

  const db: Firestore = getFirestore(app);

  return { app, auth, db };
};
