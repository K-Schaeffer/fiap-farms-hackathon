import { useEffect, useState } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import {
  useAuth,
  useProductionGoalListener,
  useSalesGoalListener,
  useSalesGoal,
  useProductionGoal,
  useNotificationReadState,
} from '@fiap-farms/shared-stores';
import { View, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Text,
  Button,
  IconButton,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MobileNotificationBadge,
  MobileNotificationMenu,
  MobileNotificationData,
} from '../../components';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading, signOut, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
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

  // Dynamic header configuration based on route
  const getHeaderConfig = () => {
    switch (pathname) {
      case '/sales-dashboard':
        return {
          title: 'Sales Dashboard',
          showBackButton: true,
          showUser: false,
        };
      case '/new-sale':
        return {
          title: 'New Sale',
          showBackButton: true,
          showUser: false,
        };
      case '/products-dashboard':
        return {
          title: 'Products Dashboard',
          showBackButton: true,
          showUser: false,
        };
      case '/production-management':
        return {
          title: 'Prod. Management',
          showBackButton: true,
          showUser: false,
        };
      default:
        return {
          title: `Hi, ${user?.displayName || 'User'}`,
          showBackButton: false,
          showUser: true,
        };
    }
  };

  const headerConfig = getHeaderConfig();

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

  const handleGoBack = () => {
    router.back();
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
      {/* Dynamic Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.leftSection}>
          {headerConfig.showBackButton && (
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={handleGoBack}
              style={styles.backButton}
            />
          )}
          <Text variant="headlineSmall" style={styles.headerTitle}>
            {headerConfig.title}
          </Text>
        </View>
        <View style={styles.rightSection}>
          <MobileNotificationBadge
            onPress={handleNotificationPress}
            showBadge={unreadCount > 0}
            disabled={isLoading}
          />
          {headerConfig.showUser && (
            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
              disabled={isLoading}
            >
              Logout
            </Button>
          )}
        </View>
      </View>

      <MobileNotificationMenu
        visible={notificationMenuVisible}
        onDismiss={handleNotificationMenuDismiss}
        notifications={notifications}
        onNotificationPress={handleNotificationRead}
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sales-dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="new-sale" options={{ headerShown: false }} />
        <Stack.Screen
          name="products-dashboard"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="production-management"
          options={{ headerShown: false }}
        />
      </Stack>
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
    paddingHorizontal: 8,
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
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logoutButton: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
