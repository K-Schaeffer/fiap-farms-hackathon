import Chip from '@mui/material/Chip';

export type WebProductionStatus = 'planted' | 'in_production' | 'harvested';

export function getWebProductionStatusColor(
  status: WebProductionStatus
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

export function getWebProductionStatusLabel(
  status: WebProductionStatus
): string {
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
  status: WebProductionStatus;
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
      label={getWebProductionStatusLabel(status)}
      color={getWebProductionStatusColor(status)}
      size={size}
      sx={{ fontSize: '0.75rem', height: 22, ...sx }}
    />
  );
}
