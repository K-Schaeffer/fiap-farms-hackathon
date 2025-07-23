import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { WebNavbarBreadcrumbs } from './WebNavbarBreadcrumbs';
import { WebMenuButton } from './WebMenuButton';
import { WebHeaderProps } from './';
import React from 'react';

export function WebHeader({
  breadcrumbs,
  notifications,
  onNotificationRead,
}: WebHeaderProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: {
    id: string;
    title: string;
    isRead?: boolean;
  }) => {
    if (onNotificationRead && !notification.isRead) {
      onNotificationRead(notification.id);
    }
    handleMenuClose();
  };

  // Count unread notifications for badge
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: 'none', md: 'block' },
        boxShadow: 0,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 'var(--template-frame-height, 0px)',
        left: { md: '240px' }, // Account for sidebar width
        width: { md: 'calc(100% - 240px)' }, // Adjust width for sidebar
        zIndex: theme => theme.zIndex.drawer - 1, // Below drawer but above content
      }}
    >
      <Toolbar
        sx={{
          minHeight: { md: '64px' },
          px: 3, // Consistent padding
        }}
      >
        <Stack
          direction="row"
          sx={{
            width: '100%',
            maxWidth: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          spacing={2}
        >
          <WebNavbarBreadcrumbs breadcrumbs={breadcrumbs} />
          <Stack
            direction="row"
            sx={{
              gap: 1,
              pr: 1, // Add right padding for badge
            }}
          >
            <WebMenuButton showBadge={unreadCount > 0} onClick={handleMenuOpen}>
              <NotificationsRoundedIcon />
            </WebMenuButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              disableScrollLock
            >
              {notifications && notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <MenuItem
                    key={notification.id || index}
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      fontWeight: notification.isRead ? 'normal' : 'bold',
                      opacity: notification.isRead ? 0.7 : 1,
                    }}
                  >
                    {notification.title}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No new notifications</MenuItem>
              )}
            </Menu>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
