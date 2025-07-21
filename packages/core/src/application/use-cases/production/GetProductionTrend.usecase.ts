import { IProductionRepository } from '../../../domain/repositories/IProductionRepository';

export interface ProductionTrendItem {
  year: number;
  month: number; // 1-12
  count: number;
}

export interface ProductionTrends {
  planted: ProductionTrendItem[];
  harvested: ProductionTrendItem[];
}

export class GetProductionTrendUseCase {
  constructor(private productionRepo: IProductionRepository) {}

  async execute(ownerId: string): Promise<ProductionTrends> {
    const allProductions = await this.productionRepo.findByOwner(ownerId);
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
    const planted = Object.entries(plantedMap).map(([key, count]) => {
      const [year, month] = key.split('-').map(Number);
      return { year, month, count };
    }).sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
    const harvested = Object.entries(harvestedMap).map(([key, count]) => {
      const [year, month] = key.split('-').map(Number);
      return { year, month, count };
    }).sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
    return { planted, harvested };
  }
} 