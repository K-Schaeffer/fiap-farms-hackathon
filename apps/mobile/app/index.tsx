import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import MainGrid from '../components/MainGrid';

const theme = {
  ...MD3LightTheme,
};

export default function Native() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <MainGrid />
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});
