import { IInventoryRepository } from '../../../domain/repositories/IInventoryRepository';
import { InventoryItem } from '../../../domain/entities/inventory.entity';
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
  Timestamp,
  Firestore,
} from 'firebase/firestore';

export class FirestoreInventoryRepository implements IInventoryRepository {
  private collectionRef;

  constructor(private db: Firestore) {
    if (!db) {
      throw new Error('Firestore instance is required');
    }
    this.collectionRef = collection(this.db, 'inventory');
  }

  private mapDocumentToInventoryItem(
    id: string,
    data: DocumentData
  ): InventoryItem {
    return {
      _id: id,
      ownerId: data.ownerId,
      productId: data.productId,
      productName: data.productName,
      quantity: data.quantity,
      unit: data.unit,
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate()
          : new Date(data.updatedAt),
    };
  }

  async findByOwner(ownerId: string): Promise<InventoryItem[]> {
    const q = query(this.collectionRef, where('ownerId', '==', ownerId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc =>
      this.mapDocumentToInventoryItem(doc.id, doc.data())
    );
  }

  async findByProduct(productId: string): Promise<InventoryItem[]> {
    const q = query(this.collectionRef, where('productId', '==', productId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc =>
      this.mapDocumentToInventoryItem(doc.id, doc.data())
    );
  }

  async findByOwnerAndProduct(
    ownerId: string,
    productId: string
  ): Promise<InventoryItem | null> {
    const q = query(
      this.collectionRef,
      where('ownerId', '==', ownerId),
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnapshot = querySnapshot.docs[0];
    return this.mapDocumentToInventoryItem(docSnapshot.id, docSnapshot.data());
  }
}
