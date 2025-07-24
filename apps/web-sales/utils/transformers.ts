import { InventoryItem, SalesDashboardData } from '@fiap-farms/core';
import { WebSaleProduct } from '@fiap-farms/web-ui';

// Local interface for dashboard props (matches WebSalesDashboardProps from web-ui)
interface WebSalesDashboardProps {
  totalSales: number;
  totalRevenue: number;
  totalRevenueLiquid: number;
  bestMonth: string;
  salesByMonth: { month: string; amount: number; count: number }[];
  topClients: { client: string; totalAmount: number; salesCount: number }[];
  salesHistory: { client: string; saleDate: string; totalSaleAmount: number }[];
}

export function transformInventoryItemToUI(
  inventory: InventoryItem
): WebSaleProduct {
  return {
    id: inventory.productId,
    name: inventory.productName,
    unit: inventory.unit,
    quantity: inventory.quantity,
  };
}

export function transformInventoryItemsToUI(
  items: InventoryItem[]
): WebSaleProduct[] {
  return items.map(transformInventoryItemToUI);
}

export function transformSalesDashboardToUI(
  data: SalesDashboardData
): WebSalesDashboardProps {
  return {
    totalSales: data.totalSales,
    totalRevenue: data.totalRevenue,
    totalRevenueLiquid: data.totalRevenueLiquid,
    bestMonth: data.bestMonth.month,
    salesByMonth: data.salesByMonth.map(month => ({
      month: month.month,
      amount: month.amount,
      count: month.count,
    })),
    topClients: data.topClients.map(client => ({
      client: client.client,
      totalAmount: client.totalAmount,
      salesCount: client.salesCount,
    })),
    salesHistory: data.salesHistory.map(sale => ({
      client: sale.client,
      saleDate: sale.saleDate.toISOString(),
      totalSaleAmount: sale.totalSaleAmount,
      totalSaleProfit: sale.totalSaleProfit,
      items: sale.items.map(item => ({
        productName: item.productName,
      })),
    })),
  };
}

// New dashboard-specific transformers
export interface SalesDashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalRevenueLiquid: number;
  bestMonth: string;
}

export interface ChartTrendData {
  months: string[];
  revenue: number[];
  liquidRevenue: number[];
}

export interface ChartDistributionData {
  label: string;
  value: number;
  color: string;
}

const CHART_COLORS = [
  '#ab47bc',
  '#ff7043',
  '#26a69a',
  '#8d6e63',
  '#42a5f5',
  '#ffa726',
  '#66bb6a',
  '#d4e157',
];

export function transformSalesDashboardStats(
  data: SalesDashboardData
): SalesDashboardStats {
  return {
    totalSales: data.totalSales,
    totalRevenue: data.totalRevenue,
    totalRevenueLiquid: data.totalRevenueLiquid,
    bestMonth: formatMonthName(data.bestMonth.month),
  };
}

// Utility function to format month from YYYY-MM to readable format
function formatMonthName(monthString: string): string {
  // Handle both YYYY-MM and already formatted month strings
  if (!monthString.includes('-')) {
    return monthString; // Already formatted
  }

  const [year, month] = monthString.split('-');

  // Create a date object and use native API to get month name
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);

  // Use Intl API to get long month name (e.g., "January", "February")
  return date.toLocaleDateString('en-US', { month: 'long' });
}

export function transformSalesTrendData(
  salesByMonth: {
    month: string;
    amount: number;
    liquidAmount: number;
    count: number;
  }[]
): ChartTrendData {
  // Use direct data mapping instead of filling array with 0s
  // This preserves the actual months that have data
  return {
    months: salesByMonth.map(item => formatMonthName(item.month)),
    revenue: salesByMonth.map(item => item.amount ?? 0),
    liquidRevenue: salesByMonth.map(item => item.liquidAmount ?? 0),
  };
}

export function transformSalesDistributionData(
  topClients: {
    client: string;
    totalAmount: number;
    salesCount: number;
  }[],
  totalRevenue: number
): ChartDistributionData[] {
  return topClients.map((client, idx) => ({
    label: client.client,
    value: Number(((client.totalAmount / totalRevenue) * 100).toFixed(2)),
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));
}
