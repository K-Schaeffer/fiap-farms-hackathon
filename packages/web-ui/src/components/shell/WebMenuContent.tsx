import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React from 'react';

import { WebNavigationItem, WebMenuContentProps } from '.';

export function WebMenuContent({
  currentPath = '/',
  onNavigate = () => {},
  navigationItems,
}: WebMenuContentProps) {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  // Auto-expand parent items based on current path
  React.useEffect(() => {
    const newExpandedItems: string[] = [];

    if (!navigationItems) return;

    navigationItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          child => child.href === currentPath
        );
        if (hasActiveChild) {
          newExpandedItems.push(item.text);
        }
      }
    });
    setExpandedItems(newExpandedItems);
  }, [currentPath, navigationItems]);

  const handleToggleExpand = (itemText: string) => {
    setExpandedItems(prev =>
      prev.includes(itemText)
        ? prev.filter(item => item !== itemText)
        : [...prev, itemText]
    );
  };

  const isItemActive = (href?: string) => href === currentPath;
  const isParentActive = (children?: WebNavigationItem[]) =>
    children?.some(child => child.href === currentPath) || false;

  const renderWebNavigationItem = (item: WebNavigationItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.text);
    const isActive =
      isItemActive(item.href) || (hasChildren && isParentActive(item.children));

    return (
      <React.Fragment key={item.text}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            selected={isActive}
            onClick={() => {
              if (hasChildren) {
                handleToggleExpand(item.text);
              } else if (item.href) {
                onNavigate(item.href);
              }
            }}
            sx={{ pl: depth * 2 + 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child =>
                renderWebNavigationItem(child, depth + 1)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {navigationItems
          ? navigationItems.map(item => renderWebNavigationItem(item))
          : []}
      </List>
    </Stack>
  );
}
