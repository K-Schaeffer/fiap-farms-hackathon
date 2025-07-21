import { Product, ProductionItem } from '@fiap-farms/core';
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
