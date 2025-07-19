import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
// import CustomDatePicker from './CustomDatePicker';
import WebNavbarBreadcrumbs from './WebNavbarBreadcrumbs';
import WebMenuButton from './WebMenuButton';

export default function WebHeader() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <WebNavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        {/* <CustomDatePicker /> */}
        <WebMenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </WebMenuButton>
      </Stack>
    </Stack>
  );
}
