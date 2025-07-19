import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { WebAppNavbar, WebHeader, WebSideMenu } from '@fiap-farms/web-ui';

const SalesApp = dynamic(() => import('salesApp/Index'), {
  ssr: false,
});

export default function ShellView() {
  return (
    <Box sx={{ display: 'flex' }}>
      <WebSideMenu />
      <WebAppNavbar />
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
          <WebHeader />
          <SalesApp />
        </Stack>
      </Box>
    </Box>
  );
}
