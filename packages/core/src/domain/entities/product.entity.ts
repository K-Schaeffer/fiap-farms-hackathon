export interface Product {
  _id: string;
  name: string;
  description: string;
  unit: 'kg' | 'unity' | 'box';
  costPerUnit: number;
}
