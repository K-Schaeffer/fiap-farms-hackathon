import { 
  ProductionItem, 
  ProductionStatus, 
  ProductionStatusValidator 
} from '../../../domain/entities/production.entity';
import { IProductionRepository } from '../../../domain/repositories/IProductionRepository';

export class UpdateProductionStatusUseCase {
  constructor(private productionRepo: IProductionRepository) {}

  async execute(data: {
    productionItemId: string;
    newStatus: ProductionStatus;
  }): Promise<ProductionItem> {
    const { productionItemId, newStatus } = data;

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

    // Perform the status update
    await this.productionRepo.updateStatus(productionItemId, newStatus);

    // Return the updated item
    const updatedItem = await this.productionRepo.findById(productionItemId);
    if (!updatedItem) {
      throw new Error('Failed to retrieve updated production item');
    }

    return updatedItem;
  }
}
