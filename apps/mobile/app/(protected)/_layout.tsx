import { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import {
  useAuth,
  useProductionGoalListener,
  useSalesGoalListener,
  useSalesGoal,
  useProductionGoal,
  useNotificationReadState,
} from '@fiap-farms/shared-stores';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MobileNotificationBadge } from '../../components/MobileNotificationBadge';
import {
  MobileNotificationMenu,
  MobileNotificationData,
} from '../../components/MobileNotificationMenu';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading, signOut, user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Notification system
  const { isSalesGoalAchieved, activeSalesGoal } = useSalesGoal();
  const { isProductionGoalAchieved, activeProductionGoal } =
    useProductionGoal();
  const { isNotificationRead, markAsRead } = useNotificationReadState();
  const [notificationMenuVisible, setNotificationMenuVisible] = useState(false);

  // Initialize goal listeners
  useProductionGoalListener();
  useSalesGoalListener();

  // Build notifications array
  const notifications: MobileNotificationData[] = [];

  if (activeSalesGoal && isSalesGoalAchieved) {
    const notificationId = `sales-goal-${activeSalesGoal.targetProfit}`;
    notifications.push({
      id: notificationId,
      title: `Achieved sales goal of $${activeSalesGoal.targetProfit}`,
      isRead: isNotificationRead(notificationId),
    });
  }

  if (activeProductionGoal && isProductionGoalAchieved) {
    const notificationId = `production-goal-${activeProductionGoal.targetYield}`;
    notifications.push({
      id: notificationId,
      title: `Achieved production goal of ${activeProductionGoal.targetYield} units`,
      isRead: isNotificationRead(notificationId),
    });
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err: unknown) {
      console.error('Logout failed:', err);
    }
  };

  const handleNotificationPress = () => {
    setNotificationMenuVisible(true);
  };

  const handleNotificationMenuDismiss = () => {
    setNotificationMenuVisible(false);
  };

  const handleNotificationRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Don't render protected content if user is not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text variant="headlineSmall" style={styles.welcomeText}>
          Hi, {user?.displayName || 'User'}
        </Text>
        <View style={styles.headerActions}>
          <MobileNotificationBadge
            onPress={handleNotificationPress}
            showBadge={unreadCount > 0}
            disabled={isLoading}
          />
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            disabled={isLoading}
          >
            Logout
          </Button>
        </View>
      </View>
      <MobileNotificationMenu
        visible={notificationMenuVisible}
        onDismiss={handleNotificationMenuDismiss}
        notifications={notifications}
        onNotificationPress={handleNotificationRead}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Sales',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: 'Products',
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  welcomeText: {
    flex: 1,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    marginLeft: 8,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
