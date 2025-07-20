import { ProductionItem } from '../../../domain/entities/production.entity';
import { IProductionRepository } from '../../../domain/repositories/IProductionRepository';

export class GetProductionOverviewUseCase {
  constructor(private productionRepo: IProductionRepository) {}

  async execute(ownerId: string): Promise<{
    totalProductions: number;
    plantedItems: ProductionItem[];
    inProductionItems: ProductionItem[];
    harvestedItems: ProductionItem[];
    readyToHarvest: ProductionItem[];
  }> {
    const allProductions = await this.productionRepo.findByOwner(ownerId);

    const plantedItems = allProductions.filter(
      item => item.status === 'planted'
    );
    const inProductionItems = allProductions.filter(
      item => item.status === 'in_production'
    );
    const harvestedItems = allProductions.filter(
      item => item.status === 'harvested'
    );

    // Items that are past their expected harvest date but not yet harvested
    const now = new Date();
    const readyToHarvest = allProductions.filter(
      item => item.status !== 'harvested' && item.expectedHarvestDate <= now
    );

    return {
      totalProductions: allProductions.length,
      plantedItems,
      inProductionItems,
      harvestedItems,
      readyToHarvest,
    };
  }
}
