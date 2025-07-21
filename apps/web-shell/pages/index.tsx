import { Box, Paper, Typography } from '@mui/material';
import { useAuth } from '@fiap-farms/auth-store';

export default function Web() {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom color="info">
        Hi, {user?.displayName}
      </Typography>
      <Typography variant="h6" color="textPrimary" gutterBottom>
        Welcome to the FIAP Farms!
      </Typography>
      <Typography variant="body1" color="textSecondary">
        You&apos;re logged in. Use the navigation menu to explore the app.
      </Typography>
    </Box>
  );
}
