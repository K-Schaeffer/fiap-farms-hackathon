import { ISaleRepository } from '../../../domain/repositories/ISaleRepository';
import { Sale } from '../../../domain/entities/sale.entity';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  DocumentData,
  Timestamp,
  Firestore,
} from 'firebase/firestore';

export class FirestoreSaleRepository implements ISaleRepository {
  private collectionRef;

  constructor(private db: Firestore) {
    if (!db) {
      throw new Error('Firestore instance is required');
    }
    this.collectionRef = collection(this.db, 'sales');
  }

  private mapDocumentToSale(id: string, data: DocumentData): Sale {
    return {
      _id: id,
      ownerId: data.ownerId,
      saleDate: data.saleDate?.toDate() || new Date(),
      items: data.items || [],
      totalSaleAmount: data.totalSaleAmount,
      totalSaleProfit: data.totalSaleProfit,
      client: data.client,
    };
  }

  async create(saleData: Omit<Sale, '_id' | 'totalSaleProfit'>): Promise<Sale> {
    const docRef = await addDoc(this.collectionRef, {
      ...saleData,
      saleDate: Timestamp.fromDate(saleData.saleDate),
      createdAt: Timestamp.now(),
    });

    return {
      _id: docRef.id,
      ...saleData,
    };
  }

  async findByOwner(ownerId: string, limit?: number): Promise<Sale[]> {
    let q = query(
      this.collectionRef,
      where('ownerId', '==', ownerId),
      orderBy('saleDate', 'desc')
    );

    if (limit) {
      q = query(q, firestoreLimit(limit));
    }

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc =>
      this.mapDocumentToSale(doc.id, doc.data())
    );
  }

  async findById(saleId: string): Promise<Sale | null> {
    const docRef = doc(this.collectionRef, saleId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return this.mapDocumentToSale(docSnap.id, docSnap.data());
    }

    return null;
  }

  async findByDateRange(
    ownerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Sale[]> {
    const q = query(
      this.collectionRef,
      where('ownerId', '==', ownerId),
      where('saleDate', '>=', Timestamp.fromDate(startDate)),
      where('saleDate', '<=', Timestamp.fromDate(endDate)),
      orderBy('saleDate', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc =>
      this.mapDocumentToSale(doc.id, doc.data())
    );
  }

  async findByClient(ownerId: string, client: string): Promise<Sale[]> {
    const q = query(
      this.collectionRef,
      where('ownerId', '==', ownerId),
      where('client', '==', client),
      orderBy('saleDate', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc =>
      this.mapDocumentToSale(doc.id, doc.data())
    );
  }

  async getTotalSalesAmount(
    ownerId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    let q = query(this.collectionRef, where('ownerId', '==', ownerId));

    if (startDate && endDate) {
      q = query(
        q,
        where('saleDate', '>=', Timestamp.fromDate(startDate)),
        where('saleDate', '<=', Timestamp.fromDate(endDate))
      );
    }

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.reduce((total, doc) => {
      const data = doc.data();
      return total + (data.totalSaleAmount || 0);
    }, 0);
  }
}
