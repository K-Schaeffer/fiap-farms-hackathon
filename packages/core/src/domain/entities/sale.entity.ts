export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  totalProfit?: number;
}

export interface Sale {
  _id: string;
  ownerId: string;
  saleDate: Date;
  items: SaleItem[];
  totalSaleAmount: number;
  totalSaleProfit?: number;
  client: string;
}
