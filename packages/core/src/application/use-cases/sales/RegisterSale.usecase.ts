import { Sale, SaleItem } from '../../../domain/entities/sale.entity';
import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';
import { IInventoryRepository } from '../../../domain/repositories/IInventoryRepository';

export class RegisterSaleUseCase {
  constructor(
    private saleRepo: ISaleRepository,
    private inventoryRepo: IInventoryRepository
  ) {}

  async execute(data: {
    ownerId: string;
    items: SaleItem[];
    client: string;
    saleDate?: Date;
  }): Promise<Sale> {
    // Validate inventory availability (read-only check)
    for (const item of data.items) {
      const inventoryItem = await this.inventoryRepo.findByOwnerAndProduct(
        data.ownerId,
        item.productId
      );

      if (!inventoryItem || inventoryItem.quantity < item.quantity) {
        throw new Error(
          `Insufficient inventory for product ${item.productName}. Available: ${inventoryItem?.quantity || 0}, Required: ${item.quantity}`
        );
      }
    }

    // Calculate total sale amount
    const totalSaleAmount = data.items.reduce(
      (total, item) => total + item.quantity * item.pricePerUnit,
      0
    );

    // Create sale
    const saleData: Omit<Sale, '_id' | 'totalSaleProfit'> = {
      ownerId: data.ownerId,
      saleDate: data.saleDate || new Date(),
      items: data.items,
      totalSaleAmount,
      client: data.client,
    };

    const sale = await this.saleRepo.create(saleData);

    return sale;
  }
}
