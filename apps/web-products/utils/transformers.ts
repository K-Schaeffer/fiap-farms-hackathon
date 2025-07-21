import { Product, ProductionItem } from '@fiap-farms/core';
import { ProductData, ProductionCardData } from '@fiap-farms/web-ui';

export function transformProductToUI(product: Product): ProductData {
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    unit: product.unit,
    costPerUnit: product.costPerUnit,
  };
}

export function transformProductionItemToUI(
  item: ProductionItem,
  products: Product[]
): ProductionCardData {
  const product = products.find(p => p._id === item.productId);
  return {
    id: item._id,
    productId: item.productId,
    productName: product?.name || 'Unknown Product',
    status: item.status,
    location: item.location,
    plantedDate: item.plantedDate.toISOString(),
    expectedHarvestDate: item.expectedHarvestDate.toISOString(),
    harvestedDate: item.harvestedDate?.toISOString(),
    yield: item.yield,
  };
}

export function transformProductsToUI(products: Product[]): ProductData[] {
  return products.map(transformProductToUI);
}

export function transformProductionItemsToUI(
  items: ProductionItem[],
  products: Product[]
): ProductionCardData[] {
  return items.map(item => transformProductionItemToUI(item, products));
}
