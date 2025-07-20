import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DataTable, Chip } from 'react-native-paper';

// Sample data structure matching the web version
const rows = [
  {
    id: 1,
    pageTitle: 'Homepage Overview',
    status: 'Online',
    eventCount: 8345,
    users: 212423,
    viewsPerUser: 18.5,
    averageTime: '2m 15s',
  },
  {
    id: 2,
    pageTitle: 'Product Details - Gadgets',
    status: 'Online',
    eventCount: 5653,
    users: 172240,
    viewsPerUser: 9.7,
    averageTime: '2m 30s',
  },
  {
    id: 3,
    pageTitle: 'Checkout Process - Step 1',
    status: 'Offline',
    eventCount: 3455,
    users: 58240,
    viewsPerUser: 15.2,
    averageTime: '2m 10s',
  },
  {
    id: 4,
    pageTitle: 'User Profile Dashboard',
    status: 'Online',
    eventCount: 112543,
    users: 96240,
    viewsPerUser: 4.5,
    averageTime: '2m 40s',
  },
  {
    id: 5,
    pageTitle: 'Article Listing - Tech News',
    status: 'Offline',
    eventCount: 3653,
    users: 142240,
    viewsPerUser: 3.1,
    averageTime: '2m 55s',
  },
  {
    id: 6,
    pageTitle: 'FAQs - Customer Support',
    status: 'Online',
    eventCount: 106543,
    users: 15240,
    viewsPerUser: 7.2,
    averageTime: '2m 20s',
  },
  {
    id: 7,
    pageTitle: 'Product Comparison - Laptops',
    status: 'Offline',
    eventCount: 7853,
    users: 32240,
    viewsPerUser: 6.5,
    averageTime: '2m 50s',
  },
  {
    id: 8,
    pageTitle: 'Shopping Cart - Electronics',
    status: 'Online',
    eventCount: 8563,
    users: 48240,
    viewsPerUser: 4.3,
    averageTime: '3m 10s',
  },
];

export function MobileCustomizedDataGrid() {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, rows.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const renderStatus = (status: 'Online' | 'Offline') => {
    const color = status === 'Online' ? '#4caf50' : '#f44336';
    return (
      <Chip
        mode="outlined"
        style={{ backgroundColor: `${color}20`, borderColor: color }}
        textStyle={{ color }}
      >
        {status}
      </Chip>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <DataTable style={styles.table}>
          <DataTable.Header>
            <DataTable.Title style={styles.titleColumn}>
              Page Title
            </DataTable.Title>
            <DataTable.Title style={styles.statusColumn}>
              Status
            </DataTable.Title>
            <DataTable.Title numeric style={styles.numberColumn}>
              Users
            </DataTable.Title>
            <DataTable.Title numeric style={styles.numberColumn}>
              Events
            </DataTable.Title>
            <DataTable.Title numeric style={styles.numberColumn}>
              Views/User
            </DataTable.Title>
            <DataTable.Title style={styles.timeColumn}>
              Avg Time
            </DataTable.Title>
          </DataTable.Header>

          {rows.slice(from, to).map(item => (
            <DataTable.Row key={item.id} style={styles.row}>
              <DataTable.Cell style={styles.titleColumn}>
                {item.pageTitle}
              </DataTable.Cell>
              <DataTable.Cell style={styles.statusColumn}>
                {renderStatus(item.status as 'Online' | 'Offline')}
              </DataTable.Cell>
              <DataTable.Cell numeric style={styles.numberColumn}>
                {item.users.toLocaleString()}
              </DataTable.Cell>
              <DataTable.Cell numeric style={styles.numberColumn}>
                {item.eventCount.toLocaleString()}
              </DataTable.Cell>
              <DataTable.Cell numeric style={styles.numberColumn}>
                {item.viewsPerUser}
              </DataTable.Cell>
              <DataTable.Cell style={styles.timeColumn}>
                {item.averageTime}
              </DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(rows.length / itemsPerPage)}
            onPageChange={page => setPage(page)}
            label={`${from + 1}-${to} of ${rows.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
          />
        </DataTable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  table: {
    minWidth: 800, // Ensure horizontal scrolling works
  },
  row: {
    minHeight: 48,
  },
  titleColumn: {
    flex: 2,
    minWidth: 200,
  },
  statusColumn: {
    flex: 1,
    minWidth: 100,
  },
  numberColumn: {
    flex: 1,
    minWidth: 80,
  },
  timeColumn: {
    flex: 1,
    minWidth: 80,
  },
});
