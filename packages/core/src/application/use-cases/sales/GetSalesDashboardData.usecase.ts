import { Sale } from '../../../domain/entities/sale.entity';
import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';

export interface SalesDashboardData {
  totalSales: number;
  totalRevenue: number;
  totalRevenueLiquid: number;
  bestMonth: { month: string; amount: number; count: number };
  salesHistory: Sale[];
  salesByMonth: { month: string; amount: number; count: number }[];
  topClients: { client: string; totalAmount: number; salesCount: number }[];
}

export class GetSalesDashboardDataUseCase {
  constructor(private saleRepo: ISaleRepository) {}

  async execute(
    ownerId: string,
    months: number = 12
  ): Promise<SalesDashboardData> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Get sales for the specified period
    const sales = await this.saleRepo.findByDateRange(
      ownerId,
      startDate,
      endDate
    );

    // Calculate totals
    const totalSales = sales.length;
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.totalSaleAmount,
      0
    );
    const totalRevenueLiquid = sales.reduce(
      (sum, sale) => sum + (sale.totalSaleProfit || 0),
      0
    );

    // Get recent sales (last 10)
    const salesHistory = sales
      .sort((a, b) => b.saleDate.getTime() - a.saleDate.getTime())

    // Group sales by month
    const salesByMonth = this.groupSalesByMonth(sales);

    const bestMonth = salesByMonth.reduce(
      (best, current) => (current.amount > best.amount ? current : best),
      { month: '', amount: 0, count: 0 }
    );

    // Calculate top clients
    const topClients = this.calculateTopClients(sales);

    return {
      totalSales,
      totalRevenue,
      totalRevenueLiquid,
      bestMonth,
      salesHistory,
      salesByMonth,
      topClients,
    };
  }

  private groupSalesByMonth(
    sales: Sale[]
  ): { month: string; amount: number; count: number }[] {
    const monthMap = new Map<string, { amount: number; count: number }>();

    sales.forEach(sale => {
      const monthKey = sale.saleDate.toISOString().substring(0, 7); // YYYY-MM format
      const existing = monthMap.get(monthKey) || { amount: 0, count: 0 };

      monthMap.set(monthKey, {
        amount: existing.amount + sale.totalSaleAmount,
        count: existing.count + 1,
      });
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private calculateTopClients(
    sales: Sale[]
  ): { client: string; totalAmount: number; salesCount: number }[] {
    const clientMap = new Map<
      string,
      { totalAmount: number; salesCount: number }
    >();

    sales.forEach(sale => {
      const existing = clientMap.get(sale.client) || {
        totalAmount: 0,
        salesCount: 0,
      };

      clientMap.set(sale.client, {
        totalAmount: existing.totalAmount + sale.totalSaleAmount,
        salesCount: existing.salesCount + 1,
      });
    });

    return Array.from(clientMap.entries())
      .map(([client, data]) => ({ client, ...data }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10); // Top 10 clients
  }
}
