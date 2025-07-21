import { Typography, Box, CircularProgress } from '@mui/material';
import { useProductionManagement } from '../hooks/useProductionManagement';
import { ProductionManagementPage } from '@fiap-farms/web-ui';
import {
  transformProductsToUI,
  transformProductionItemsToUI,
} from '../utils/transformers';

export default function Dashboard() {
  const {
    products,
    productionItems,
    loading,
    error,
    startProductionWithForm,
    updateStatus,
    harvestItemWithForm,
    reorderItems,
  } = useProductionManagement();

  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <CircularProgress size={100} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Error: {typeof error === 'string' ? error : 'An error occurred'}
        </Typography>
      </Box>
    );
  }

  // Transform data for UI components
  const uiProducts = transformProductsToUI(products);
  const uiProductionItems = transformProductionItemsToUI(
    productionItems,
    products
  );

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Typography
        variant="h5"
        color="text.secondary"
        gutterBottom
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
          textAlign: { xs: 'center', sm: 'left' },
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        Manage your farm products catalog and production lifecycle
      </Typography>

      <ProductionManagementPage
        products={uiProducts}
        productionItems={uiProductionItems}
        onStartProductionWithForm={startProductionWithForm}
        onUpdateStatus={updateStatus}
        onHarvestItemWithForm={harvestItemWithForm}
        onReorderItems={reorderItems}
      />
    </Box>
  );
}
