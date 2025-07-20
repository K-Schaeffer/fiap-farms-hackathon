import { InventoryItem } from '../entities/inventory.entity';

export interface IInventoryRepository {
  findByOwner(ownerId: string): Promise<InventoryItem[]>;
  findByProduct(productId: string): Promise<InventoryItem[]>;
  findByOwnerAndProduct(
    ownerId: string,
    productId: string
  ): Promise<InventoryItem | null>;
}
