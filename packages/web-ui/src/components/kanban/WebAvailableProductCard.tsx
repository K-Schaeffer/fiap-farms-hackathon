import { Card, CardContent, Typography, Chip, Box } from '@mui/material';

export interface WebProductData {
  id: string;
  name: string;
  description: string;
  unit: 'kg' | 'unity' | 'box';
  costPerUnit: number;
}

export interface WebAvailableProductCardProps {
  product: WebProductData;
}

export function getUnitColor(unit: string) {
  switch (unit) {
    case 'kg':
      return 'primary';
    case 'unity':
      return 'secondary';
    case 'box':
      return 'warning';
    default:
      return 'default';
  }
}

export function WebAvailableProductCard({
  product,
}: WebAvailableProductCardProps) {
  return (
    <Card
      elevation={1}
      sx={{
        height: 'auto', // Allow natural height based on content
        display: 'flex',
        flexDirection: 'column',
        cursor: 'grab',
        '&:hover': {
          elevation: 2,
        },
        // Better mobile spacing - match ProductionCard heights more closely
        minHeight: { xs: 'auto', sm: 'auto' }, // Auto height on all screens
        overflow: 'hidden', // Prevent content overflow
      }}
    >
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 1.5 }, // Consistent tighter padding
          '&:last-child': {
            pb: { xs: 1.5, sm: 1.5 }, // Consistent bottom padding
          },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1, sm: 1 }, // Reduced gap on larger screens for compactness
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' }, // Better alignment on mobile
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: { xs: 0.5, sm: 0 },
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              wordBreak: 'break-word',
              flex: { xs: '1 1 auto', sm: '1 1 auto' }, // Better flex behavior
              lineHeight: { xs: 1.2, sm: 1.4 }, // Tighter line height on mobile
              mb: { xs: 0.5, sm: 0 }, // Margin bottom on mobile when wrapping
            }}
          >
            {product.name}
          </Typography>
          <Chip
            label={product.unit}
            color={getUnitColor(product.unit)}
            size="small"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.75rem' }, // Standardized with ProductionCard
              height: { xs: 18, sm: 22 }, // Slightly more consistent height
              flexShrink: 0, // Prevent chip from shrinking
            }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            minHeight: { xs: '2em', sm: '1.5em' }, // Reduced height on larger screens
            fontSize: '0.875rem', // Standardized 14px across all screen sizes
            lineHeight: { xs: 1.3, sm: 1.43 },
            // Ensure text doesn't overflow
            wordBreak: 'break-word',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: { xs: 2, sm: 2 }, // Limit to 2 lines on larger screens too
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description}
        </Typography>

        <Typography
          variant="body2"
          color="success.main"
          fontWeight={600}
          sx={{
            fontSize: '0.875rem', // Standardized 14px
            mt: 'auto', // Push to bottom of card
            lineHeight: { xs: 1.2, sm: 1.3 },
          }}
        >
          <strong>${product.costPerUnit.toFixed(2)}</strong> per {product.unit}
        </Typography>
      </CardContent>
    </Card>
  );
}
