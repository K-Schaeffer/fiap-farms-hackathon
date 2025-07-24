import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import {
  WebProductionStatusChip,
  WebProductionStatus,
} from '../common/WebProductionStatusChip';

export interface WebProductionCardData {
  id: string;
  productId: string;
  productName: string;
  status: WebProductionStatus;
  location: string;
  plantedDate: string;
  expectedHarvestDate: string;
  harvestedDate?: string;
  yield?: number;
  unit: string;
}

export interface WebProductionCardProps {
  productionItem: WebProductionCardData;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export function WebProductionCard({ productionItem }: WebProductionCardProps) {
  const isOverdue =
    productionItem.status !== 'harvested' &&
    new Date(productionItem.expectedHarvestDate) < new Date();

  return (
    <Card
      elevation={2}
      sx={{
        cursor: 'grab',
        '&:hover': { elevation: 4 },
        '&:active': { cursor: 'grabbing' },
        borderLeft: isOverdue ? '4px solid #ff5722' : 'none',
        width: '100%',
        // Allow natural height based on content
        minHeight: { xs: 'auto', sm: 'auto' },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 1.5 }, // Consistent with AvailableProductCard
          '&:last-child': { pb: { xs: 1.5, sm: 1.5 } },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1, sm: 1 }, // Consistent gap spacing
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              // Ensure text doesn't overflow on small screens
              wordBreak: 'break-word',
              flex: { xs: '1 1 100%', sm: '1 1 auto' },
            }}
          >
            Production #{productionItem.id.slice(-6)}
          </Typography>
          <WebProductionStatusChip
            status={productionItem.status}
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              height: { xs: 18, sm: 22 },
            }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: '0.875rem', // Standardized 14px
            lineHeight: { xs: 1.3, sm: 1.4 },
          }}
        >
          <strong>Product:</strong> {productionItem.productName}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: '0.875rem', // Standardized 14px
            lineHeight: { xs: 1.3, sm: 1.4 },
          }}
        >
          <strong>Location:</strong> {productionItem.location}
        </Typography>

        <Divider />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: '0.875rem', // Standardized 14px
              lineHeight: { xs: 1.2, sm: 1.3 },
            }}
          >
            <strong>Planted:</strong> {formatDate(productionItem.plantedDate)}
          </Typography>

          <Typography
            variant="caption"
            color={isOverdue ? 'error.main' : 'text.secondary'}
            sx={{
              fontSize: '0.875rem', // Standardized 14px
              lineHeight: { xs: 1.2, sm: 1.3 },
            }}
          >
            <strong>Expected Harvest:</strong>{' '}
            {formatDate(productionItem.expectedHarvestDate)}
            {isOverdue && ' (Overdue)'}
          </Typography>

          {productionItem.harvestedDate && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: '0.875rem', // Standardized 14px
                lineHeight: { xs: 1.2, sm: 1.3 },
              }}
            >
              <strong>Harvested:</strong>{' '}
              {formatDate(productionItem.harvestedDate)}
            </Typography>
          )}

          {productionItem.yield && (
            <Typography
              variant="caption"
              color="success.main"
              sx={{
                fontSize: '0.875rem', // Standardized 14px
                lineHeight: { xs: 1.2, sm: 1.3 },
                fontWeight: 600, // Make yield bold like price
              }}
            >
              <strong>
                Yield: {productionItem.yield} ({productionItem.unit})
              </strong>
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
