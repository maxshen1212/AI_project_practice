import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const drawerWidth = 240;
const closedDrawerWidth = 65;

export type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

interface SidebarProps {
  selectedItem: string;
  onItemSelect: (itemId: string) => void;
  open: boolean;
  onToggle: () => void;
}

const menuItems: MenuItem[] = [
  {
    id: 'accounting',
    label: '記帳主頁',
    icon: <AccountBalanceWalletIcon />,
  },
  {
    id: 'categories',
    label: '管理類別',
    icon: <CategoryIcon />,
  },
  {
    id: 'settings',
    label: '使用者設定',
    icon: <SettingsIcon />,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedItem, onItemSelect, open, onToggle }) => {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : closedDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : closedDrawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        {/* 頂部縮放按鈕區域 */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-end' : 'center',
          minHeight: 64,
          px: 1,
          mt: 1,
        }}>
          <IconButton
            onClick={onToggle}
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: `${theme.palette.primary.main}10`,
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}20`,
              },
            }}
          >
            {open ? (
              <MenuOpenIcon
                sx={{
                  fontSize: 28,
                  color: theme.palette.primary.main,
                }}
              />
            ) : (
              <MenuIcon
                sx={{
                  fontSize: 28,
                  color: theme.palette.primary.main,
                }}
              />
            )}
          </IconButton>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* 選單列表 */}
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <Tooltip title={!open ? item.label : ""} placement="right">
                <ListItemButton
                  selected={selectedItem === item.id}
                  onClick={() => onItemSelect(item.id)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&.Mui-selected': {
                      backgroundColor: `${theme.palette.primary.main}15`,
                      borderRight: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.main}25`,
                      },
                    },
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}10`,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: selectedItem === item.id
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      opacity: open ? 1 : 0,
                      '& .MuiListItemText-primary': {
                        color: selectedItem === item.id
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                        fontWeight: selectedItem === item.id ? 500 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;