import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

export interface MobileSaleHistoryItem {
  id: string;
  client: string;
  saleDate: string;
  items: { productName: string; quantity: number }[];
  totalSaleAmount: number;
  totalSaleProfit?: number;
}

export interface MobileSalesCardsProps {
  salesHistory: MobileSaleHistoryItem[];
}

export function MobileSalesCards({ salesHistory }: MobileSalesCardsProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';

      return date.toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'N/A';
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const renderSaleCard = (item: MobileSaleHistoryItem) => (
    <Card key={item.id} style={styles.saleCard} mode="outlined">
      <Card.Content style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.clientInfo}>
            <MaterialIcons name="person" size={20} color="#1976d2" />
            <Text variant="titleMedium" style={styles.clientName}>
              {item.client}
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.date}>
            {formatDate(item.saleDate)}
          </Text>
        </View>

        <View style={styles.itemsList}>
          <Text variant="bodySmall" style={styles.itemsLabel}>
            Products:
          </Text>
          <View style={styles.chipContainer}>
            {item.items.map((product, index) => (
              <Chip
                key={index}
                mode="outlined"
                compact
                style={styles.productChip}
                textStyle={styles.chipText}
              >
                {product.productName.length > 12
                  ? `${product.productName.slice(0, 12)}...`
                  : product.productName}{' '}
                ({product.quantity})
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.amounts}>
            <View style={styles.amountRow}>
              <Text variant="bodySmall" style={styles.amountLabel}>
                Total:
              </Text>
              <Text variant="titleMedium" style={styles.totalAmount}>
                {formatCurrency(item.totalSaleAmount)}
              </Text>
            </View>
            {item.totalSaleProfit !== undefined && (
              <View style={styles.amountRow}>
                <Text variant="bodySmall" style={styles.amountLabel}>
                  Profit:
                </Text>
                <Text variant="bodyMedium" style={styles.profitAmount}>
                  {formatCurrency(item.totalSaleProfit)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (salesHistory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="receipt-long" size={48} color="#ccc" />
        <Text variant="bodyLarge" style={styles.emptyText}>
          No sales history found
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          Sales will appear here once you start making transactions
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>{salesHistory.map(renderSaleCard)}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  saleCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  cardContent: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientName: {
    marginLeft: 8,
    fontWeight: '600',
    flex: 1,
  },
  date: {
    color: '#666',
    marginLeft: 8,
  },
  itemsList: {
    marginBottom: 12,
  },
  itemsLabel: {
    color: '#666',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  productChip: {
    height: 32,
    backgroundColor: '#f5f5f5',
    flexShrink: 1,
    maxWidth: '100%',
  },
  chipText: {
    fontSize: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  amounts: {
    gap: 4,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    color: '#666',
  },
  totalAmount: {
    fontWeight: '600',
    color: '#1976d2',
  },
  profitAmount: {
    color: '#2e7d32',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
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
