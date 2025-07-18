import { Typography } from '@mui/material';
import { getFirebase } from '@fiap-farms/firebase-config';
import { useAuth } from '@fiap-farms/auth-store';

export default function Dashboard() {
  // Ensure Firebase auth is initialized
  const firebase = getFirebase();

  console.log('Firebase initialized products:', firebase);

  const { user } = useAuth();

  console.log('Current user context:', user?.email);
  console.log('Current user firebase:', firebase.auth.currentUser?.email);

  return (
    <div>
      <Typography variant="h1">Web Products</Typography>
    </div>
  );
}
