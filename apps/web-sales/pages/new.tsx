import { Box, Typography } from '@mui/material';

export default function NewSale() {
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
        Sales WIP
      </Typography>
    </Box>
  );
}
