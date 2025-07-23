import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { WebStatCard, WebStatCardProps } from '../common/WebStatCard';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, useMediaQuery } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { linearProgressClasses } from '@mui/material/LinearProgress';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export interface WebSalesDashboardProps {
  totalSales: number;
  totalRevenue: number;
  totalRevenueLiquid: number;
  bestMonth: string;
  salesByMonth: { month: string; amount: number; count: number }[];
  topClients: { client: string; totalAmount: number; salesCount: number }[];
  salesHistory: { client: string; saleDate: string; totalSaleAmount: number }[];
}

export function WebSalesDashboard({
  totalSales,
  totalRevenue,
  totalRevenueLiquid,
  bestMonth,
  salesByMonth,
  topClients,
  salesHistory,
}: WebSalesDashboardProps) {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const salesStats: WebStatCardProps[] = [
    {
      title: 'Sales',
      value: totalSales.toString(),
      interval: 'This Year',
      trend: 'neutral',
      color: 'info',
    },
    {
      title: 'Revenue',
      value: totalRevenue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
      interval: 'This Year',
      trend: 'neutral',
      color: 'success',
    },
    {
      title: 'Liquid Revenue',
      value: totalRevenueLiquid.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
      interval: 'This Year',
      trend: 'neutral',
      color: 'success',
    },
    {
      title: 'Best Month',
      value: bestMonth,
      interval: 'This Year',
      trend: 'neutral',
      color: 'default',
    },
  ];

  // Map trend data to months (assume current year)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const trendByMonth = Array(12).fill(0);

  salesByMonth.forEach(item => {
    const monthIndex = months.indexOf(item.month);
    if (monthIndex !== -1) {
      trendByMonth[monthIndex] = item.count;
    }
  });

  // Map distribution data to chart format and assign random colors
  const chartColors = [
    '#ab47bc',
    '#ff7043',
    '#26a69a',
    '#8d6e63',
    '#42a5f5',
    '#ffa726',
    '#66bb6a',
    '#d4e157',
  ];

  const salesDistribution = topClients.map((client, idx) => ({
    label: client.client,
    value: Number(((client.totalAmount / totalRevenue) * 100).toFixed(2)),
    color: chartColors[idx % chartColors.length],
  }));

  const salesColumns: GridColDef[] = [
    { field: 'client', headerName: 'Client', flex: 1, minWidth: 120 },
    {
      field: 'saleDate',
      headerName: 'Sale Date',
      flex: 1,
      minWidth: 150,
      renderCell: params => {
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
      field: 'items',
      headerName: 'Items',
      flex: 1,
      minWidth: 150,
      renderCell: params => {
        return params.value
          .map((item: { productName: string }) => item.productName)
          .join(', ');
      },
    },
    {
      field: 'totalSaleAmount',
      headerName: 'Total Amount',
      flex: 1,
      minWidth: 120,
      renderCell: params =>
        params.value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
    },
    {
      field: 'totalSaleProfit',
      headerName: 'Total Profit',
      flex: 1,
      minWidth: 120,
      renderCell: params =>
        params.value
          ? params.value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })
          : '-',
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
        Sales Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: theme => theme.spacing(2) }}
      >
        {salesStats.map((card, index) => (
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
        Sales Insights
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
                sx={{ px: 2, pt: 2, mb: 2 }}
              >
                Revenue Trend
              </Typography>
              <LineChart
                xAxis={[
                  {
                    scaleType: 'point',
                    data: salesByMonth.map(item => item.month),
                    height: 24,
                  },
                ]}
                yAxis={[{ width: 50 }]}
                series={[
                  {
                    id: 'revenue',
                    label: 'Revenue',
                    data: salesByMonth.map(item => item.amount ?? 0),
                    color: theme.palette.success.main,
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
                sx={{ px: 2, pt: 2, mb: 2 }}
              >
                Best Clients
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
                      data: salesDistribution,
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
                  {salesDistribution.map(item => (
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
        Sales History
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ height: 450, width: '100%' }}>
            <DataGrid
              rows={salesHistory}
              columns={salesColumns}
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: { paginationModel: { pageSize: 20 } },
              }}
              getRowId={row => `${row.client}-${row.saleDate}`}
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
