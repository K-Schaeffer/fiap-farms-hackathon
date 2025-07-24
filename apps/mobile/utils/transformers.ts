import { SalesDashboardData, Sale } from '@fiap-farms/core';
import type { MobileSaleHistoryItem } from '../components/dashboards';

// Mobile-specific interfaces that match the UI component interfaces
export interface MobileSalesDashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalRevenueLiquid: number;
  bestMonth: string;
}

export interface MobileChartTrendData {
  months: string[];
  revenue: number[];
  liquidRevenue: number[];
}

export interface MobileChartDistributionData {
  label: string;
  value: number;
  color: string;
}

// Chart colors matching mobile theme
const MOBILE_CHART_COLORS = [
  '#1976d2', // Primary blue
  '#2e7d32', // Primary green
  '#ed6c02', // Orange
  '#9c27b0', // Purple
  '#d32f2f', // Red
  '#f57c00', // Amber
  '#388e3c', // Green
  '#7b1fa2', // Deep purple
];

// Utility function to format month from YYYY-MM to readable format
function formatMonthName(monthString: string): string {
  // Handle both YYYY-MM and already formatted month strings
  if (!monthString.includes('-')) {
    return monthString; // Already formatted
  }

  const [year, month] = monthString.split('-');

  // Create a date object and use native API to get month name
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);

  // Use Intl API to get short month name (e.g., "Jan", "Feb")
  return date.toLocaleDateString('en-US', { month: 'long' });
}

export function transformSalesDashboardStats(
  data: SalesDashboardData
): MobileSalesDashboardStats {
  return {
    totalSales: data.totalSales,
    totalRevenue: data.totalRevenue,
    totalRevenueLiquid: data.totalRevenueLiquid,
    bestMonth: formatMonthName(data.bestMonth.month) || 'N/A',
  };
}

export function transformSalesTrendData(
  salesByMonth: {
    month: string;
    amount: number;
    liquidAmount: number;
    count: number;
  }[]
): MobileChartTrendData {
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
): MobileChartDistributionData[] {
  return topClients.map((client, idx) => ({
    label: client.client,
    value: Number(((client.totalAmount / totalRevenue) * 100).toFixed(2)),
    color: MOBILE_CHART_COLORS[idx % MOBILE_CHART_COLORS.length],
  }));
}

export function transformSalesHistoryToMobile(
  salesHistory: Sale[]
): MobileSaleHistoryItem[] {
  return salesHistory.map(sale => ({
    id: sale._id || `${sale.client}-${sale.saleDate.getTime()}`,
    client: sale.client,
    saleDate: sale.saleDate.toISOString(),
    items: sale.items.map(item => ({
      productName: item.productName,
      quantity: item.quantity,
    })),
    totalSaleAmount: sale.totalSaleAmount,
    totalSaleProfit: sale.totalSaleProfit,
  }));
}
