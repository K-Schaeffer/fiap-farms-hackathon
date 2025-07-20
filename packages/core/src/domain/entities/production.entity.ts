export type ProductionStatus = 'planted' | 'in_production' | 'harvested';

export interface ProductionItem {
  _id: string;
  productId: string;
  ownerId: string;
  status: ProductionStatus;
  plantedDate: Date;
  expectedHarvestDate: Date;
  harvestedDate?: Date;
  yield?: number;
  location: string;
  updatedAt: Date;
}
