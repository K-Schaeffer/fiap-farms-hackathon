import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export interface MobileStatCardProps {
  title: string;
  value: string;
  interval: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'success' | 'info' | 'warning' | 'error' | 'default';
  icon?: keyof typeof MaterialIcons.glyphMap;
}

const getCardColor = (color: MobileStatCardProps['color']) => {
  switch (color) {
    case 'primary':
      return '#1976d2';
    case 'success':
      return '#2e7d32';
    case 'info':
      return '#0288d1';
    case 'warning':
      return '#ed6c02';
    case 'error':
      return '#d32f2f';
    default:
      return '#666';
  }
};

const getBackgroundColor = (color: MobileStatCardProps['color']) => {
  switch (color) {
    case 'primary':
      return '#e3f2fd';
    case 'success':
      return '#e8f5e8';
    case 'info':
      return '#e1f5fe';
    case 'warning':
      return '#fff3e0';
    case 'error':
      return '#ffebee';
    default:
      return '#f5f5f5';
  }
};

export function MobileStatCard({
  title,
  value,
  interval,
  trend = 'neutral',
  color = 'default',
  icon,
}: MobileStatCardProps) {
  const cardColor = getCardColor(color);
  const backgroundColor = getBackgroundColor(color);

  return (
    <Card style={[styles.card, { backgroundColor }]} mode="elevated">
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          {icon && (
            <MaterialIcons
              name={icon}
              size={24}
              color={cardColor}
              style={styles.icon}
            />
          )}
          <Text
            variant="bodyMedium"
            style={[styles.title, { color: cardColor }]}
          >
            {title}
          </Text>
        </View>

        <Text
          variant="headlineMedium"
          style={[styles.value, { color: cardColor }]}
        >
          {value}
        </Text>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.interval}>
            {interval}
          </Text>
          {trend !== 'neutral' && (
            <MaterialIcons
              name={trend === 'up' ? 'trending-up' : 'trending-down'}
              size={16}
              color={trend === 'up' ? '#2e7d32' : '#d32f2f'}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    elevation: 2,
    borderRadius: 12,
    marginBottom: 12,
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontWeight: '600',
    flex: 1,
  },
  value: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  interval: {
    color: '#666',
    flex: 1,
  },
});
