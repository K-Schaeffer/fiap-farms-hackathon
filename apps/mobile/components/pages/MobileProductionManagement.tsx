import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
  Text,
  SegmentedButtons,
  Card,
  Button,
  Surface,
  Chip,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import {
  MobilePlantingModal,
  MobileHarvestModal,
  MobilePlantingFormData,
  MobileHarvestFormData,
} from '../modals';

export interface MobileProductData {
  id: string;
  name: string;
  description: string;
  unit: 'kg' | 'unity' | 'box';
  costPerUnit: number;
}

export interface MobileProductionItem {
  id: string;
  productId: string;
  productName: string;
  status: 'planted' | 'in_production' | 'harvested';
  location: string;
  plantedDate: string;
  expectedHarvestDate: string;
  harvestedDate?: string;
  yield?: number;
  unit: string;
}

export interface MobileProductionManagementProps {
  availableProducts?: MobileProductData[];
  productionItems?: MobileProductionItem[];
  onStartProduction?: (
    productId: string,
    data: MobilePlantingFormData
  ) => Promise<void>;
  onUpdateStatus?: (
    itemId: string,
    newStatus: 'planted' | 'in_production' | 'harvested'
  ) => Promise<void>;
  onHarvestItem?: (
    itemId: string,
    data: MobileHarvestFormData
  ) => Promise<void>;
  onRefresh?: () => void;
}

const productionViews = [
  { value: 'available', label: 'Available', icon: 'sprout' },
  { value: 'planted', label: 'Planted', icon: 'spa' },
  { value: 'in_production', label: 'Growing', icon: 'clock' },
  { value: 'harvested', label: 'Harvested', icon: 'tractor' },
] as const;

type ProductionView = (typeof productionViews)[number]['value'];

