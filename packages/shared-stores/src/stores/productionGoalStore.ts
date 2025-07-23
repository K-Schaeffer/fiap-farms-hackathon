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
import {
  ProductionGoalState,
  StoreProductionGoal,
  StoreProductionItem,
} from '../types';

const db = getFirebaseDb();

export const useProductionGoalStore = create<ProductionGoalState>(
  (set, get) => ({
    activeProductionGoal: null,
    currentYield: 0,
    isProductionGoalAchieved: false,
    reset: () => {
      set({
        activeProductionGoal: null,
        currentYield: 0,
        isProductionGoalAchieved: false,
      });
    },

    initialize: (ownerId: string) => {
      // Helper function to check achievement
      const checkAchievement = () => {
        const { activeProductionGoal, currentYield, isProductionGoalAchieved } =
          get();
        if (
          !isProductionGoalAchieved &&
          activeProductionGoal &&
          currentYield >= activeProductionGoal.targetYield
        ) {
          set({ isProductionGoalAchieved: true });
        }
      };

      // Load the goal
      const goalRef = doc(db, 'goals', 'goal_prod_jul_2025'); // Hardcoded for MVP
      getDoc(goalRef).then(docSnap => {
        if (docSnap.exists() && docSnap.data()?.type === 'production') {
          set({ activeProductionGoal: docSnap.data() as StoreProductionGoal });
          // Check achievement after goal is loaded
          checkAchievement();
        }
      });

      // Set up production listener
      const productionQuery = query(
        collection(db, 'production_items'),
        where('ownerId', '==', ownerId),
        where('status', '==', 'harvested')
      );

      const unsubscribe = onSnapshot(productionQuery, snapshot => {
        const totalYield = snapshot.docs.reduce(
          (sum, doc) => sum + ((doc.data() as StoreProductionItem).yield || 0),
          0
        );

        set({ currentYield: totalYield });

        // Check achievement after yield is updated
        checkAchievement();
      });

      return unsubscribe;
    },
  })
);
