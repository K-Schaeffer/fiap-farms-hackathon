import { useEffect, useCallback, useState } from 'react';
import { setupAuthListener, useAuthStore } from '../stores/authStore';
import { useSalesGoalStore } from '../stores/salesGoalStore';
import { useProductionGoalStore } from '../stores/productionGoalStore';
import { storage } from '../utils/storage';

export const useAuth = () => {
  return useAuthStore();
};

export const useAuthListener = () => {
  useEffect(() => {
    const unsubscribe = setupAuthListener();
    return () => unsubscribe();
  }, []);
};

export const useSalesGoal = () => {
  return useSalesGoalStore();
};

export const useProductionGoal = () => {
  return useProductionGoalStore();
};

export const useSalesGoalListener = () => {
  const { user } = useAuthStore();
  const initialize = useSalesGoalStore(state => state.initialize);
  const reset = useSalesGoalStore(state => state.reset);

  useEffect(() => {
    let unsubscribe: () => void;
    if (user?.uid) {
      unsubscribe = initialize(user.uid);
    } else {
      // Reset the store when user becomes null (logout)
      reset();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, initialize, reset]);
};

export const useProductionGoalListener = () => {
  const { user } = useAuthStore();
  const initialize = useProductionGoalStore(state => state.initialize);
  const reset = useProductionGoalStore(state => state.reset);

  useEffect(() => {
    let unsubscribe: () => void;
    if (user?.uid) {
      unsubscribe = initialize(user.uid);
    } else {
      // Reset the store when user becomes null (logout)
      reset();
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, initialize, reset]);
};

export const useNotificationReadState = () => {
  const { user, isLoading } = useAuthStore();
  const [readNotifications, setReadNotifications] = useState<Set<string>>(
    new Set()
  );

  const getStorageKey = useCallback((userId: string) => {
    return `fiap-farms-read-notifications-${userId}`;
  }, []);

  // Load read notifications from storage when user changes
  useEffect(() => {
    if (!user?.uid) {
      setReadNotifications(new Set());
      return;
    }

    const loadReadNotifications = async () => {
      try {
        const stored = await storage.getItem(getStorageKey(user.uid));
        const storedArray: string[] = stored ? JSON.parse(stored) : [];
        const storedSet = new Set<string>(storedArray);
        setReadNotifications(storedSet);
      } catch {
        setReadNotifications(new Set<string>());
      }
    };

    loadReadNotifications();
  }, [user?.uid, getStorageKey]);

  const markAsRead = useCallback(
    (notificationId: string) => {
      if (!user?.uid) return;

      setReadNotifications(prev => {
        const newSet = new Set(prev);
        newSet.add(notificationId);

        // Persist to storage asynchronously
        const persistReadState = async () => {
          try {
            await storage.setItem(
              getStorageKey(user.uid),
              JSON.stringify(Array.from(newSet))
            );
          } catch (error) {
            console.warn('Failed to save notification read state:', error);
          }
        };

        persistReadState();
        return newSet;
      });
    },
    [user?.uid, getStorageKey]
  );

  const isNotificationRead = useCallback(
    (notificationId: string): boolean => {
      return readNotifications.has(notificationId);
    },
    [readNotifications]
  );

  const clearReadState = useCallback(async () => {
    if (!user?.uid) return;

    setReadNotifications(new Set());

    try {
      await storage.removeItem(getStorageKey(user.uid));
    } catch (error) {
      console.warn('Failed to clear notification read state:', error);
    }
  }, [user?.uid, getStorageKey]);

  // Clear read state when user actually logs out (not during initialization)
  useEffect(() => {
    // Only cleanup if we're not loading and there's no user (actual logout)
    if (!isLoading && !user) {
      setReadNotifications(new Set());
      // Only clear the current session's read state, not all users
      // The aggressive multiRemove was causing issues during app rebuilds
    }
  }, [user, isLoading]);

  return {
    markAsRead,
    isNotificationRead,
    clearReadState,
  };
};
