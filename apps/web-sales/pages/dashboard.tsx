import { Box, Typography, CircularProgress } from '@mui/material';
import { WebSalesDashboard } from '@fiap-farms/web-ui';
import { useSalesDashboard } from '../hooks/useSalesDashboard';
import { useAuth } from '@fiap-farms/auth-store';

export default function NewSale() {
  const { user } = useAuth();
  const { loading, error, dashboard } = useSalesDashboard();

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
          Please log in to manage your sales.
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
        Check and analyze sales data
      </Typography>

      <WebSalesDashboard
        totalSales={dashboard?.totalSales || 0}
        totalRevenue={dashboard?.totalRevenue || 0}
        totalRevenueLiquid={dashboard?.totalRevenueLiquid || 0}
        bestMonth={dashboard?.bestMonth || 'N/A'}
        salesByMonth={dashboard?.salesByMonth || []}
        topClients={dashboard?.topClients || []}
        salesHistory={dashboard?.salesHistory || []}
      />
    </Box>
  );
}
