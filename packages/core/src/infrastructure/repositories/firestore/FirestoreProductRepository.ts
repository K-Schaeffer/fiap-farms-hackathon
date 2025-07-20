import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { Product } from '../../../domain/entities/product.entity';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  DocumentData,
  Firestore,
} from 'firebase/firestore';

export class FirestoreProductRepository implements IProductRepository {
  private collectionRef;

  constructor(private db: Firestore) {
    if (!db) {
      throw new Error('Firestore instance is required');
    }
    this.collectionRef = collection(this.db, 'products');
  }

  private mapDocumentToProduct(id: string, data: DocumentData): Product {
    return {
      _id: id,
      name: data.name,
      description: data.description,
      unit: data.unit,
      costPerUnit: data.costPerUnit,
    };
  }

  async findById(productId: string): Promise<Product | null> {
    const docRef = doc(this.collectionRef, productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return this.mapDocumentToProduct(docSnap.id, docSnap.data());
    }

    return null;
  }

  async findAll(): Promise<Product[]> {
    const querySnapshot = await getDocs(this.collectionRef);
    return querySnapshot.docs.map(doc =>
      this.mapDocumentToProduct(doc.id, doc.data())
    );
  }
}
