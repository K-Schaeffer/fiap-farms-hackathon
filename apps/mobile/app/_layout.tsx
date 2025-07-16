import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

const AppLayout = () => {
  return (
    <PaperProvider>
      <Stack />
    </PaperProvider>
  );
};

export default AppLayout;
