import { Slot } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useAuthListener,
  useProductionGoalListener,
  useSalesGoalListener,
} from '@fiap-farms/shared-stores';

import { registerTranslation, en } from 'react-native-paper-dates';

registerTranslation('en', en);

const theme = {
  ...MD3LightTheme,
};

const AppLayout = () => {
  useAuthListener();
  useProductionGoalListener();
  useSalesGoalListener();

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
