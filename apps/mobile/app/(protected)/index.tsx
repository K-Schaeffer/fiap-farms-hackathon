import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, Text, Button, MD3LightTheme } from 'react-native-paper';
import { useAuth } from '@fiap-farms/auth-store';
import { MobileMainGrid } from '../../components/MobileMainGrid';

const theme = {
  ...MD3LightTheme,
};

export default function Homepage() {
  const { signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err: unknown) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.welcomeText}>
              Welcome to FIAP Farms!
            </Text>
            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
              disabled={isLoading}
            >
              Logout
            </Button>
          </View>
          <MobileMainGrid />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  welcomeText: {
    flex: 1,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginLeft: 16,
  },
});
