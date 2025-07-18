import { getFirebase } from '../index';

export function getFirebaseAuth() {
  return getFirebase().auth;
}

export function getFirebaseDb() {
  return getFirebase().db;
}

export function getFirebaseApp() {
  return getFirebase().app;
}
