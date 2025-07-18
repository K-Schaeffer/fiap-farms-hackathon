import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useAuthListener } from '@fiap-farms/auth-store';

const AppLayout = () => {
  // Setup Firebase auth state listener at app level
  useAuthListener();

  return (
    <PaperProvider>
      <Stack />
    </PaperProvider>
  );
};

export default AppLayout;
