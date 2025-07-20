import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  DataTable,
  Card,
  Text,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { Product } from '@fiap-farms/core';

interface MobileProductsTableProps {
  products: Product[];
  loading: boolean;
  error: Error | null;
}

export function MobileProductsTable({
  products,
  loading,
  error,
}: MobileProductsTableProps) {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, products.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatUnit = (unit: string) => {
    const unitMap = {
      kg: 'Quilograma',
      unity: 'Unidade',
      box: 'Caixa',
    };
    return unitMap[unit as keyof typeof unitMap] || unit;
  };

  const renderUnit = (unit: string) => {
    const color =
      unit === 'kg' ? '#2196f3' : unit === 'unity' ? '#4caf50' : '#ff9800';
    return (
      <Chip
        mode="outlined"
        style={{ backgroundColor: `${color}20`, borderColor: color }}
        textStyle={{ color }}
        compact
      >
        {formatUnit(unit)}
      </Chip>
    );
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </Card.Content>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error loading products: {error.message}
          </Text>
        </Card.Content>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No products found. Add some products to see them here.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          Products
        </Text>
        <ScrollView horizontal>
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title style={styles.nameColumn}>
                <Text variant="labelLarge">Name</Text>
              </DataTable.Title>
              <DataTable.Title style={styles.descriptionColumn}>
                <Text variant="labelLarge">Description</Text>
              </DataTable.Title>
              <DataTable.Title style={styles.unitColumn}>
                <Text variant="labelLarge">Unit</Text>
              </DataTable.Title>
              <DataTable.Title style={styles.priceColumn} numeric>
                <Text variant="labelLarge">Cost per Unit</Text>
              </DataTable.Title>
            </DataTable.Header>

            {products.slice(from, to).map(product => (
              <DataTable.Row key={product._id} style={styles.row}>
                <DataTable.Cell style={styles.nameColumn}>
                  <Text variant="bodyMedium" style={styles.productName}>
                    {product.name}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.descriptionColumn}>
                  <Text variant="bodySmall" style={styles.description}>
                    {product.description}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.unitColumn}>
                  {renderUnit(product.unit)}
                </DataTable.Cell>
                <DataTable.Cell style={styles.priceColumn} numeric>
                  <Text variant="bodyMedium" style={styles.price}>
                    {formatCurrency(product.costPerUnit)}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(products.length / itemsPerPage)}
              onPageChange={page => setPage(page)}
              label={`${from + 1}-${to} of ${products.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel="Rows per page"
            />
          </DataTable>
        </ScrollView>

        <View style={styles.summary}>
          <Text variant="bodySmall" style={styles.summaryText}>
            Total: {products.length} product{products.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: '600',
  },
  table: {
    minWidth: 700, // Ensure horizontal scrolling works
  },
  row: {
    minHeight: 60,
  },
  nameColumn: {
    flex: 2,
    minWidth: 150,
  },
  descriptionColumn: {
    flex: 3,
    minWidth: 200,
  },
  unitColumn: {
    flex: 1,
    minWidth: 120,
  },
  priceColumn: {
    flex: 1,
    minWidth: 120,
  },
  productName: {
    fontWeight: '600',
  },
  description: {
    color: '#666',
  },
  price: {
    fontWeight: '600',
    color: '#2e7d32',
  },
  summary: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryText: {
    color: '#666',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
});
