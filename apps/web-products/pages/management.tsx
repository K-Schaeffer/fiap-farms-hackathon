import { Typography, Box, CircularProgress } from '@mui/material';
import { useProductionManagement } from '../hooks/useProductionManagement';
import { WebProductionManagement } from '@fiap-farms/web-ui';
import {
  transformProductsToUI,
  transformProductionItemsToUI,
} from '../utils/transformers';
import { useAuth } from '@fiap-farms/shared-stores';

export default function Management() {
  const { user } = useAuth();

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

  if (!user) {
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
        <Typography variant="h6" color="textSecondary">
          Please log in to manage your products.
        </Typography>
      </Box>
    );
  }

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
        <CircularProgress size={160} thickness={4} />
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
  const uiProductionItems = transformProductionItemsToUI(productionItems);

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

      <WebProductionManagement
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
