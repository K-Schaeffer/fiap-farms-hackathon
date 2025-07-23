import dynamic from 'next/dynamic';
import { CircularProgress, Box } from '@mui/material';

const SalesAppDashboard = dynamic(() => import('salesApp/Dashboard'), {
  loading: () => {
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
    ) as JSX.Element;
  },
});

export default function SalesDashboardPage() {
  return <SalesAppDashboard />;
}
