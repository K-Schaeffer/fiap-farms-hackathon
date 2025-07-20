import { IProductionRepository } from '../../../domain/repositories/IProductionRepository';
import {
  ProductionItem,
  ProductionStatus,
} from '../../../domain/entities/production.entity';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  DocumentData,
  Timestamp,
  Firestore,
} from 'firebase/firestore';

export class FirestoreProductionRepository implements IProductionRepository {
  private collectionRef;

  constructor(private db: Firestore) {
    if (!db) {
      throw new Error('Firestore instance is required');
    }
    this.collectionRef = collection(this.db, 'production_items');
  }

  private mapDocumentToProductionItem(
    id: string,
    data: DocumentData
  ): ProductionItem {
    return {
      _id: id,
      productId: data.productId,
      ownerId: data.ownerId,
      status: data.status,
      plantedDate: data.plantedDate?.toDate(),
      expectedHarvestDate: data.expectedHarvestDate?.toDate(),
      harvestedDate: data.harvestedDate?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      yield: data.yield,
      location: data.location,
    };
  }

  private convertDatesToTimestamps(item: Omit<ProductionItem, '_id'>) {
    return {
      ...item,
      plantedDate: Timestamp.fromDate(item.plantedDate),
      expectedHarvestDate: Timestamp.fromDate(item.expectedHarvestDate),
      harvestedDate: item.harvestedDate
        ? Timestamp.fromDate(item.harvestedDate)
        : undefined,
    };
  }

  async create(itemData: Omit<ProductionItem, '_id'>): Promise<ProductionItem> {
    const docRef = await addDoc(this.collectionRef, {
      ...this.convertDatesToTimestamps(itemData),
    });

    return {
      _id: docRef.id,
      ...itemData,
    };
  }

  async findByOwner(ownerId: string): Promise<ProductionItem[]> {
    const q = query(this.collectionRef, where('ownerId', '==', ownerId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc =>
      this.mapDocumentToProductionItem(doc.id, doc.data())
    );
  }

  async findById(itemId: string): Promise<ProductionItem | null> {
    const docRef = doc(this.collectionRef, itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return this.mapDocumentToProductionItem(docSnap.id, docSnap.data());
    }

    return null;
  }

  async updateStatus(itemId: string, status: ProductionStatus): Promise<void> {
    const docRef = doc(this.collectionRef, itemId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  }

  async setAsHarvested(itemId: string, yieldAmount: number): Promise<void> {
    const docRef = doc(this.collectionRef, itemId);
    await updateDoc(docRef, {
      status: 'harvested',
      yield: yieldAmount,
      harvestedDate: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  async findByProduct(productId: string): Promise<ProductionItem[]> {
    const q = query(this.collectionRef, where('productId', '==', productId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc =>
      this.mapDocumentToProductionItem(doc.id, doc.data())
    );
  }

  async findByStatus(status: ProductionStatus): Promise<ProductionItem[]> {
    const q = query(this.collectionRef, where('status', '==', status));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc =>
      this.mapDocumentToProductionItem(doc.id, doc.data())
    );
  }
}
