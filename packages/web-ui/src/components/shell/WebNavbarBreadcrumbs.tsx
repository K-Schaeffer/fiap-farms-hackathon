import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { BreadcrumbsData } from './';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

interface WebNavbarBreadcrumbsProps {
  breadcrumbs: BreadcrumbsData;
}

export function WebNavbarBreadcrumbs({
  breadcrumbs,
}: WebNavbarBreadcrumbsProps) {
  const { items } = breadcrumbs;
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {items.map((item, index) => (
        <Typography
          key={index}
          variant="body1"
          sx={{
            color:
              index === items.length - 1 ? 'text.primary' : 'text.secondary',
            fontWeight: index === items.length - 1 ? 600 : 400,
          }}
        >
          {item.label}
        </Typography>
      ))}
    </StyledBreadcrumbs>
  );
}
