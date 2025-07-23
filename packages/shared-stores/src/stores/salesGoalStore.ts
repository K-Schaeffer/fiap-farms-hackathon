import { create } from 'zustand';
import {
  collection,
  query,
  onSnapshot,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { getFirebaseDb } from '@fiap-farms/firebase';
import { SalesGoalState, StoreSaleGoal, StoreSale } from '../types';

const db = getFirebaseDb();

export const useSalesGoalStore = create<SalesGoalState>((set, get) => ({
  activeSalesGoal: null,
  currentProfit: 0,
  isSalesGoalAchieved: false,
  reset: () => {
    set({
      activeSalesGoal: null,
      currentProfit: 0,
      isSalesGoalAchieved: false,
    });
  },

  initialize: (ownerId: string) => {
    // Helper function to check achievement
    const checkAchievement = () => {
      const { activeSalesGoal, currentProfit, isSalesGoalAchieved } = get();
      if (
        !isSalesGoalAchieved &&
        activeSalesGoal &&
        currentProfit >= activeSalesGoal.targetProfit
      ) {
        set({ isSalesGoalAchieved: true });
      }
    };

    // Load the goal
    const goalRef = doc(db, 'goals', 'goal_sales_jul_2025'); // Hardcoded for MVP
    getDoc(goalRef).then(docSnap => {
      if (docSnap.exists() && docSnap.data()?.type === 'sales') {
        set({ activeSalesGoal: docSnap.data() as StoreSaleGoal });
        // Check achievement after goal is loaded
        checkAchievement();
      }
    });

    // Set up sales listener
    const salesQuery = query(
      collection(db, 'sales'),
      where('ownerId', '==', ownerId)
    );

    const unsubscribe = onSnapshot(salesQuery, snapshot => {
      const totalProfit = snapshot.docs.reduce(
        (sum, doc) => sum + ((doc.data() as StoreSale).totalSaleProfit || 0),
        0
      );

      set({ currentProfit: totalProfit });

      // Check achievement after profit is updated
      checkAchievement();
    });

    return unsubscribe;
  },
}));
