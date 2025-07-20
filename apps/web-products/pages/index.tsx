import { Typography, Container, Box } from '@mui/material';
import { useProducts } from '../hooks/useProducts';
import { ProductsTable } from '../components/ProductsTable';

export default function Dashboard() {
  const { products, loading, error } = useProducts();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h1" gutterBottom>
          Web Products
        </Typography>

        <Typography variant="h5" color="text.secondary" gutterBottom>
          Manage your farm products catalog
        </Typography>

        <ProductsTable products={products} loading={loading} error={error} />
      </Box>
    </Container>
  );
}
