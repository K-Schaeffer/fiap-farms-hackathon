import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export function MobileProductsWelcome() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    if (path === '/products/dashboard') {
      router.push('/(protected)/products-dashboard');
    } else if (path === '/products/management') {
      router.push('/(protected)/production-management');
    } else {
      // For other routes, we'll implement later
      console.log(`Navigate to: ${path}`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={['#2e7d32', '#388e3c']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <MaterialIcons name="inventory" size={48} color="white" />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Production Management
          </Text>
          <Text variant="bodyLarge" style={styles.headerSubtitle}>
            Manage your farm production lifecycle from planting to harvest
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.actionsContainer}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          What would you like to do?
        </Text>

        <View style={styles.cardsContainer}>
          <Card style={styles.actionCard} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <MaterialIcons name="agriculture" size={32} color="#2e7d32" />
              </View>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Production Management
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Manage planting, monitor growth, and track harvest progress
              </Text>
              <Button
                mode="contained"
                style={styles.cardButton}
                onPress={() => handleNavigate('/products/management')}
              >
                Manage Production
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.actionCard} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <MaterialIcons name="pie-chart" size={32} color="#2e7d32" />
              </View>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Production Dashboard
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                View production analytics, trends, and performance insights
              </Text>
              <Button
                mode="contained"
                style={styles.cardButton}
                onPress={() => handleNavigate('/products/dashboard')}
              >
                Open Dashboard
              </Button>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 300,
  },
  actionsContainer: {
    padding: 24,
  },
  sectionTitle: {
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: '#fff',
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  cardIcon: {
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
    maxWidth: 280,
  },
  cardButton: {
    marginTop: 16,
    alignSelf: 'center',
    minWidth: 160,
  },
});
