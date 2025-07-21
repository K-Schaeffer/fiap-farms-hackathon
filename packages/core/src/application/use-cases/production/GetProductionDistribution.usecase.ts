import { IProductionRepository } from '../../../domain/repositories/IProductionRepository';

export interface ProductionDistributionItem {
  productName: string;
  count: number;
}

export class GetProductionDistributionUseCase {
  constructor(private productionRepo: IProductionRepository) {}

  async execute(ownerId: string): Promise<ProductionDistributionItem[]> {
    const allProductions = await this.productionRepo.findByOwner(ownerId);
    const distributionMap: Record<string, number> = {};
    for (const item of allProductions) {
      if (!item.productName) continue;
      distributionMap[item.productName] =
        (distributionMap[item.productName] || 0) + 1;
    }
    return Object.entries(distributionMap).map(([productName, count]) => ({
      productName,
      count,
    }));
  }
}
