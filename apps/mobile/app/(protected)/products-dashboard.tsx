import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProductsDashboardPage() {
  return (
    <View style={styles.container}>
      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.comingSoonContainer}>
          <Surface style={styles.comingSoonCard} elevation={2}>
            <MaterialIcons name="dashboard" size={64} color="#388e3c" />
            <Text variant="headlineMedium" style={styles.comingSoonTitle}>
              Products Dashboard
            </Text>
            <Text variant="bodyLarge" style={styles.comingSoonSubtitle}>
              Coming Soon
            </Text>
            <Text variant="bodyMedium" style={styles.comingSoonDescription}>
              Monitor product inventory levels, track stock movements, and
              analyze product performance metrics.
            </Text>
          </Surface>
        </View>

        <View style={styles.featuresContainer}>
          <Text variant="titleLarge" style={styles.featuresTitle}>
            Features You'll See Here:
          </Text>

          <Card style={styles.featureCard} mode="outlined">
            <Card.Content>
              <View style={styles.featureRow}>
                <MaterialIcons name="inventory-2" size={24} color="#388e3c" />
                <Text variant="bodyMedium" style={styles.featureText}>
                  Real-time inventory levels
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.featureCard} mode="outlined">
            <Card.Content>
              <View style={styles.featureRow}>
                <MaterialIcons name="trending-up" size={24} color="#388e3c" />
                <Text variant="bodyMedium" style={styles.featureText}>
                  Product performance analytics
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.featureCard} mode="outlined">
            <Card.Content>
              <View style={styles.featureRow}>
                <MaterialIcons name="warning" size={24} color="#388e3c" />
                <Text variant="bodyMedium" style={styles.featureText}>
                  Low stock alerts and notifications
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  comingSoonContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  comingSoonCard: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  comingSoonTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
    color: '#388e3c',
  },
  comingSoonSubtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  comingSoonDescription: {
    marginTop: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  featuresContainer: {
    gap: 12,
  },
  featuresTitle: {
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: '#fff',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    color: '#333',
  },
});
