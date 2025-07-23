import { InventoryItem, SalesDashboardData } from '@fiap-farms/core';
import { WebSaleProduct, WebSalesDashboardProps } from '@fiap-farms/web-ui';

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
