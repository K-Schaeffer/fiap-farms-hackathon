import { Box, Typography } from '@mui/material';
import { useAuth } from '@fiap-farms/shared-stores';
import { WebProductionDashboard } from '@fiap-farms/web-ui';
import { CircularProgress } from '@mui/material';
import { useProductionDashboard } from '../hooks/useProductionDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    productionItems,
    loading,
    error,
    dashboardStats,
    trendData,
    distributionData,
  } = useProductionDashboard();

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
        Check and analyze your production data
      </Typography>

      <WebProductionDashboard
        productionItems={productionItems}
        dashboardStats={dashboardStats}
        trendData={trendData}
        distributionData={distributionData}
      />
    </Box>
  );
}
