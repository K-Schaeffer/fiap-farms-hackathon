import { Product } from '../entities/product.entity';

export interface IProductRepository {
  findById(productId: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
}
