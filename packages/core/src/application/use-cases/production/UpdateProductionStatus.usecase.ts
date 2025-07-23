import {
  ProductionItem,
  ProductionStatus,
  ProductionStatusValidator,
} from '../../../domain/entities/production.entity';
import { IProductionRepository } from '../../../domain/repositories/IProductionRepository';

export class UpdateProductionStatusUseCase {
  constructor(private productionRepo: IProductionRepository) {}

  async execute(data: {
    productionItemId: string;
    newStatus: ProductionStatus;
    yieldAmount?: number; // Optional: required when newStatus is 'harvested'
  }): Promise<ProductionItem> {
    const { productionItemId, newStatus, yieldAmount } = data;

    // Fetch the current production item
    const productionItem = await this.productionRepo.findById(productionItemId);

    if (!productionItem) {
      throw new Error('Production item not found');
    }

    // Delegate business rule validation to domain layer
    ProductionStatusValidator.validateStatusTransition(
      productionItem.status,
      newStatus
    );

    // Additional validation for harvesting
    if (newStatus === 'harvested' && yieldAmount === undefined) {
      throw new Error(
        'Yield amount is required when harvesting production items'
      );
    }

    // Perform the appropriate update based on the status and data provided
    if (newStatus === 'harvested' && yieldAmount !== undefined) {
      // Use specific harvesting method when yield is provided
      await this.productionRepo.setAsHarvested(productionItemId, yieldAmount);
    } else {
      // Use generic status update for other transitions
      await this.productionRepo.updateStatus(productionItemId, newStatus);
    }

    // Return the updated item
    const updatedItem = await this.productionRepo.findById(productionItemId);
    if (!updatedItem) {
      throw new Error('Failed to retrieve updated production item');
    }

    return updatedItem;
  }
}
