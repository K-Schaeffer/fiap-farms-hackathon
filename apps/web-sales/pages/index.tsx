import { WebMainGrid } from '@fiap-farms/web-ui';
import { getFirebase } from '@fiap-farms/firebase';
import { useAuth } from '@fiap-farms/auth-store';

export default function Dashboard() {
  // Ensure Firebase auth is initialized
  const firebase = getFirebase();

  console.log('Firebase initialized sales:', firebase);

  const { user } = useAuth();

  console.log('Current user context:', user?.email);
  console.log('Current user firebase:', firebase.auth.currentUser?.email);

  return <WebMainGrid />;
}
