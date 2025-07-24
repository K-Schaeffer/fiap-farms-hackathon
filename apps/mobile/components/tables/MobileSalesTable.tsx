import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, Divider, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export interface MobileSaleHistoryItem {
  id: string;
  client: string;
  saleDate: string;
  items: { productName: string; quantity: number }[];
  totalSaleAmount: number;
  totalSaleProfit?: number;
}

export interface MobileSalesTableProps {
  salesHistory: MobileSaleHistoryItem[];
  onRefresh?: () => void;
  refreshing?: boolean;
  onBackPress?: () => void;
  title?: string;
}

type SortField = 'client' | 'saleDate' | 'totalSaleAmount' | 'totalSaleProfit';
type SortOrder = 'asc' | 'desc';

export function MobileSalesTable({
  salesHistory,
  onRefresh,
  refreshing = false,
  onBackPress,
  title = 'Sales History',
}: MobileSalesTableProps) {
  const [sortField, setSortField] = useState<SortField>('saleDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedData = useMemo(() => {
    return [...salesHistory].sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortField) {
        case 'client':
          aValue = a.client.toLowerCase();
          bValue = b.client.toLowerCase();
          break;
        case 'saleDate':
          aValue = new Date(a.saleDate);
          bValue = new Date(b.saleDate);
          break;
        case 'totalSaleAmount':
          aValue = a.totalSaleAmount;
          bValue = b.totalSaleAmount;
          break;
        case 'totalSaleProfit':
          aValue = a.totalSaleProfit || 0;
          bValue = b.totalSaleProfit || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [salesHistory, sortField, sortOrder]);

  const renderSortButton = (field: SortField, label: string) => (
    <Button
      mode={sortField === field ? 'contained-tonal' : 'outlined'}
      compact
      onPress={() => handleSort(field)}
      style={styles.sortButton}
      contentStyle={styles.sortButtonContent}
    >
      {label}{' '}
      {sortField === field && (
        <MaterialIcons
          name={
            sortOrder === 'asc' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
          }
          size={16}
        />
      )}
    </Button>
  );

  const renderTableRow = (item: MobileSaleHistoryItem) => (
    <Card key={item.id} style={styles.tableRow} mode="outlined">
      <Card.Content style={styles.rowContent}>
        {/* Client and Date Row */}
        <View style={styles.primaryRow}>
          <View style={styles.clientSection}>
            <MaterialIcons name="person" size={18} color="#1976d2" />
            <Text variant="titleMedium" style={styles.clientName}>
              {item.client}
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.dateText}>
            {formatDate(item.saleDate)}
          </Text>
        </View>

        <Divider style={styles.divider} />

        {/* Products Row */}
        <View style={styles.productsRow}>
          <Text variant="bodySmall" style={styles.productsLabel}>
            Products:
          </Text>
          <View style={styles.productsChips}>
            {item.items.slice(0, 2).map((product, index) => (
              <Chip
                key={index}
                mode="outlined"
                compact
                style={styles.productChip}
                textStyle={styles.chipText}
              >
                {product.productName.length > 10
                  ? `${product.productName.slice(0, 10)}...`
                  : product.productName}{' '}
                ({product.quantity})
              </Chip>
            ))}
            {item.items.length > 2 && (
              <Text variant="bodySmall" style={styles.moreItems}>
                +{item.items.length - 2} more
              </Text>
            )}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Amounts Row */}
        <View style={styles.amountsRow}>
          <View style={styles.amountItem}>
            <Text variant="bodySmall" style={styles.amountLabel}>
              Total
            </Text>
            <Text variant="titleMedium" style={styles.totalAmount}>
              {formatCurrency(item.totalSaleAmount)}
            </Text>
          </View>
          {item.totalSaleProfit !== undefined && (
            <View style={styles.amountItem}>
              <Text variant="bodySmall" style={styles.amountLabel}>
                Profit
              </Text>
              <Text variant="titleMedium" style={styles.profitAmount}>
                {formatCurrency(item.totalSaleProfit)}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  if (salesHistory.length === 0) {
    return (
      <View style={styles.container}>
        {onBackPress && (
          <View style={styles.backButtonContainer}>
            <Button
              mode="text"
              onPress={onBackPress}
              contentStyle={styles.backButtonContent}
              icon="arrow-left"
            >
              Back
            </Button>
          </View>
        )}
        <View style={styles.emptyContainer}>
          <MaterialIcons name="receipt-long" size={64} color="#ccc" />
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No Sales Found
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Sales transactions will appear here once you start making sales.
          </Text>
          {onRefresh && (
            <Button
              mode="contained"
              onPress={onRefresh}
              style={styles.refreshButton}
              loading={refreshing}
            >
              Refresh
            </Button>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Simple Back Button */}
      {onBackPress && (
        <View style={styles.backButtonContainer}>
          <Button
            mode="text"
            onPress={onBackPress}
            contentStyle={styles.backButtonContent}
            icon="arrow-left"
          >
            Back
          </Button>
        </View>
      )}

      {/* Sort Controls */}
      <View style={styles.sortContainer}>
        <Text variant="titleMedium" style={styles.sortTitle}>
          Sort by:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortButtons}
        >
          {renderSortButton('saleDate', 'Date')}
          {renderSortButton('client', 'Client')}
          {renderSortButton('totalSaleAmount', 'Amount')}
          {renderSortButton('totalSaleProfit', 'Profit')}
        </ScrollView>
      </View>

      {/* Table Rows */}
      <ScrollView
        style={styles.tableContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.tableContent}>
          {sortedData.map(renderTableRow)}
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
  sortContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sortTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    borderRadius: 20,
  },
  sortButtonContent: {
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tableContainer: {
    flex: 1,
  },
  tableContent: {
    padding: 16,
  },
  tableRow: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  rowContent: {
    paddingVertical: 16,
  },
  primaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientName: {
    marginLeft: 8,
    fontWeight: '600',
    flex: 1,
  },
  dateText: {
    color: '#666',
    marginLeft: 8,
  },
  divider: {
    marginVertical: 8,
  },
  productsRow: {
    marginBottom: 8,
  },
  productsLabel: {
    color: '#666',
    marginBottom: 6,
  },
  productsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  productChip: {
    height: 32,
    backgroundColor: '#f0f7ff',
  },
  chipText: {
    fontSize: 11,
  },
  moreItems: {
    color: '#666',
    fontStyle: 'italic',
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  amountItem: {
    alignItems: 'center',
  },
  amountLabel: {
    color: '#666',
    marginBottom: 4,
  },
  totalAmount: {
    fontWeight: '600',
    color: '#1976d2',
  },
  profitAmount: {
    fontWeight: '600',
    color: '#2e7d32',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    marginTop: 16,
  },
  backButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'flex-start',
  },
  backButtonContent: {
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
