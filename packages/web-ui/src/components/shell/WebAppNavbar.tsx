import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { WebSideMenuMobile } from './WebSideMenuMobile';
import { WebMenuButton } from './WebMenuButton';
import { WebAppNavbarProps } from './index';

const Toolbar = styled(MuiToolbar)({
  width: '100%',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: '8px',
    p: '8px',
    pb: 0,
  },
});

export function WebAppNavbar({
  user,
  onLogout,
  title,
  currentPath,
  onNavigate,
  navigationItems,
  notifications,
  onNotificationRead,
}: WebAppNavbarProps) {
  const [open, setOpen] = React.useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const notificationMenuOpen = Boolean(notificationAnchorEl);
  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationClick = (notification: {
    id: string;
    title: string;
    isRead?: boolean;
  }) => {
    if (onNotificationRead && !notification.isRead) {
      onNotificationRead(notification.id);
    }
    handleNotificationMenuClose();
  };

  // Count unread notifications for badge
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: 'auto', md: 'none' },
        boxShadow: 0,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 'var(--template-frame-height, 0px)',
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 1,
          }}
        >
          <WebMenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </WebMenuButton>
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'center', flexGrow: 1 }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ color: 'text.primary' }}
            >
              {title || 'Dashboard'}
            </Typography>
          </Stack>
          <WebMenuButton
            showBadge={unreadCount > 0}
            onClick={handleNotificationMenuOpen}
            aria-label="Open notifications"
          >
            <NotificationsRoundedIcon />
          </WebMenuButton>
          <Menu
            anchorEl={notificationAnchorEl}
            open={notificationMenuOpen}
            onClose={handleNotificationMenuClose}
            disableScrollLock
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {notifications && notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <MenuItem
                  key={notification.id || index}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    fontWeight: notification.isRead ? 'normal' : 'bold',
                    opacity: notification.isRead ? 0.7 : 1,
                    maxWidth: '280px', // Limit width for mobile
                    whiteSpace: 'normal', // Allow text wrapping
                  }}
                >
                  {notification.title}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No new notifications</MenuItem>
            )}
          </Menu>
          <WebSideMenuMobile
            open={open}
            toggleDrawer={toggleDrawer}
            user={user}
            onLogout={onLogout}
            currentPath={currentPath}
            onNavigate={onNavigate}
            navigationItems={navigationItems}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
