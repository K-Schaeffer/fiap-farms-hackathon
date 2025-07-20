import {
  ProductionItem,
  ProductionStatus,
} from '../entities/production.entity';

export interface IProductionRepository {
  create(item: Omit<ProductionItem, '_id'>): Promise<ProductionItem>;
  findByOwner(ownerId: string): Promise<ProductionItem[]>;
  findById(itemId: string): Promise<ProductionItem | null>;
  updateStatus(itemId: string, status: ProductionStatus): Promise<void>;
  setAsHarvested(itemId: string, yieldAmount: number): Promise<void>;
  findByProduct(productId: string): Promise<ProductionItem[]>;
  findByStatus(status: ProductionStatus): Promise<ProductionItem[]>;
}
