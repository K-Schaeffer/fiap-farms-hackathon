/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  onDocumentUpdated,
  onDocumentCreated,
} from 'firebase-functions/v2/firestore';
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ region: 'southamerica-east1', maxInstances: 10 });

admin.initializeApp();

const db = admin.firestore();

/**
 * Function 1: Updates inventory when a production item is harvested.
 * Trigger: onUpdate in the 'production_items' collection.
 */
export const onProductionHarvested = onDocumentUpdated(
  'production_items/{itemId}',
  async event => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    // Only run if the status CHANGED to 'harvested'.
    if (
      beforeData?.status !== 'harvested' &&
      afterData?.status === 'harvested'
    ) {
      const { ownerId, productId, yield: yieldAmount } = afterData;

      if (!ownerId || !productId || !yieldAmount) {
        console.log('Insufficient data to update inventory.');
        return;
      }

      // The inventory document ID is a combination of owner and product.
      const inventoryDocId = `${ownerId}_${productId}`;
      const inventoryRef = db.collection('inventory').doc(inventoryDocId);

      try {
        // Use a transaction to ensure safe updates.
        await db.runTransaction(async transaction => {
          const inventoryDoc = await transaction.get(inventoryRef);

          if (!inventoryDoc.exists) {
            // If the user never harvested this product before, create the inventory item.
            const productRef = db.collection('products').doc(productId);
            const productDoc = await productRef.get();
            const productData = productDoc.data();

            if (!productData) {
              console.error(`Product with ID ${productId} not found.`);
              return;
            }

            transaction.set(inventoryRef, {
              ownerId,
              productId,
              productName: productData.name,
              unit: productData.unit,
              quantity: yieldAmount,
              lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            });
          } else {
            const newQuantity =
              (inventoryDoc.data()?.quantity || 0) + yieldAmount;
            transaction.update(inventoryRef, {
              quantity: newQuantity,
              lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        });

        console.log(
          `Inventory for ${productId} and ${ownerId} updated successfully.`
        );
      } catch (error) {
        console.error('Failed to update inventory:', error);
      }
    }
  }
);

/**
 * Function 2: Calculates profit when a new sale is registered.
 * Trigger: onCreate in the 'sales' collection.
 */
export const onSaleCreated = onDocumentCreated(
  'sales/{saleId}',
  async event => {
    const saleData = event.data?.data();

    if (!saleData || !saleData.items) {
      console.log('Sale has no items, nothing to calculate.');
      return;
    }

    let totalSaleProfit = 0;
    const itemsWithProfit = [];

    for (const item of saleData.items) {
      if (!(saleData.ownerId && item.productId && item.quantity)) continue;

      const inventoryDocId = `${saleData.ownerId}_${item.productId}`;
      const inventoryRef = db.collection('inventory').doc(inventoryDocId);
      let inventoryDecremented = false;

      try {
        await db.runTransaction(async transaction => {
          const inventoryDoc = await transaction.get(inventoryRef);
          if (!inventoryDoc.exists) {
            console.warn(
              `Inventory for owner ${saleData.ownerId} and product ${item.productId} does not exist.`
            );
            return;
          }
          const currentQuantity = inventoryDoc.data()?.quantity || 0;
          if (currentQuantity < item.quantity) {
            console.warn(
              `Not enough inventory for owner ${saleData.ownerId} and product ${item.productId}. Requested: ${item.quantity}, Available: ${currentQuantity}`
            );
            return;
          }

          transaction.update(inventoryRef, {
            quantity: currentQuantity - item.quantity,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          });
          inventoryDecremented = true;
        });
      } catch (error) {
        console.error(
          `Failed to decrease inventory for owner ${saleData.ownerId} and product ${item.productId}:`,
          error
        );
      }

      if (inventoryDecremented) {
        const productRef = db.collection('products').doc(item.productId);
        const productDoc = await productRef.get();
        const productData = productDoc.data();

        if (productData && productData.costPerUnit) {
          const itemProfit =
            (item.pricePerUnit - productData.costPerUnit) * item.quantity;
          totalSaleProfit += itemProfit;
          itemsWithProfit.push({ ...item, totalProfit: itemProfit });
        } else {
          itemsWithProfit.push(item);
        }
      }
    }

    await event.data?.ref.update({
      items: itemsWithProfit,
      totalSaleProfit: totalSaleProfit,
    });
  }
);
