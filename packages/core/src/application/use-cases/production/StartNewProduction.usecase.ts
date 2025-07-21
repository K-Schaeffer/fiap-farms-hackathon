import { ProductionItem } from '../../../domain/entities/production.entity';
import { IProductionRepository } from '../../../domain/repositories/IProductionRepository';

export class StartNewProductionUseCase {
  constructor(private productionRepo: IProductionRepository) {}

  async execute(data: {
    productId: string;
    productName: string;
    productUnit: 'kg' | 'unity' | 'box';
    ownerId: string;
    location: string;
    expectedHarvestDate: Date;
  }): Promise<ProductionItem> {
    const newProductionItem: Omit<ProductionItem, '_id'> = {
      ...data,
      status: 'planted',
      plantedDate: new Date(),
      updatedAt: new Date(),
    };

    return this.productionRepo.create(newProductionItem);
  }
}
