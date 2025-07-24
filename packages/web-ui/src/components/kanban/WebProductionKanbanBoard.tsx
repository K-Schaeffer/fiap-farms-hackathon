import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DragStart,
} from '@hello-pangea/dnd';
import { WebProductionCard, WebProductionCardData } from './WebProductionCard';
import {
  WebAvailableProductCard,
  WebProductData,
} from './WebAvailableProductCard';

export interface WebKanbanColumn {
  id: string;
  title: string;
  items: (WebProductData | WebProductionCardData)[];
  color: string;
}

export interface WebProductionKanbanBoardProps {
  availableProducts: WebProductData[];
  productionItems: WebProductionCardData[];
  onDragEnd: (result: DropResult) => void;
  isDragDisabled?: boolean;
}

const COLUMN_DEFINITIONS = [
  { id: 'available', title: 'Available', color: '#f5f5f5' },
  { id: 'planted', title: 'Planted', color: '#e8f5e8' },
  { id: 'in_production', title: 'In Production', color: '#fff3e0' },
  { id: 'harvested', title: 'Harvested', color: '#e3f2fd' },
];

export function WebProductionKanbanBoard({
  availableProducts,
  productionItems,
  onDragEnd,
}: WebProductionKanbanBoardProps) {
  const theme = useTheme();

  // Track current drag state
  const [currentDrag, setCurrentDrag] = React.useState<{
    draggableId: string;
    source: string;
  } | null>(null);

  const handleDragStart = (start: DragStart) => {
    setCurrentDrag({
      draggableId: start.draggableId,
      source: start.source.droppableId,
    });
  };

  const handleDragEnd = (result: DropResult) => {
    setCurrentDrag(null);
    onDragEnd(result);
  };

  const organizeItemsByStatus = () => {
    const columns: Record<string, WebKanbanColumn> = {};

    // Initialize columns
    COLUMN_DEFINITIONS.forEach(col => {
      columns[col.id] = {
        ...col,
        items: [],
      };
    });

    // Add available products to the first column
    columns.available.items = availableProducts;

    // Organize production items by status
    productionItems.forEach(item => {
      if (columns[item.status]) {
        columns[item.status].items.push(item);
      }
    });

    return columns;
  };

  const columns = organizeItemsByStatus();

  const getItemId = (item: WebProductData | WebProductionCardData) => {
    return 'productId' in item ? item.id : item.id;
  };

  const isProductionItem = (
    item: WebProductData | WebProductionCardData
  ): item is WebProductionCardData => {
    return 'status' in item;
  };

  /**
   * UI-only validation for visual drag feedback.
   * This does NOT enforce business rules - it only provides visual cues.
   * The actual business rule enforcement happens in the core domain layer.
   */
  const isValidProductionTransition = (from: string, to: string): boolean => {
    if (from === to) return true;

    switch (from) {
      case 'available':
        return to === 'planted';
      case 'planted':
        return to === 'in_production';
      case 'in_production':
        return to === 'harvested';
      case 'harvested':
        return false;
      default:
        return false;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 0.5, sm: 2 }, // Reduce vertical padding on mobile
        px: { xs: 1.5, sm: 2, md: 2 }, // More horizontal padding on mobile for better right edge spacing
      }}
    >
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Box
          sx={{
            // Mobile: Grid layout with multiple rows
            // Medium: Grid layout with better spacing
            // Desktop: Flex layout with single row
            display: { xs: 'grid', lg: 'flex' },
            gridTemplateColumns: {
              xs: '1fr', // Single column on very small screens
              sm: '1fr 1fr', // 2 columns on small screens and up
              md: '1fr 1fr', // 2 columns on tablet/medium screens
            },
            gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3 }, // Increased gap on mobile
            // For mobile/tablet grid layout
            gridTemplateRows: {
              xs: 'repeat(4, auto)', // Auto-sized rows for single column on very small screens
              sm: 'repeat(2, 1fr)', // 2 rows for 2x2 grid on small screens
              md: 'repeat(2, minmax(300px, 1fr))',
            },
            // For desktop flex layout
            overflowX: { lg: 'auto' },
            pb: 2,
            px: { xs: 1.5, sm: 2, md: 2 }, // Increased horizontal padding on mobile for better edge spacing
            width: '100%',
            // Custom scrollbar for desktop
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: theme.palette.grey[100],
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.grey[300],
              borderRadius: 4,
            },
          }}
        >
          {Object.values(columns).map(column => (
            <Paper
              key={column.id}
              elevation={2}
              sx={{
                p: { xs: 1, sm: 2 },
                backgroundColor: column.color,
                // Grid layout styling for mobile/tablet
                width: { xs: '100%', lg: 'auto' },
                minWidth: { lg: 320 },
                // Desktop flex layout
                flex: { lg: '1 1 0' },
                // Use full available height on mobile/tablet grid
                height: { xs: '100%', lg: 'auto' },
                minHeight: {
                  xs: 250, // Fixed reasonable height for mobile
                  sm: 300, // Reasonable height for small screens
                  md: 500, // Even bigger height for medium screens
                  lg: 600, // Even bigger height on desktop
                },
                maxHeight: {
                  xs: 400, // Cap height so columns don't take too much space
                  sm: 450, // Cap for small screens
                  md: 600, // Even bigger cap for medium screens
                  lg: 800, // Even bigger limit height on desktop
                },
                display: 'flex',
                flexDirection: 'column',
                // Smooth transitions for resize
                transition: 'all 0.3s ease-in-out',
                // Ensure columns fill the grid cells properly
                overflow: 'hidden',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 1, sm: 2 },
                  fontWeight: 600,
                  textAlign: 'center',
                  borderBottom: `2px solid ${theme.palette.divider}`,
                  pb: 1,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                  // Ensure text doesn't break awkwardly on small screens
                  wordBreak: 'break-word',
                }}
              >
                {column.title}
              </Typography>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => {
                  // Determine if this drop zone is valid during drag
                  // This is for UI feedback only - actual validation happens in core
                  const isValidDropZone = currentDrag
                    ? isValidProductionTransition(currentDrag.source, column.id)
                    : true;

                  let backgroundColor = 'transparent';
                  let border = 'none';

                  if (currentDrag && snapshot.isDraggingOver) {
                    // Dragging over this zone
                    backgroundColor = isValidDropZone
                      ? theme.palette.success.light + '40' // Valid drop - green with opacity
                      : theme.palette.error.light + '40'; // Invalid drop - red with opacity
                    border = isValidDropZone
                      ? `2px solid ${theme.palette.success.main}`
                      : `2px solid ${theme.palette.error.main}`;
                  } else if (currentDrag) {
                    // Dragging but not over this zone
                    backgroundColor = isValidDropZone
                      ? theme.palette.success.light + '20' // Valid potential drop - light green
                      : theme.palette.grey[300] + '40'; // Invalid potential drop - light grey
                    border = isValidDropZone
                      ? `1px dashed ${theme.palette.success.main}`
                      : `1px dashed ${theme.palette.grey[400]}`;
                  }

                  return (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        flexGrow: 1,
                        backgroundColor,
                        border,
                        borderRadius: 1,
                        p: { xs: 0.5, sm: 1 },
                        pb: { xs: 1, sm: 1.5 }, // Add bottom padding for better spacing
                        // Use available height with proper constraints for scrolling
                        minHeight: { xs: 120, sm: 200 }, // Smaller minimum height for mobile
                        maxHeight: {
                          xs: 'calc(100% - 10px)', // Constrain height to enable internal scrolling
                          sm: 'calc(100% - 20px)', // Leave space for padding on larger screens
                        },
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        transition: 'all 0.2s ease-in-out',
                        // Ensure proper scrolling behavior
                        display: 'flex',
                        flexDirection: 'column',
                        // Important: Prevent content from overlapping
                        position: 'relative',
                        // Custom scrollbar for better UX
                        '&::-webkit-scrollbar': {
                          width: { xs: 4, md: 6 }, // Thinner scrollbar on mobile
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: theme.palette.grey[100],
                          borderRadius: 3,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: theme.palette.grey[300],
                          borderRadius: 3,
                          '&:hover': {
                            backgroundColor: theme.palette.grey[400],
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: { xs: 1, sm: 1.5 }, // Smaller gap on mobile to fit more cards
                          minHeight: 'min-content', // Allow natural sizing based on content
                          pb: { xs: 0.5, sm: 2.5 }, // Minimal bottom padding on mobile
                          pt: { xs: 0.25, sm: 0.5 }, // Minimal top padding on mobile
                          // Ensure cards don't overlap
                          position: 'relative',
                          width: '100%',
                        }}
                      >
                        {column.items.map((item, index) => (
                          <Draggable
                            key={getItemId(item)}
                            draggableId={getItemId(item)}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                  transform: snapshot.isDragging
                                    ? 'rotate(5deg)'
                                    : 'none',
                                  // Ensure cards are touch-friendly on mobile
                                  minHeight: { xs: 56, sm: 'auto' }, // Consistent touch target
                                  transition: 'all 0.2s ease-in-out',
                                  // Better touch experience
                                  touchAction: 'manipulation',
                                  cursor: 'grab',
                                  '&:active': {
                                    cursor: 'grabbing',
                                  },
                                  // Prevent cards from overlapping
                                  position: 'relative',
                                  zIndex: 1,
                                  // Ensure full width
                                  width: '100%',
                                  // Prevent shrinking
                                  flexShrink: 0,
                                }}
                              >
                                {isProductionItem(item) ? (
                                  <WebProductionCard productionItem={item} />
                                ) : (
                                  <WebAvailableProductCard product={item} />
                                )}
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    </Box>
                  );
                }}
              </Droppable>
            </Paper>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
}

export { WebProductionCard } from './WebProductionCard';
export { WebAvailableProductCard } from './WebAvailableProductCard';
export type {
  WebProductionCardProps,
  WebProductionCardData,
} from './WebProductionCard';
export type {
  WebAvailableProductCardProps,
  WebProductData,
} from './WebAvailableProductCard';