export function MobileProductionManagement({
  availableProducts = [],
  productionItems = [],
  onStartProduction,
  onUpdateStatus,
  onHarvestItem,
  onRefresh,
}: MobileProductionManagementProps) {
  const [currentView, setCurrentView] = useState<ProductionView>('available');
  const [plantingModalOpen, setPlantingModalOpen] = useState(false);
  const [harvestModalOpen, setHarvestModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<MobileProductData | null>(null);
  const [selectedProductionItem, setSelectedProductionItem] =
    useState<MobileProductionItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [plantingLoading, setPlantingLoading] = useState(false);
  const [harvestLoading, setHarvestLoading] = useState(false);

  // Check if a production item is overdue
  const isOverdue = (item: MobileProductionItem) => {
    return (
      item.status !== 'harvested' &&
      item.expectedHarvestDate &&
      dayjs(item.expectedHarvestDate).isBefore(dayjs(), 'day')
    );
  };

  // Filter production items by status
  const plantedItems = productionItems.filter(
    item => item.status === 'planted'
  );
  const inProductionItems = productionItems.filter(
    item => item.status === 'in_production'
  );
  const harvestedItems = productionItems.filter(
    item => item.status === 'harvested'
  );

  const handleStartProduction = (product: MobileProductData) => {
    setSelectedProduct(product);
    setPlantingModalOpen(true);
  };

  const handleUpdateToInProduction = async (item: MobileProductionItem) => {
    if (onUpdateStatus) {
      try {
        await onUpdateStatus(item.id, 'in_production');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const handleReadyToHarvest = (item: MobileProductionItem) => {
    setSelectedProductionItem(item);
    setHarvestModalOpen(true);
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      try {
        onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  };

  // Unit color function to match dashboard
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

  // Status functions to match dashboard
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planted':
        return '#388e3c'; // Green
      case 'in_production':
        return '#f57c00'; // Orange
      case 'harvested':
        return '#1976d2'; // Blue
      default:
        return '#666';
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
      default:
        return 'Unknown';
    }
  };

  const renderAvailableProducts = () => (
    <View style={styles.itemsContainer}>
      {availableProducts.length === 0 ? (
        <Surface style={styles.emptyState}>
          <MaterialIcons name="agriculture" size={48} color="#666" />
          <Text variant="bodyLarge" style={styles.emptyStateText}>
            No products available
          </Text>
          <Text variant="bodyMedium" style={styles.emptyStateSubtext}>
            Add products to start production management
          </Text>
        </Surface>
      ) : (
        availableProducts.map(product => (
          <Card key={product.id} style={styles.productCard} mode="outlined">
            <Card.Content style={styles.cardContent}>
              <View style={styles.productHeader}>
                <Text variant="titleMedium" style={styles.productName}>
                  {product.name}
                </Text>
                <View style={styles.chipContainer}>
                  <Chip
                    mode="flat"
                    style={styles.availableChip}
                    textStyle={styles.availableChipText}
                  >
                    Available
                  </Chip>
                  <View
                    style={[
                      styles.unitChip,
                      { backgroundColor: getUnitColor(product.unit) },
                    ]}
                  >
                    <Text style={styles.unitChipText}>{product.unit}</Text>
                  </View>
                </View>
              </View>
              <Text variant="bodyMedium" style={styles.productDescription}>
                {product.description}
              </Text>
              <Text variant="bodySmall" style={styles.costText}>
                Cost: ${product.costPerUnit.toFixed(2)}/{product.unit}
              </Text>
              <Button
                mode="contained"
                onPress={() => handleStartProduction(product)}
                style={styles.actionButton}
                icon="spa"
              >
                Start Production
              </Button>
            </Card.Content>
          </Card>
        ))
      )}
    </View>
  );

  const renderProductionItems = (
    items: MobileProductionItem[],
    status: 'planted' | 'in_production' | 'harvested'
  ) => (
    <View style={styles.itemsContainer}>
      {items.length === 0 ? (
        <Surface style={styles.emptyState}>
          <MaterialIcons
            name={
              status === 'planted'
                ? 'spa'
                : status === 'in_production'
                  ? 'schedule'
                  : 'agriculture'
            }
            size={48}
            color="#666"
          />
          <Text variant="bodyLarge" style={styles.emptyStateText}>
            No {status.replace('_', ' ')} items
          </Text>
          <Text variant="bodyMedium" style={styles.emptyStateSubtext}>
            {status === 'planted'
              ? 'Items will appear here after planting'
              : status === 'in_production'
                ? 'Items will appear here when production starts'
                : 'Completed harvests will appear here'}
          </Text>
        </Surface>
      ) : (
        items.map(item => {
          const itemIsOverdue = isOverdue(item);

          return (
            <Card
              key={item.id}
              style={[
                styles.productionCard,
                itemIsOverdue && styles.overdueCard,
              ]}
              mode="outlined"
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.productionHeader}>
                  <Text variant="titleMedium" style={styles.productionTitle}>
                    Production #{item.id.slice(-6)}
                  </Text>
                  <Chip
                    mode="flat"
                    style={[
                      styles.statusChip,
                      { backgroundColor: getStatusColor(status) },
                    ]}
                    textStyle={styles.statusChipText}
                  >
                    {getStatusLabel(status)}
                  </Chip>
                </View>

                <View style={styles.productionDetails}>
                  <View style={styles.detailRow}>
                    <Text variant="bodyMedium" style={styles.detailLabel}>
                      Product:
                    </Text>
                    <Text variant="bodyMedium" style={styles.detailValue}>
                      {item.productName}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="bodyMedium" style={styles.detailLabel}>
                      Location:
                    </Text>
                    <Text variant="bodyMedium" style={styles.detailValue}>
                      {item.location}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="bodySmall" style={styles.detailLabel}>
                      Planted:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      {new Date(item.plantedDate).toLocaleDateString('en-US')}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.detailLabel,
                        itemIsOverdue && styles.overdueLabel,
                      ]}
                    >
                      Expected:
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.detailValue,
                        itemIsOverdue && styles.overdueValue,
                      ]}
                    >
                      {new Date(item.expectedHarvestDate).toLocaleDateString(
                        'en-US'
                      )}
                      {itemIsOverdue && ' (Overdue)'}
                    </Text>
                  </View>
                  {item.harvestedDate && (
                    <View style={styles.detailRow}>
                      <Text variant="bodySmall" style={styles.detailLabel}>
                        Harvested:
                      </Text>
                      <Text variant="bodySmall" style={styles.detailValue}>
                        {new Date(item.harvestedDate).toLocaleDateString(
                          'en-US'
                        )}
                      </Text>
                    </View>
                  )}
                  {item.yield && (
                    <View style={styles.detailRow}>
                      <Text variant="bodyMedium" style={styles.yieldLabel}>
                        Yield:
                      </Text>
                      <Text variant="bodyMedium" style={styles.yieldValue}>
                        {item.yield} ({item.unit})
                      </Text>
                    </View>
                  )}
                </View>

                {/* Status-specific action buttons */}
                {status === 'planted' && (
                  <Button
                    mode="contained"
                    onPress={() => handleUpdateToInProduction(item)}
                    style={styles.actionButton}
                    icon="clock"
                  >
                    Mark In Production
                  </Button>
                )}

                {status === 'in_production' && (
                  <Button
                    mode="contained"
                    onPress={() => handleReadyToHarvest(item)}
                    style={styles.actionButton}
                    icon="tractor"
                  >
                    Ready to Harvest
                  </Button>
                )}
              </Card.Content>
            </Card>
          );
        })
      )}
    </View>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'available':
        return renderAvailableProducts();
      case 'planted':
        return renderProductionItems(plantedItems, 'planted');
      case 'in_production':
        return renderProductionItems(inProductionItems, 'in_production');
      case 'harvested':
        return renderProductionItems(harvestedItems, 'harvested');
      default:
        return null;
    }
  };

  // Create segment buttons with icons only
  const segmentButtons = productionViews.map(view => ({
    value: view.value,
    icon: view.icon,
  }));

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Icon-only Tab Navigation */}
        <SegmentedButtons
          value={currentView}
          onValueChange={value => setCurrentView(value as ProductionView)}
          buttons={segmentButtons}
          style={styles.segmentedButtons}
        />

        {/* Current View Content */}
        {renderCurrentView()}
      </ScrollView>

      {/* Planting Modal */}
      <MobilePlantingModal
        visible={plantingModalOpen}
        productName={selectedProduct?.name || ''}
        onDismiss={() => {
          setPlantingModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={async (data: MobilePlantingFormData) => {
          if (selectedProduct && onStartProduction) {
            setPlantingLoading(true);
            try {
              await onStartProduction(selectedProduct.id, data);
              setPlantingModalOpen(false);
              setSelectedProduct(null);
            } catch (error) {
              // Error is already handled by the hook
              console.error('Planting failed:', error);
            } finally {
              setPlantingLoading(false);
            }
          }
        }}
        loading={plantingLoading}
      />

      {/* Harvest Modal */}
      <MobileHarvestModal
        visible={harvestModalOpen}
        productName={selectedProductionItem?.productName || ''}
        onDismiss={() => {
          setHarvestModalOpen(false);
          setSelectedProductionItem(null);
        }}
        onConfirm={async (data: MobileHarvestFormData) => {
          if (selectedProductionItem && onHarvestItem) {
            setHarvestLoading(true);
            try {
              await onHarvestItem(selectedProductionItem.id, data);
              setHarvestModalOpen(false);
              setSelectedProductionItem(null);
            } catch (error) {
              // Error is already handled by the hook
              console.error('Harvesting failed:', error);
            } finally {
              setHarvestLoading(false);
            }
          }
        }}
        loading={harvestLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },

  statusChip: {
    minHeight: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusChipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  availableChip: {
    backgroundColor: '#f5f5f5',
  },
  availableChipText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  itemsContainer: {
    gap: 12,
  },
  productCard: {
    backgroundColor: '#fff',
  },
  productionCard: {
    backgroundColor: '#fff',
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f', // Red border for overdue items
  },
  cardContent: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    flex: 1,
    fontWeight: '600',
  },
  productionTitle: {
    flex: 1,
    fontWeight: '600',
    color: '#333',
  },
  unitChip: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 24,
  },
  unitChipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  productDescription: {
    color: '#666',
    marginBottom: 8,
  },
  costText: {
    color: '#388e3c',
    marginBottom: 16,
    fontWeight: '700',
  },
  productionDetails: {
    gap: 4,
    marginBottom: 16,
  },
  detailText: {
    color: '#666',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  overdueLabel: {
    color: '#d32f2f', // Red color for overdue labels
  },
  detailValue: {
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  overdueValue: {
    color: '#d32f2f', // Red color for overdue values
  },
  yieldLabel: {
    fontWeight: '700',
    color: '#388e3c',
  },
  yieldValue: {
    color: '#388e3c',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  yieldText: {
    color: '#388e3c',
    fontWeight: '700',
    marginTop: 4,
  },
  actionButton: {
    alignSelf: 'flex-end',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  emptyStateText: {
    marginTop: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    marginTop: 8,
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
  },
});
