import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { WebUserByCountryChart } from '../charts/WebUserByCountryChart';
import { WebCustomizedDataGrid } from '../grids/WebCustomizedDataGrid';
import { WebPageViewsBarChart } from '../charts/WebPageViewsBarChart';
import { WebSessionsChart } from '../charts/WebSessionsChart';
import { WebStatCard, StatCardProps } from '../common/WebStatCard';

const data: StatCardProps[] = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
  },
];

export function WebMainGrid() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: {
          xs: '100%', // Full width on mobile
          sm: '100%', // Full width on small tablets
          md: '100%', // Full width on medium screens
          lg: '1400px', // Limited width on large screens
          xl: '1700px', // Maximum width on extra large screens
        },
      }}
    >
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: theme => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <WebStatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 6 }}>
          <WebSessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <WebPageViewsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <WebCustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            {/* <CustomizedTreeView /> */}
            <WebUserByCountryChart />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
