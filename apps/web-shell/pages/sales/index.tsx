import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AppNavbar } from '@fiap-farms/web-ui';
import { Header } from '@fiap-farms/web-ui';
import { SideMenu } from '@fiap-farms/web-ui';

const SalesApp = dynamic(() => import('salesApp/Index'), {
  ssr: false,
});

export default function ShellView() {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      <AppNavbar />
      <Box component="main">
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header />
          <SalesApp />
        </Stack>
      </Box>
    </Box>
  );
}
