import { InventoryItem } from '../../../domain/entities/inventory.entity';
import { IInventoryRepository } from '../../../domain/repositories/IInventoryRepository';

export interface InventoryOverview {
  totalItems: number;
  lowStockItems: InventoryItem[];
  items: InventoryItem[];
}

export class GetInventoryOverviewUseCase {
  constructor(private inventoryRepo: IInventoryRepository) {}

  async execute(
    ownerId: string,
    lowStockThreshold: number = 10
  ): Promise<InventoryOverview> {
    const items = await this.inventoryRepo.findByOwner(ownerId);

    const lowStockItems = items.filter(
      item => item.quantity <= lowStockThreshold
    );

    return {
      totalItems: items.length,
      lowStockItems,
      items,
    };
  }
}
