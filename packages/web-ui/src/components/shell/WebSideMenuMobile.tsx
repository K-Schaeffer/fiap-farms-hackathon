import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { WebMenuContent } from './WebMenuContent';
import { WebSideMenuUser } from './index';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
  user?: WebSideMenuUser | null;
  onLogout?: () => Promise<void>;
}

export function WebSideMenuMobile({
  open,
  toggleDrawer,
  user,
  onLogout,
}: SideMenuMobileProps) {
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

  const handleLogout = async () => {
    if (onLogout) {
      try {
        await onLogout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={userName}
              src={userAvatarUrl || undefined}
              sx={{ width: 24, height: 24 }}
            >
              {!userAvatarUrl && getAvatarInitials()}
            </Avatar>
            <Stack>
              <Typography
                component="p"
                variant="h6"
                sx={{ lineHeight: '20px' }}
              >
                {userName}
              </Typography>
              {userEmail && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {userEmail}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <WebMenuContent />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
