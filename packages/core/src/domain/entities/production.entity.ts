export type ProductionStatus = 'planted' | 'in_production' | 'harvested';

export interface ProductionItem {
  _id: string;
  productId: string;
  productName: string;
  productUnit: 'kg' | 'unity' | 'box';
  ownerId: string;
  status: ProductionStatus;
  plantedDate: Date;
  expectedHarvestDate: Date;
  harvestedDate?: Date;
  yield?: number;
  location: string;
  updatedAt: Date;
}

/**
 * Production cycle business rules.
 * Defines the allowed status transitions in the production workflow.
 */
const VALID_STATUS_TRANSITIONS: Record<ProductionStatus, ProductionStatus[]> = {
  planted: ['in_production'],
  in_production: ['harvested'],
  harvested: [], // Terminal state - no further transitions allowed
};

/**
 * Error types for production validation
 */
export const PRODUCTION_VALIDATION_ERROR_TYPES = {
  INVALID_TRANSITION: 'PRODUCTION_INVALID_TRANSITION',
  TERMINAL_STATE: 'PRODUCTION_TERMINAL_STATE',
  SKIP_PHASE: 'PRODUCTION_SKIP_PHASE',
} as const;

export type ProductionValidationErrorType =
  (typeof PRODUCTION_VALIDATION_ERROR_TYPES)[keyof typeof PRODUCTION_VALIDATION_ERROR_TYPES];

/**
 * Custom error class for production validation errors
 */
export class ProductionValidationError extends Error {
  constructor(
    message: string,
    public readonly type: ProductionValidationErrorType
  ) {
    super(message);
    this.name = 'ProductionValidationError';
  }

  /**
   * Type guard to check if an error is a production validation error
   */
  static isProductionValidationError(
    error: unknown
  ): error is ProductionValidationError {
    return error instanceof ProductionValidationError;
  }
}

/**
 * Domain service for production status validation.
 * Contains core business rules for production cycle management.
 */
export class ProductionStatusValidator {
  /**
   * Validates if a status transition is allowed according to business rules.
   * Production cycle must follow: planted → in_production → harvested
   */
  static validateStatusTransition(
    currentStatus: ProductionStatus,
    newStatus: ProductionStatus
  ): void {
    if (currentStatus === newStatus) {
      throw new ProductionValidationError(
        `Production item is already in ${newStatus} status`,
        PRODUCTION_VALIDATION_ERROR_TYPES.INVALID_TRANSITION
      );
    }

    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new ProductionValidationError(
        `Invalid status transition from '${currentStatus}' to '${newStatus}'. ` +
          `Valid transitions: ${this.getValidTransitionsDescription(currentStatus)}`,
        PRODUCTION_VALIDATION_ERROR_TYPES.INVALID_TRANSITION
      );
    }

    // Additional business rule validations
    this.validateBusinessRules(currentStatus, newStatus);
  }

  /**
   * Additional business rule validations for status transitions
   */
  private static validateBusinessRules(
    currentStatus: ProductionStatus,
    newStatus: ProductionStatus
  ): void {
    // Rule: Once harvested, no status changes are allowed
    if (currentStatus === 'harvested') {
      throw new ProductionValidationError(
        'Cannot change status of harvested items. Harvested is a terminal state.',
        PRODUCTION_VALIDATION_ERROR_TYPES.TERMINAL_STATE
      );
    }

    // Rule: Can't skip production phases
    if (currentStatus === 'planted' && newStatus === 'harvested') {
      throw new ProductionValidationError(
        'Cannot harvest directly from planted status. Items must first be moved to in_production.',
        PRODUCTION_VALIDATION_ERROR_TYPES.SKIP_PHASE
      );
    }
  }

  /**
   * Gets a human-readable description of valid transitions for a given status
   */
  private static getValidTransitionsDescription(
    status: ProductionStatus
  ): string {
    const transitions = VALID_STATUS_TRANSITIONS[status];
    if (transitions.length === 0) {
      return 'none (terminal state)';
    }
    return transitions.join(', ');
  }

  /**
   * Gets all valid next statuses for a given current status
   */
  static getValidNextStatuses(
    currentStatus: ProductionStatus
  ): ProductionStatus[] {
    return [...VALID_STATUS_TRANSITIONS[currentStatus]];
  }
}
