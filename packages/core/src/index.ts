/*
================================================================================
|             CLEAN ARCHITECTURE: CORE BUSINESS LOGIC PACKAGE                 |
================================================================================
|
| This package implements Clean Architecture for the FIAP Farms application.
| It provides a robust, scalable, and testable foundation for business logic.
|
|------------------------------------------------------------------------------
| Architecture Layers (Dependencies point inward):
|------------------------------------------------------------------------------
|
|   [Infrastructure] -> [Application] -> [Domain]
|
| - Domain (Innermost): Pure business entities and repository interfaces
| - Application: Use cases that orchestrate domain entities  
| - Infrastructure (Outermost): Concrete implementations (Firestore, etc.)
|
|------------------------------------------------------------------------------
| Key Benefits:
|------------------------------------------------------------------------------
| - Testability: Easy to mock dependencies and test business logic
| - Flexibility: Can swap database implementations without changing business logic
| - Framework Independence: Core logic doesn't depend on React, React Native, etc.
| - Maintainability: Clear separation of concerns across layers
|
================================================================================
*/

// Domain Layer - Core business rules (no external dependencies)
export * from './domain/entities/product.entity';
export * from './domain/entities/production.entity';
export * from './domain/entities/inventory.entity';
export * from './domain/entities/sale.entity';

// Domain Repository Interfaces (Ports)
export * from './domain/repositories/IProductRepository';
export * from './domain/repositories/IProductionRepository';
export * from './domain/repositories/IInventoryRepository';
export * from './domain/repositories/ISaleRepository';

// Application Layer - Use Cases (Application business rules)
export * from './application/use-cases/production/StartNewProduction.usecase';
export * from './application/use-cases/production/HarvestProductionItem.usecase';
export * from './application/use-cases/production/GetProductionOverview.usecase';
export * from './application/use-cases/production/UpdateProductionStatus.usecase';
export * from './application/use-cases/production/GetProductionDistribution.usecase';
export * from './application/use-cases/production/GetProductionTrend.usecase';

export * from './application/use-cases/sales/RegisterSale.usecase';
export * from './application/use-cases/sales/GetSalesDashboardData.usecase';

export * from './application/use-cases/inventory/GetInventoryOverview.usecase';

export * from './application/use-cases/products/GetProducts.usecase';

// Infrastructure Layer - External implementations (Adapters)
export * from './infrastructure/repositories/firestore/FirestoreProductRepository';
export * from './infrastructure/repositories/firestore/FirestoreProductionRepository';
export * from './infrastructure/repositories/firestore/FirestoreInventoryRepository';
export * from './infrastructure/repositories/firestore/FirestoreSaleRepository';
