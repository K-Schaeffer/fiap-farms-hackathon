import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
// import CustomDatePicker from './CustomDatePicker';
import { WebNavbarBreadcrumbs } from './WebNavbarBreadcrumbs';
import { WebMenuButton } from './WebMenuButton';

export function WebHeader() {
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
          <WebNavbarBreadcrumbs />
          <Stack
            direction="row"
            sx={{
              gap: 1,
              pr: 1, // Add right padding for badge
            }}
          >
            {/* <CustomDatePicker /> */}
            <WebMenuButton showBadge aria-label="Open notifications">
              <NotificationsRoundedIcon />
            </WebMenuButton>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
