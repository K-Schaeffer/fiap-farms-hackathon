export interface InventoryItem {
  _id: string;
  ownerId: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: 'kg' | 'unity' | 'box';
  updatedAt: Date;
}
