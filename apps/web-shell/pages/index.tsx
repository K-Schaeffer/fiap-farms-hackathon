import { Box, Typography } from '@mui/material';

export default function Root() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom color="textPrimary">
        Welcome to the FIAP Farms!
      </Typography>
      <Typography variant="body1" color="textSecondary">
        You&apos;re logged in. Use the navigation menu to explore the app.
      </Typography>
    </Box>
  );
}
