import { Slot } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuthListener } from '@fiap-farms/auth-store';

const theme = {
  ...MD3LightTheme,
};

const AppLayout = () => {
  useAuthListener();

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Slot />
        <StatusBar style="auto" />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default AppLayout;
