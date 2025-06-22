/**
 * @file Sidebar.tsx
 * @description
 * 這是應用程式的側邊導覽欄組件。
 * 它實現了響應式設計：在桌面裝置上，它是一個可以展開和收合的永久側邊欄；
 * 在行動裝置上，它則是一個從螢幕邊緣滑出的臨時抽屜。
 * 它負責顯示主要的導覽項目，並處理使用者的頁面切換操作。
 */
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
  useMediaQuery,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

// --- 常數定義 ---
const drawerWidth = 240; // 側邊欄展開時的寬度
const closedDrawerWidth = 65; // 側邊欄收合時的寬度

/**
 * @type MenuItem
 * @description 定義單一導覽項目物件的資料結構。
 */
export type MenuItem = {
  id: string; // 唯一識別碼，用於狀態管理
  label: string; // 顯示的文字
  icon: React.ReactNode; // 顯示的圖示組件
};

/**
 * @interface SidebarProps
 * @description 定義 Sidebar 組件所需的 props。
 */
interface SidebarProps {
  /** 目前選中的項目 ID */
  selectedItem: string;
  /** 當使用者選擇一個新項目時觸發的回呼函式 */
  onItemSelect: (item: string) => void;
  /** 側邊欄是否為展開狀態 */
  open: boolean;
  /** 當使用者點擊切換按鈕時觸發的回呼函式 */
  onToggle: () => void;
}

/**
 * @constant menuItems
 * @description 導覽欄中所有項目的設定。
 */
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

/**
 * Sidebar 組件
 * @param {SidebarProps} props - 組件的 props
 */
const Sidebar: React.FC<SidebarProps> = ({
  selectedItem,
  onItemSelect,
  open,
  onToggle,
}) => {
  // --- Hooks ---
  const theme = useTheme();
  // 使用 useMediaQuery hook 來判斷當前是否為行動裝置尺寸（小於 md）
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * @constant drawerContent
   * @description 側邊欄的主要內容，被桌面版和行動版共用一部分。
   */
  const drawerContent = (
    <>
      {/* 頂部的切換按鈕容器 */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        p: 1,
        minHeight: '64px' // 與頂部 App Bar 高度對齊
      }}>
        <IconButton onClick={onToggle}>
          {open ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      {/* 導覽項目列表 */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedItem === item.id}
              onClick={() => {
                onItemSelect(item.id);
                // 在行動裝置上，選擇項目後自動關閉側邊欄
                if (isMobile) onToggle();
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              {/* 當側邊欄收合時，使用 Tooltip 在滑鼠懸停時顯示項目文字 */}
              <Tooltip title={!open ? item.label : ''} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto', // 展開時圖示與文字有間距，收合時自動置中
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
              {/* 只有在側邊欄展開時才顯示項目文字 */}
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  // --- UI 渲染 (UI Rendering) ---
  return (
    <Box component="nav">
      {/* 根據是否為行動裝置，渲染不同行為的 Drawer */}
      {isMobile ? (
        // 行動裝置版本：臨時抽屜，會覆蓋在內容之上
        <Drawer
          variant="temporary"
          open={open}
          onClose={onToggle} // 點擊遮罩層時關閉
          ModalProps={{
            keepMounted: true, // 提升行動裝置上的性能
          }}
          sx={{
            display: { xs: 'block', md: 'none' }, // 只在行動裝置尺寸顯示
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: 'background.paper',
              mt: '64px', // 為頂部工具列留出空間
              height: 'calc(100% - 64px)', // 調整高度以不遮擋頂部工具列
            },
          }}
        >
          {/* 在行動裝置上，直接渲染一個簡化的列表，不包含收合邏輯 */}
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    selected={selectedItem === item.id}
                    onClick={() => {
                      onItemSelect(item.id);
                      if (isMobile) onToggle();
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: 'initial',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2,
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      ) : (
        // 桌面版本：永久側邊欄，會將主內容推開
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            display: { xs: 'none', md: 'block' }, // 只在桌面尺寸顯示
            '& .MuiDrawer-paper': {
              // 根據 open 狀態切換寬度，並帶有過渡動畫
              width: open ? drawerWidth : closedDrawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden', // 隱藏水平滾動條
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {/* 渲染包含完整邏輯（收合、Tooltip等）的內容 */}
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;