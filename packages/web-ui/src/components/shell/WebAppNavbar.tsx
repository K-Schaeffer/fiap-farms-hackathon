import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
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
}: WebAppNavbarProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

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
          <WebMenuButton showBadge aria-label="Open notifications">
            <NotificationsRoundedIcon />
          </WebMenuButton>
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
