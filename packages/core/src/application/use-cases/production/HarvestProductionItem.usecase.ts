import { ProductionStatusValidator } from '../../../domain/entities/production.entity';
import { IProductionRepository } from '../../../domain/repositories/IProductionRepository';

export class HarvestProductionItemUseCase {
  constructor(private productionRepo: IProductionRepository) {}

  async execute(data: {
    productionItemId: string;
    yieldAmount: number;
  }): Promise<void> {
    const productionItem = await this.productionRepo.findById(
      data.productionItemId
    );

    if (!productionItem) {
      throw new Error('Production item not found');
    }

    // Use domain validation to ensure proper status transition
    ProductionStatusValidator.validateStatusTransition(
      productionItem.status,
      'harvested'
    );

    // Update production item as harvested
    await this.productionRepo.setAsHarvested(
      data.productionItemId,
      data.yieldAmount
    );
  }
}
