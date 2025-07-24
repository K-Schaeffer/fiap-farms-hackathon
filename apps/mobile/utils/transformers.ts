import {
  Sale,
  SalesDashboardData,
  ProductionItem,
  ProductionDistributionItem,
  ProductionTrends,
  InventoryItem,
  Product,
} from '@fiap-farms/core';
import {
  MobileSaleHistoryItem,
  MobileSaleProduct,
  MobileProductData,
  MobileProductionItem,
  MobileProductionItemDashboard,
} from '../components';

// Sales interfaces
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

// Production interfaces
export interface MobileProductionDashboardStats {
  totalProductions: number;
  totalPlanted: number;
  totalInProduction: number;
  totalHarvested: number;
  totalOverdue: number;
}

export interface MobileProductionChartTrendData {
  months: string[];
  planted: number[];
  harvested: number[];
}

export interface MobileProductionChartDistributionData {
  label: string;
  value: number;
  color: string;
}

// Chart colors matching web brand standards
const MOBILE_CHART_COLORS = [
  '#ab47bc',
  '#ff7043',
  '#26a69a',
  '#8d6e63',
  '#42a5f5',
  '#ffa726',
  '#66bb6a',
  '#d4e157',
];

// Utility function to format month names
export function formatMonthName(monthString: string): string {
  const [, month] = monthString.split('-');
  const date = new Date(2025, parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long' });
}

// Sales transformers
export function transformSalesDashboardStats(
  data: SalesDashboardData
): MobileSalesDashboardStats {
  return {
    totalSales: data.totalSales,
    totalRevenue: data.totalRevenue,
    totalRevenueLiquid: data.totalRevenueLiquid,
    bestMonth: formatMonthName(data.bestMonth.month),
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

// Production transformers
export function transformProductionDashboardStats(data: {
  totalProductions: number;
  plantedItems: ProductionItem[];
  inProductionItems: ProductionItem[];
  harvestedItems: ProductionItem[];
  harvestOverdue: ProductionItem[];
}): MobileProductionDashboardStats {
  return {
    totalProductions: data.totalProductions,
    totalPlanted: data.plantedItems.length,
    totalInProduction: data.inProductionItems.length,
    totalHarvested: data.harvestedItems.length,
    totalOverdue: data.harvestOverdue.length,
  };
}

export function transformProductionTrendData(
  trends: ProductionTrends
): MobileProductionChartTrendData {
  // Get all unique month-year combinations from both planted and harvested
  const allMonthYears = new Set<string>();

  trends.planted.forEach(item => {
    const monthKey = `${item.year}-${item.month.toString().padStart(2, '0')}`;
    allMonthYears.add(monthKey);
  });

  trends.harvested.forEach(item => {
    const monthKey = `${item.year}-${item.month.toString().padStart(2, '0')}`;
    allMonthYears.add(monthKey);
  });

  // Sort month-year combinations chronologically
  const sortedMonthYears = Array.from(allMonthYears).sort();

  // Create data arrays for each month
  const months = sortedMonthYears.map(monthYear => formatMonthName(monthYear));

  const planted = sortedMonthYears.map(monthYear => {
    const [year, month] = monthYear.split('-').map(Number);
    const item = trends.planted.find(p => p.year === year && p.month === month);
    return item ? item.count : 0;
  });

  const harvested = sortedMonthYears.map(monthYear => {
    const [year, month] = monthYear.split('-').map(Number);
    const item = trends.harvested.find(
      h => h.year === year && h.month === month
    );
    return item ? item.count : 0;
  });

  return {
    months,
    planted,
    harvested,
  };
}

export function transformProductionDistributionData(
  distribution: ProductionDistributionItem[]
): MobileProductionChartDistributionData[] {
  return distribution.map((item, idx) => ({
    label: item.productName,
    value: item.percentage,
    color: MOBILE_CHART_COLORS[idx % MOBILE_CHART_COLORS.length],
  }));
}

export function transformProductionItemsToMobile(
  items: ProductionItem[]
): MobileProductionItemDashboard[] {
  return items.map(item => ({
    id: item._id,
    productName: item.productName,
    status: item.status,
    plantedDate: item.plantedDate.toISOString(),
    expectedHarvestDate: item.expectedHarvestDate.toISOString(),
    harvestedDate: item.harvestedDate?.toISOString(),
    yield: item.yield,
    location: item.location,
    unit: item.productUnit,
  }));
}

// Sales transformers for mobile
export function transformInventoryItemsToMobile(
  items: InventoryItem[]
): MobileSaleProduct[] {
  return items.map(item => ({
    id: item.productId,
    name: item.productName,
    unit: item.unit,
    quantity: item.quantity,
  }));
}

// Production management transformers
export function transformProductsToMobile(
  products: Product[]
): MobileProductData[] {
  return products.map(product => ({
    id: product._id,
    name: product.name,
    description: product.description,
    unit: product.unit,
    costPerUnit: product.costPerUnit,
  }));
}

export function transformProductionItemsToMobileManagement(
  items: ProductionItem[]
): MobileProductionItem[] {
  return items.map(item => ({
    id: item._id,
    productId: item.productId,
    productName: item.productName,
    status: item.status,
    location: item.location,
    plantedDate: item.plantedDate.toISOString(),
    expectedHarvestDate: item.expectedHarvestDate.toISOString(),
    harvestedDate: item.harvestedDate?.toISOString(),
    yield: item.yield,
    unit: item.productUnit,
  }));
}
