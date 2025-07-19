import { Auth } from 'firebase/auth';
import { getFirebase } from '../index';
import { Firestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';

export function getFirebaseAuth(): Auth {
  return getFirebase().auth;
}

export function getFirebaseDb(): Firestore {
  return getFirebase().db;
}

export function getFirebaseApp(): FirebaseApp {
  return getFirebase().app;
}
