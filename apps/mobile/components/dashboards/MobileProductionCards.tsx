import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export interface MobileProductionItem {
  id: string;
  productName: string;
  status: 'planted' | 'in_production' | 'harvested' | 'overdue';
  location: string;
  plantedDate?: string;
  expectedHarvestDate?: string;
  harvestedDate?: string;
  yield?: number;
  unit?: string;
}

export interface MobileProductionCardsProps {
  productionItems: MobileProductionItem[];
}

export function MobileProductionCards({
  productionItems,
}: MobileProductionCardsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planted':
        return '#388e3c'; // Green
      case 'in_production':
        return '#f57c00'; // Orange
      case 'harvested':
        return '#1976d2'; // Blue
      case 'overdue':
        return '#d32f2f'; // Red
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planted':
        return 'spa';
      case 'in_production':
        return 'schedule';
      case 'harvested':
        return 'agriculture';
      case 'overdue':
        return 'warning';
      default:
        return 'help';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planted':
        return 'Planted';
      case 'in_production':
        return 'In Production';
      case 'harvested':
        return 'Harvested';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Unknown';
    }
  };

  const getUnitColor = (unit: string) => {
    switch (unit) {
      case 'kg':
        return '#1976d2'; // Primary blue
      case 'unity':
        return '#9c27b0'; // Purple
      case 'box':
        return '#f57c00'; // Orange
      default:
        return '#666'; // Gray
    }
  };

  const renderProductionCard = (item: MobileProductionItem) => (
    <Card key={item.id} style={styles.card} mode="outlined">
      <Card.Content style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.productInfo}>
            <Text variant="titleMedium" style={styles.productName}>
              {item.productName}
            </Text>
            <Text variant="bodyMedium" style={styles.location}>
              Location: {item.location}
            </Text>
            {item.unit && (
              <View
                style={[
                  styles.unitChip,
                  { backgroundColor: getUnitColor(item.unit) },
                ]}
              >
                <Text style={styles.unitText}>{item.unit}</Text>
              </View>
            )}
          </View>
          <Chip
            icon={() => (
              <MaterialIcons
                name={
                  getStatusIcon(
                    item.status
                  ) as keyof typeof MaterialIcons.glyphMap
                }
                size={16}
                color="#fff"
              />
            )}
            style={[
              styles.statusChip,
              { backgroundColor: getStatusColor(item.status) },
            ]}
            textStyle={styles.statusText}
          >
            {getStatusLabel(item.status)}
          </Chip>
        </View>

        <View style={styles.details}>
          {item.plantedDate && (
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Planted:
              </Text>
              <Text variant="bodySmall" style={styles.detailValue}>
                {formatDate(item.plantedDate)}
              </Text>
            </View>
          )}

          {item.expectedHarvestDate && (
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Expected Harvest:
              </Text>
              <Text variant="bodySmall" style={styles.detailValue}>
                {formatDate(item.expectedHarvestDate)}
              </Text>
            </View>
          )}

          {item.harvestedDate && (
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.detailLabel}>
                Harvested:
              </Text>
              <Text variant="bodySmall" style={styles.detailValue}>
                {formatDate(item.harvestedDate)}
              </Text>
            </View>
          )}

          {item.yield !== undefined &&
            item.yield !== null &&
            item.status === 'harvested' && (
              <View style={styles.detailRow}>
                <Text variant="bodySmall" style={styles.detailLabel}>
                  Yield:
                </Text>
                <Text variant="bodySmall" style={styles.yieldValue}>
                  {item.yield}
                </Text>
              </View>
            )}
        </View>
      </Card.Content>
    </Card>
  );

  if (productionItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="spa" size={48} color="#ccc" />
        <Text variant="bodyLarge" style={styles.emptyText}>
          No production items found
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          Production items will appear here once you start planting
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {productionItems.map(renderProductionCard)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  location: {
    color: '#666',
  },
  statusChip: {
    minHeight: 32,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  unitChip: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 24,
  },
  unitText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  details: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  yieldValue: {
    color: '#388e3c',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 16,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    color: '#999',
    textAlign: 'center',
  },
});
