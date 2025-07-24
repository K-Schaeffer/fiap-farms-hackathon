import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface MobileSalesWelcomeProps {
  onNavigateToNewSale: () => void;
  onNavigateToDashboard: () => void;
}

export function MobileSalesWelcome({
  onNavigateToNewSale,
  onNavigateToDashboard,
}: MobileSalesWelcomeProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={['#1976d2', '#2196f3']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <MaterialIcons name="shopping-cart" size={48} color="white" />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Sales Management
          </Text>
          <Text variant="bodyLarge" style={styles.headerSubtitle}>
            Track your sales performance and create new sales transactions
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
                <MaterialIcons
                  name="add-shopping-cart"
                  size={32}
                  color="#1976d2"
                />
              </View>
              <Text variant="titleMedium" style={styles.cardTitle}>
                New Sale
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Create a new sales transaction and manage your inventory
              </Text>
              <Button
                mode="contained"
                style={styles.cardButton}
                onPress={onNavigateToNewSale}
              >
                Start New Sale
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.actionCard} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <MaterialIcons name="assessment" size={32} color="#1976d2" />
              </View>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Sales Dashboard
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                View sales analytics, revenue trends, and performance metrics
              </Text>
              <Button
                mode="contained"
                style={styles.cardButton}
                onPress={onNavigateToDashboard}
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
