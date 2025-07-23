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

const MONTHS = [
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
  const currentYear = new Date().getFullYear();

  const plantedByMonth = Array(12).fill(0);
  const harvestedByMonth = Array(12).fill(0);

  plantedTrend.forEach(item => {
    if (item.year === currentYear && item.month >= 1 && item.month <= 12) {
      plantedByMonth[item.month - 1] = item.count;
    }
  });

  harvestedTrend.forEach(item => {
    if (item.year === currentYear && item.month >= 1 && item.month <= 12) {
      harvestedByMonth[item.month - 1] = item.count;
    }
  });

  return {
    planted: plantedByMonth,
    harvested: harvestedByMonth,
    months: MONTHS,
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
