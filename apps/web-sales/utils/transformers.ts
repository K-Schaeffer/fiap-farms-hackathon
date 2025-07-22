import { InventoryItem } from '@fiap-farms/core';
import { WebSaleProduct } from '@fiap-farms/web-ui';

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
