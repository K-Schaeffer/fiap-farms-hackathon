import { Sale } from '../entities/sale.entity';

export interface ISaleRepository {
  create(sale: Omit<Sale, '_id' | 'totalSaleProfit'>): Promise<Sale>;
  findByOwner(ownerId: string, limit?: number): Promise<Sale[]>;
  findById(saleId: string): Promise<Sale | null>;
  findByDateRange(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Sale[]>;
  findByClient(ownerId: string, client: string): Promise<Sale[]>;
  getTotalSalesAmount(
    ownerId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number>;
}
