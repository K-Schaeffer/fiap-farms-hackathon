import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { WebMenuContent } from './WebMenuContent';
import { WebOptionsMenu } from './WebOptionsMenu';
import { WebSideMenuProps } from './index';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  marginTop: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export function WebSideMenu({
  user,
  onLogout,
  currentPath,
  onNavigate,
  navigationItems,
}: WebSideMenuProps) {
  // Extract user information with fallbacks
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const userAvatarUrl = user?.photoURL;

  // Generate avatar initials from display name or email
  const getAvatarInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <WebMenuContent
          currentPath={currentPath}
          onNavigate={onNavigate}
          navigationItems={navigationItems}
        />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={userName}
          src={userAvatarUrl || undefined}
          sx={{ width: 36, height: 36 }}
        >
          {!userAvatarUrl && getAvatarInitials()}
        </Avatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: '16px' }}
          >
            {userName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {userEmail}
          </Typography>
        </Box>
        <WebOptionsMenu onLogout={onLogout} />
      </Stack>
    </Drawer>
  );
}
