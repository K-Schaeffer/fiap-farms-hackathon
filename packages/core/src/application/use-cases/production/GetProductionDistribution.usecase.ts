import { IProductionRepository } from '../../../domain/repositories/IProductionRepository';

export interface ProductionDistributionItem {
  productName: string;
  percentage: number;
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
    const total = Object.values(distributionMap).reduce(
      (sum, val) => sum + val,
      0
    );
    return Object.entries(distributionMap)
      .map(([productName, count]) => ({
        productName,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }
}
