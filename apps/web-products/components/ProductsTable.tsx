import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Product } from '@fiap-farms/core';

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  error: Error | null;
}

export function ProductsTable({
  products,
  loading,
  error,
}: ProductsTableProps) {
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <CircularProgress />
        <Typography variant="body1" style={{ marginLeft: '1rem' }}>
          Loading products...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" style={{ margin: '1rem 0' }}>
        Error loading products: {error.message}
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <Alert severity="info" style={{ margin: '1rem 0' }}>
        No products found. Add some products to see them here.
      </Alert>
    );
  }

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

  return (
    <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">Name</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Description</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Unit</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="h6">Cost per Unit</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(product => (
            <TableRow
              key={product._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Typography variant="body1" fontWeight="medium">
                  {product.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatUnit(product.unit)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  variant="body1"
                  fontWeight="medium"
                  color="success.main"
                >
                  {formatCurrency(product.costPerUnit)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ padding: '1rem' }}>
        <Typography variant="body2" color="text.secondary">
          Total: {products.length} product{products.length !== 1 ? 's' : ''}
        </Typography>
      </div>
    </TableContainer>
  );
}
