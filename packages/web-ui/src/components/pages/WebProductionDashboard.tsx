import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { WebStatCard, WebStatCardProps } from '../common/WebStatCard';
import { WebProductionCardData } from '../kanban';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, useMediaQuery } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { linearProgressClasses } from '@mui/material/LinearProgress';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import {
  WebProductionStatusChip,
  WebProductionStatus,
} from '../common/WebProductionStatusChip';
import { getWebUnitColor } from '../kanban/WebAvailableProductCard';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

export interface ProductionDashboardStats {
  planted: number;
  harvested: number;
  inProduction: number;
  overdueHarvests: number;
}

export interface ChartTrendData {
  months: string[];
  planted: number[];
  harvested: number[];
}

export interface ChartDistributionData {
  label: string;
  value: number;
  color: string;
}

export interface WebProductionDashboardProps {
  productionItems: WebProductionCardData[];
  dashboardStats: ProductionDashboardStats;
  trendData: ChartTrendData;
  distributionData: ChartDistributionData[];
}

export function WebProductionDashboard({
  productionItems,
  dashboardStats,
  trendData,
  distributionData,
}: WebProductionDashboardProps) {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const productionStats: WebStatCardProps[] = [
    {
      title: 'Planted',
      value: dashboardStats.planted.toString(),
      interval: 'Current',
      trend: 'neutral',
      color: 'success',
    },
    {
      title: 'Harvested',
      value: dashboardStats.harvested.toString(),
      interval: 'Current',
      trend: 'neutral',
      color: 'info',
    },
    {
      title: 'In Production',
      value: dashboardStats.inProduction.toString(),
      interval: 'Current',
      trend: 'neutral',
      color: 'warning',
    },
    {
      title: 'Overdue',
      value: dashboardStats.overdueHarvests.toString(),
      interval: 'Current',
      trend: 'neutral',
      color: 'error',
    },
  ];

  // Chart data is now pre-transformed from the hook
  const productionTrend = trendData.planted;
  const harvestTrend = trendData.harvested;
  const months = trendData.months;
  const productionDistribution = distributionData;

  const productionColumns: GridColDef[] = [
    { field: 'productName', headerName: 'Product', flex: 1, minWidth: 120 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: params => (
        <WebProductionStatusChip status={params.value as WebProductionStatus} />
      ),
    },
    { field: 'location', headerName: 'Location', flex: 1, minWidth: 120 },
    {
      field: 'plantedDate',
      headerName: 'Planted',
      flex: 1,
      minWidth: 120,
      renderCell: params => {
        if (!params.value) return '-';
        const date = new Date(params.value);
        return date.toLocaleString('default', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      field: 'expectedHarvestDate',
      headerName: 'Expected Harvest',
      flex: 1,
      minWidth: 140,
      renderCell: params => {
        if (!params.value) return '-';
        const date = new Date(params.value);
        return date.toLocaleString('default', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      field: 'harvestedDate',
      headerName: 'Harvested Date',
      flex: 1,
      minWidth: 140,
      renderCell: params => {
        if (!params.value) return '-';
        const date = new Date(params.value);
        return date.toLocaleString('default', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      field: 'yield',
      headerName: 'Yield',
      flex: 1,
      minWidth: 80,
      renderCell: params =>
        params.value === undefined ||
        params.value === null ||
        params.value === ''
          ? '-'
          : params.value,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      minWidth: 80,
      renderCell: params => (
        <Chip
          label={params.value}
          color={getWebUnitColor(params.value)}
          size="small"
          sx={{ fontSize: '0.75rem', height: 22 }}
        />
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 0.5, sm: 2 }, // Reduce vertical padding on mobile
        px: { xs: 1.5, sm: 2, md: 2 }, // More horizontal padding on mobile for better right edge spacing
      }}
    >
      {/* Overview cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Production Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: theme => theme.spacing(2) }}
      >
        {productionStats.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <WebStatCard
              title={card.title}
              value={card.value}
              interval={card.interval}
              trend={card.trend}
              color={card.color}
            />
          </Grid>
        ))}
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Production Insights
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: theme => theme.spacing(2), alignItems: 'stretch' }}
      >
        <Grid
          size={{ xs: 12, xl: 6 }}
          sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Card
            variant="outlined"
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              height: isLargeScreen ? 360 : '100%',
              minHeight: 320,
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 auto',
                p: 0,
              }}
            >
              <Typography
                component="h2"
                variant="subtitle2"
                gutterBottom
                sx={{ px: 2, pt: 2, mb: 1 }}
              >
                Production Trends
              </Typography>
              <Typography
                variant="body2"
                sx={{ px: 2, mb: 2, color: 'text.secondary' }}
              >
                Planted vs Harvested Over Time
              </Typography>
              <BarChart
                borderRadius={8}
                colors={[
                  theme.palette.success.main, // planted
                  theme.palette.info.main, // harvested
                ]}
                xAxis={[
                  {
                    scaleType: 'band',
                    categoryGapRatio: 0.5,
                    data: months,
                    height: 24,
                  },
                ]}
                yAxis={[{ width: 50 }]}
                series={[
                  {
                    id: 'planted',
                    label: 'Planted',
                    data: productionTrend,
                    stack: 'planted',
                  },
                  {
                    id: 'harvested',
                    label: 'Harvested',
                    data: harvestTrend,
                    stack: 'harvested',
                  },
                ]}
                height={250}
                margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
                grid={{ horizontal: true }}
                hideLegend
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid
          size={{ xs: 12, xl: 6 }}
          sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Card
            variant="outlined"
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              height: isLargeScreen ? 360 : '100%',
              minHeight: 320,
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 auto',
                p: 0,
              }}
            >
              <Typography
                component="h2"
                variant="subtitle2"
                gutterBottom
                sx={{ px: 2, pt: 2, mb: 1 }}
              >
                Product Distribution
              </Typography>
              <Typography
                variant="body2"
                sx={{ px: 2, mb: 2, color: 'text.secondary' }}
              >
                Distribution by product types in production
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isLargeScreen ? 'row' : 'column',
                  alignItems: isLargeScreen ? 'center' : 'stretch',
                  width: '100%',
                  mb: 2,
                  px: 2,
                }}
              >
                <PieChart
                  series={[
                    {
                      data: productionDistribution,
                      innerRadius: 60,
                      outerRadius: isLargeScreen ? 100 : 70,
                      paddingAngle: 2,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      valueFormatter: ({ value }) => `${value}%`,
                    },
                  ]}
                  height={isLargeScreen ? 250 : 180}
                  width={isLargeScreen ? 250 : 180}
                  hideLegend
                  sx={{
                    flex: isLargeScreen ? 'none' : '0 0 auto',
                    mx: isLargeScreen ? 0 : 'auto',
                  }}
                />
                <Box
                  sx={{
                    ml: isLargeScreen ? 2 : 0,
                    mt: isLargeScreen ? 0 : 2,
                    width: '100%',
                  }}
                >
                  {productionDistribution.map(item => (
                    <Stack
                      key={item.label}
                      direction="row"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, flex: 1 }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', mr: 2 }}
                      >
                        {item.value}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={item.value}
                        sx={{
                          flex: 2,
                          height: 8,
                          borderRadius: 5,
                          [`& .${linearProgressClasses.bar}`]: {
                            backgroundColor: item.color,
                          },
                        }}
                      />
                    </Stack>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Details grid */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Production Items
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ height: 450, width: '100%' }}>
            <DataGrid
              rows={productionItems}
              columns={productionColumns}
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: { paginationModel: { pageSize: 20 } },
              }}
              density="compact"
              disableColumnResize
              autoHeight={false}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
