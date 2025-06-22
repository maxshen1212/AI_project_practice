/**
 * @file IconSelector.tsx
 * @description
 * 這是一個提供圖示選擇功能的 React 組件。它顯示一個按鈕，
 * 點擊後會彈出一個對話框，裡面包含了所有可用的 Material-UI 圖示。
 * 使用者可以在對話框中搜尋並選擇一個圖示。
 */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Grid,
  Tooltip,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * @constant iconList
 * @description
 * 動態生成所有可用的 Material-UI 圖示列表。
 * 1. `Object.keys(Icons)`: 獲取 `@mui/icons-material` 導出的所有圖示名稱。
 * 2. `.filter(...)`: 過濾掉非圖示的導出（如 'default'）以及不同樣式變體的圖示（如 Outlined, Rounded 等），只保留基礎樣式的圖示。
 * 3. `.map(...)`: 將圖示名稱轉換為包含名稱和對應 React 組件的物件陣列。
 */
const iconList = Object.keys(Icons)
  .filter(key => key !== 'default' && !key.includes('Outlined') && !key.includes('Rounded') && !key.includes('Sharp') && !key.includes('TwoTone'))
  .map(key => ({
    name: key,
    component: (Icons as any)[key] // 使用索引簽名動態獲取圖示組件
  }));

/**
 * @interface IconSelectorProps
 * @description 定義 IconSelector 組件所需的 props。
 */
interface IconSelectorProps {
  /** 當使用者選擇一個圖示時觸發的回呼函式 */
  onSelect: (iconName: string) => void;
  /** 目前已選擇的圖示名稱（可選） */
  selectedIcon?: string;
  /** 圖示的顏色（可選），會影響觸發按鈕和對話框中選中圖示的顏色 */
  color?: string;
}

/**
 * IconSelector 組件
 * @param {IconSelectorProps} props - 組件的 props
 */
const IconSelector: React.FC<IconSelectorProps> = ({ onSelect, selectedIcon, color }) => {
  // --- 狀態管理 (State Management) ---

  /** @state {boolean} open - 控制圖示選擇對話框的開啟與關閉 */
  const [open, setOpen] = useState(false);
  /** @state {string} searchTerm - 儲存使用者在搜尋框中輸入的文字 */
  const [searchTerm, setSearchTerm] = useState('');

  // --- 邏輯處理 (Logic) ---

  /**
   * @constant filteredIcons
   * @description 根據搜尋關鍵字過濾後的圖示列表。
   * 搜尋不區分大小寫。
   */
  const filteredIcons = iconList.filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * 處理單個圖示的點擊事件。
   * @param {string} iconName - 被點擊圖示的名稱。
   */
  const handleIconClick = (iconName: string) => {
    onSelect(iconName); // 透過回呼函式通知上層組件
    setOpen(false);     // 關閉對話框
  };

  /**
   * @constant SelectedIcon
   * @description 根據 props 傳入的 selectedIcon 名稱，動態獲取對應的圖示組件。
   */
  const SelectedIcon = selectedIcon ? (Icons as any)[selectedIcon] : null;

  // --- UI 渲染 (UI Rendering) ---
  return (
    <>
      {/* 觸發按鈕：點擊此按鈕會打開圖示選擇對話框 */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          width: 48,
          height: 48,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          color: color || 'inherit', // 優先使用傳入的 color prop
        }}
      >
        {/* 如果有已選圖示，則顯示它；否則，顯示一個預設的搜尋圖示 */}
        {SelectedIcon ? <SelectedIcon /> : <SearchIcon />}
      </IconButton>

      {/* 圖示選擇對話框 */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          選擇圖示
          {/* 搜尋框 */}
          <TextField
            size="small"
            placeholder="搜尋圖示..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ ml: 2, width: 200 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />
        </DialogTitle>
        <DialogContent>
          {/* 顯示所有過濾後圖示的網格容器 */}
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {filteredIcons.map(({ name, component: Icon }) => (
              <Grid item key={name}>
                {/* 使用 Tooltip 在滑鼠懸停時顯示圖示名稱 */}
                <Tooltip title={name}>
                  <IconButton
                    onClick={() => handleIconClick(name)}
                    sx={{
                      // 動態設定顏色和背景，以突顯當前選中的圖示
                      color: selectedIcon === name ? color : 'inherit',
                      backgroundColor: selectedIcon === name ? `${color}15` : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedIcon === name ? `${color}25` : 'action.hover',
                      },
                    }}
                  >
                    <Icon />
                  </IconButton>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IconSelector;