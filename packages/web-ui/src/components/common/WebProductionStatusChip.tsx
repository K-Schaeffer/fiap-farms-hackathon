import Chip from '@mui/material/Chip';

export type ProductionStatus = 'planted' | 'in_production' | 'harvested';

export function getProductionStatusColor(
  status: ProductionStatus
): 'success' | 'warning' | 'info' | 'error' | 'default' {
  switch (status) {
    case 'planted':
      return 'success';
    case 'in_production':
      return 'warning';
    case 'harvested':
      return 'info';

    default:
      return 'default';
  }
}

export function getProductionStatusLabel(status: ProductionStatus): string {
  switch (status) {
    case 'planted':
      return 'Planted';
    case 'in_production':
      return 'In Production';
    case 'harvested':
      return 'Harvested';

    default:
      return status;
  }
}

export interface WebProductionStatusChipProps {
  status: ProductionStatus;
  size?: 'small' | 'medium';
  sx?: object;
}

export function WebProductionStatusChip({
  status,
  size = 'small',
  sx,
}: WebProductionStatusChipProps) {
  return (
    <Chip
      label={getProductionStatusLabel(status)}
      color={getProductionStatusColor(status)}
      size={size}
      sx={{ fontSize: '0.75rem', height: 22, ...sx }}
    />
  );
}
