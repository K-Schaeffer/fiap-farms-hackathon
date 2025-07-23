import type { AppProps } from 'next/app';
import '@fiap-farms/web-ui/global.css';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import {
  useAuthListener,
  useAuth,
  useProductionGoalListener,
  useSalesGoalListener,
  useSalesGoal,
  useProductionGoal,
  useNotificationReadState,
} from '@fiap-farms/shared-stores';
import { AuthGuard } from '../components/AuthGuard';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {
  WebAppNavbar,
  WebHeader,
  WebSideMenu,
  WebNotificationsData,
} from '@fiap-farms/web-ui';
import { usePublicRoute } from '../hooks/usePublicRoute';
import { useBreadcrumbs } from '../hooks/useBreadcrumbs';
import { useNavigation } from '../hooks/useNavigation';
import Head from 'next/head';

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const breadcrumbs = useBreadcrumbs();
  const { navigationItems, onNavigate, currentPath } = useNavigation();
  const { isSalesGoalAchieved, activeSalesGoal } = useSalesGoal();
  const { isProductionGoalAchieved, activeProductionGoal } =
    useProductionGoal();
  const { isNotificationRead, markAsRead } = useNotificationReadState();

  const notifications: WebNotificationsData[] = [];

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

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <WebSideMenu
        user={user}
        onLogout={signOut}
        navigationItems={navigationItems}
        onNavigate={onNavigate}
        currentPath={currentPath}
      />
      <WebAppNavbar
        user={user}
        onLogout={signOut}
        title={breadcrumbs.title}
        navigationItems={navigationItems}
        onNavigate={onNavigate}
        currentPath={currentPath}
        notifications={notifications}
        onNotificationRead={markAsRead}
      />
      <WebHeader
        breadcrumbs={breadcrumbs}
        notifications={notifications}
        onNotificationRead={markAsRead}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: 'calc(100% - 240px)' }, // Account for sidebar width
          maxWidth: '100%', // Prevent content overflow
          overflow: 'hidden', // Prevent horizontal overflow
        }}
      >
        <Stack
          spacing={2}
          sx={{
            mx: { xs: 1, sm: 2, md: 3 }, // Responsive margin
            pb: 5,
            mt: { xs: 8, md: 8 }, // Add top margin for fixed header on desktop
            maxWidth: '100%', // Ensure stack doesn't overflow
            overflow: 'hidden', // Prevent overflow
          }}
        >
          {children}
        </Stack>
      </Box>
    </Box>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  useAuthListener();
  useProductionGoalListener();
  useSalesGoalListener();
  const { isPublic } = usePublicRoute();
  const breadcrumbs = useBreadcrumbs();

  return (
    <>
      <Head>
        <title>FIAP Farms - {breadcrumbs.title}</title>
      </Head>
      <AppCacheProvider {...pageProps}>
        <AuthGuard>
          {isPublic ? (
            <Component {...pageProps} />
          ) : (
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          )}
        </AuthGuard>
      </AppCacheProvider>
    </>
  );
}
