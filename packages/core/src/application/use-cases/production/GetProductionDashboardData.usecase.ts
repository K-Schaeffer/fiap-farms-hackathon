import { IProductionRepository } from '../../../domain/repositories/IProductionRepository';
import { ProductionItem } from '../../../domain/entities/production.entity';

export interface ProductionDistributionItem {
  productName: string;
  percentage: number;
}

export interface ProductionTrendItem {
  year: number;
  month: number; // 1-12
  count: number;
}

export interface ProductionTrends {
  planted: ProductionTrendItem[];
  harvested: ProductionTrendItem[];
}

export interface ProductionDashboardData {
  distribution: ProductionDistributionItem[];
  trends: ProductionTrends;
}

export class GetProductionDashboardDataUseCase {
  constructor(private productionRepo: IProductionRepository) {}

  async execute(ownerId: string): Promise<ProductionDashboardData> {
    // Single database call - get all production items once
    const allProductions = await this.productionRepo.findByOwner(ownerId);

    // Calculate distribution
    const distribution = this.calculateDistribution(allProductions);

    // Calculate trends
    const trends = this.calculateTrends(allProductions);

    return {
      distribution,
      trends,
    };
  }

  private calculateDistribution(
    allProductions: ProductionItem[]
  ): ProductionDistributionItem[] {
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

  private calculateTrends(allProductions: ProductionItem[]): ProductionTrends {
    const plantedMap: Record<string, number> = {};
    const harvestedMap: Record<string, number> = {};

    for (const item of allProductions) {
      // Planted trend
      if (item.plantedDate) {
        const date = new Date(item.plantedDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const key = `${year}-${month}`;
        plantedMap[key] = (plantedMap[key] || 0) + 1;
      }

      // Harvested trend
      if (item.status === 'harvested' && item.harvestedDate) {
        const date = new Date(item.harvestedDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const key = `${year}-${month}`;
        harvestedMap[key] = (harvestedMap[key] || 0) + 1;
      }
    }

    const planted = Object.entries(plantedMap)
      .map(([key, count]) => {
        const [year, month] = key.split('-').map(Number);
        return { year, month, count };
      })
      .sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.month - b.month
      );

    const harvested = Object.entries(harvestedMap)
      .map(([key, count]) => {
        const [year, month] = key.split('-').map(Number);
        return { year, month, count };
      })
      .sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.month - b.month
      );

    return { planted, harvested };
  }
}
