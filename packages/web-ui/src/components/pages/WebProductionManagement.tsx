import { Box } from '@mui/material';
import { useState } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import {
  WebProductionKanbanBoard,
  WebProductionCardData,
  WebProductData,
} from '../kanban';
import {
  WebPlantingModal,
  WebPlantingFormData,
  WebHarvestModal,
  WebHarvestFormData,
} from '../modals';

export interface WebProductionManagementProps {
  products: WebProductData[];
  productionItems: WebProductionCardData[];
  onStartProductionWithForm: (
    productId: string,
    data: WebPlantingFormData
  ) => Promise<void>;
  onUpdateStatus: (
    itemId: string,
    newStatus: 'planted' | 'in_production' | 'harvested'
  ) => Promise<void>;
  onHarvestItemWithForm: (
    itemId: string,
    data: WebHarvestFormData
  ) => Promise<void>;
  onReorderItems: (
    sourceIndex: number,
    destinationIndex: number,
    columnId: string
  ) => Promise<void>;
}

export function WebProductionManagement({
  products,
  productionItems,
  onStartProductionWithForm,
  onUpdateStatus,
  onHarvestItemWithForm,
  onReorderItems,
}: WebProductionManagementProps) {
  const [plantingModal, setPlantingModal] = useState<{
    open: boolean;
    product: WebProductData | null;
  }>({
    open: false,
    product: null,
  });

  const [harvestModal, setHarvestModal] = useState<{
    open: boolean;
    item: WebProductionCardData | null;
  }>({
    open: false,
    item: null,
  });
  const [isPlanting, setIsPlanting] = useState(false);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle reordering within the same column
    if (source.droppableId === destination.droppableId) {
      await onReorderItems(source.index, destination.index, source.droppableId);
      return;
    }

    // Handle drag from available products to planted column (show modal)
    if (
      source.droppableId === 'available' &&
      destination.droppableId === 'planted'
    ) {
      const product = products.find(p => p.id === draggableId);
      if (product) {
        setPlantingModal({
          open: true,
          product: product,
        });
      }
      return;
    }

    // Handle moving between production statuses
    if (
      source.droppableId !== 'available' &&
      destination.droppableId !== 'available'
    ) {
      const validStatuses = ['planted', 'in_production', 'harvested'] as const;

      if (
        validStatuses.includes(
          destination.droppableId as 'planted' | 'in_production' | 'harvested'
        )
      ) {
        if (destination.droppableId === 'harvested') {
          // Show harvest form modal when moving to harvested
          // But only if the item is in a valid state for harvesting
          const item = productionItems.find(item => item.id === draggableId);
          if (item) {
            // Check if the transition is valid (UI-level check for better UX)
            // The core business rules will still be enforced regardless
            if (item.status === 'in_production') {
              setHarvestModal({
                open: true,
                item: item,
              });
            } else {
              // Let the operation proceed - core validation will handle it
              // This allows for better error messaging from the business layer
              await onUpdateStatus(draggableId, 'harvested');
            }
          }
        } else {
          // Direct status update for non-harvested transitions
          // Business rule validation will be enforced by the use case
          await onUpdateStatus(
            draggableId,
            destination.droppableId as 'planted' | 'in_production'
          );
        }
      }
    }
  };

  const handlePlantingModalClose = () => {
    setPlantingModal({ open: false, product: null });
  };

  const handlePlantingConfirm = async (data: WebPlantingFormData) => {
    if (!plantingModal.product) return;

    try {
      setIsPlanting(true);
      await onStartProductionWithForm(plantingModal.product.id, data);
      handlePlantingModalClose();
    } catch (error) {
      console.error('Error planting product:', error);
      // You could show a toast notification here
    } finally {
      setIsPlanting(false);
    }
  };

  const handleHarvestModalClose = () => {
    setHarvestModal({ open: false, item: null });
  };

  const handleHarvestConfirm = async (data: WebHarvestFormData) => {
    if (!harvestModal.item) return;

    try {
      await onHarvestItemWithForm(harvestModal.item.id, data);
      handleHarvestModalClose();
    } catch (error) {
      console.error('Error harvesting item:', error);
      // You could show a toast notification here
    }
  };

  return (
    <Box>
      <WebProductionKanbanBoard
        availableProducts={products}
        productionItems={productionItems}
        onDragEnd={handleDragEnd}
      />

      <WebPlantingModal
        open={plantingModal.open}
        productName={plantingModal.product?.name || ''}
        onClose={handlePlantingModalClose}
        onConfirm={handlePlantingConfirm}
        loading={isPlanting}
      />

      <WebHarvestModal
        open={harvestModal.open}
        productName={harvestModal.item?.productName || ''}
        onClose={handleHarvestModalClose}
        onConfirm={handleHarvestConfirm}
      />
    </Box>
  );
}
