import { Product } from '../../../domain/entities/product.entity';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

export class GetProductsUseCase {
  constructor(private productRepo: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepo.findAll();
  }

  async getById(productId: string): Promise<Product | null> {
    return this.productRepo.findById(productId);
  }
}
