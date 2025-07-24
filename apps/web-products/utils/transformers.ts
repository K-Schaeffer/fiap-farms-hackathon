import {
  Product,
  ProductionItem,
  ProductionDistributionItem,
  ProductionTrendItem,
} from '@fiap-farms/core';
import { WebProductData, WebProductionCardData } from '@fiap-farms/web-ui';

export function transformProductToUI(product: Product): WebProductData {
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    unit: product.unit,
    costPerUnit: product.costPerUnit,
  };
}

export function transformProductsToUI(products: Product[]): WebProductData[] {
  return products.map(transformProductToUI);
}

export function transformProductionItemToUI(
  item: ProductionItem
): WebProductionCardData {
  return {
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
  };
}

export function transformProductionItemsToUI(
  items: ProductionItem[]
): WebProductionCardData[] {
  return items.map(item => transformProductionItemToUI(item));
}

// New dashboard-specific transformers
export interface ProductionDashboardStats {
  planted: number;
  harvested: number;
  inProduction: number;
  overdueHarvests: number;
}

export interface ChartTrendData {
  planted: number[];
  harvested: number[];
  months: string[];
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

// Utility function to format month names using native API
function formatMonthName(monthString: string): string {
  const [, month] = monthString.split('-');
  const date = new Date(2025, parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long' });
}

export function transformProductionDashboardStats(
  productionItems: ProductionItem[]
): ProductionDashboardStats {
  const currentYear = new Date().getFullYear();
  const now = new Date();

  const planted = productionItems.filter(
    item =>
      item.status === 'planted' &&
      item.plantedDate.getFullYear() === currentYear
  ).length;

  const harvested = productionItems.filter(
    item =>
      item.status === 'harvested' &&
      item.expectedHarvestDate.getFullYear() === currentYear
  ).length;

  const inProduction = productionItems.filter(
    item => item.status === 'in_production'
  ).length;

  const overdueHarvests = productionItems.filter(
    item => item.status !== 'harvested' && item.expectedHarvestDate <= now
  ).length;

  return {
    planted,
    harvested,
    inProduction,
    overdueHarvests,
  };
}

export function transformProductionTrendData(
  plantedTrend: ProductionTrendItem[],
  harvestedTrend: ProductionTrendItem[]
): ChartTrendData {
  // Get all unique month-year combinations from both trends
  const allMonthYears = new Set<string>();

  plantedTrend.forEach(item => {
    const monthKey = `${item.year}-${item.month.toString().padStart(2, '0')}`;
    allMonthYears.add(monthKey);
  });

  harvestedTrend.forEach(item => {
    const monthKey = `${item.year}-${item.month.toString().padStart(2, '0')}`;
    allMonthYears.add(monthKey);
  });

  // Sort month-year combinations chronologically
  const sortedMonthYears = Array.from(allMonthYears).sort();

  // Create data arrays for each month
  const months = sortedMonthYears.map(monthYear => formatMonthName(monthYear));

  const planted = sortedMonthYears.map(monthYear => {
    const [year, month] = monthYear.split('-').map(Number);
    const item = plantedTrend.find(p => p.year === year && p.month === month);
    return item ? item.count : 0;
  });

  const harvested = sortedMonthYears.map(monthYear => {
    const [year, month] = monthYear.split('-').map(Number);
    const item = harvestedTrend.find(h => h.year === year && h.month === month);
    return item ? item.count : 0;
  });

  return {
    planted,
    harvested,
    months,
  };
}

export function transformProductionDistributionData(
  distribution: ProductionDistributionItem[]
): ChartDistributionData[] {
  return distribution.map((item, idx) => ({
    label: item.productName,
    value: item.percentage,
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));
}
