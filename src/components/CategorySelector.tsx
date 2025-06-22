/**
 * @file CategorySelector.tsx
 * @description
 * 這是一個用於選擇支出類別的 React 組件。
 * 當使用者在計算機輸入金額並按下確認後，此組件會顯示，
 * 提供一個包含所有可用類別的按鈕列表。使用者點擊某個類別後，
 * 會觸發一個回呼函式，將選擇的類別傳遞給上層組件。
 */
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import * as Icons from '@mui/icons-material';

/**
 * @type Category
 * @description 定義單一類別物件的資料結構。
 * 這是在整個應用程式中共享的類型定義。
 */
export type Category = {
  id: string;      // 唯一識別碼
  name: string;    // 類別名稱
  color: string;   // 代表顏色 (HEX 格式)
  icon?: string;   // 圖示名稱 (來自 @mui/icons-material)
};

/**
 * @interface CategorySelectorProps
 * @description 定義 CategorySelector 組件所需的 props。
 */
interface CategorySelectorProps {
  /** 當使用者選擇一個類別時觸發的回呼函式 */
  onSelect: (category: Category) => void;
  /** 當使用者點擊取消按鈕時觸發的回呼函式 */
  onCancel: () => void;
  /** 從上層傳入的待處理金額，將顯示在標題中 */
  amount: string;
  /** 標記目前是否為編輯模式，會影響標題的顯示文字 */
  isEditing?: boolean;
  /** 所有可用的類別列表 */
  categories: Category[];
}

/**
 * CategorySelector 組件
 * @param {CategorySelectorProps} props - 組件的 props
 */
const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelect,
  onCancel,
  amount,
  isEditing = false,
  categories
}) => {
  /**
   * 根據圖示名稱字串，動態渲染對應的 Material-UI 圖示組件。
   * @param {string | undefined} iconName - 圖示的名稱，例如 'Fastfood'。
   * @returns {React.ReactElement | null} 返回圖示組件或 null。
   */
  const renderCategoryIcon = (iconName: string | undefined) => {
    if (!iconName) return null;
    // 使用索引簽名從 Icons 物件中動態獲取圖示組件。
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  /**
   * 對類別列表進行排序。
   * 主要目的是確保 'others' (其他) 這個特殊類別永遠顯示在列表的最後。
   * 其他類別則按其名稱的字母順序排序。
   */
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.id === 'others') return 1;    // 如果 a 是 'others'，將其往後排。
    if (b.id === 'others') return -1;   // 如果 b 是 'others'，將其往後排 (即 a 在前)。
    return a.name.localeCompare(b.name); // 其他情況按名稱排序。
  });

  // --- UI 渲染 (UI Rendering) ---
  return (
    <Box>
      {/* 標題，根據 isEditing prop 顯示不同的文字 */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {isEditing ? '編輯支出' : '新增支出'}: {amount} 元
      </Typography>

      {/* 類別按鈕的網格容器 */}
      <Box sx={{
        display: 'grid',
        // 響應式網格佈局：
        // 在小螢幕 (xs) 上，每行 1 個按鈕。
        // 在中等螢幕 (sm, md) 上，每行 2 個按鈕。
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)'
        },
        gap: { xs: 1.5, sm: 2 }, // 按鈕之間的間距
        maxHeight: { xs: '60vh', sm: '400px' }, // 限制最大高度，超出部分可滾動
        overflowY: 'auto', // 允許垂直滾動
        padding: '4px' // 內邊距，防止滾動條緊貼按鈕
      }}>
        {/* 遍歷排序後的類別列表，為每個類別生成一個按鈕 */}
        {sortedCategories.map(category => (
          <Button
            key={category.id}
            variant="contained"
            onClick={() => onSelect(category)}
            startIcon={renderCategoryIcon(category.icon)}
            sx={{
              // 按鈕的背景顏色直接使用類別的顏色
              backgroundColor: category.color,
              // 滑鼠懸停時保持顏色不變，僅降低透明度
              '&:hover': {
                backgroundColor: category.color,
                opacity: 0.8,
              },
              // 響應式按鈕高度和字體大小
              height: { xs: '50px', sm: '60px' },
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              textTransform: 'none', // 取消文字大寫轉換
              // 處理長文字，防止換行
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              // 調整圖示和文字之間的距離以及圖示本身的大小
              '& .MuiButton-startIcon': {
                marginRight: { xs: 1, sm: 1.5 },
                '& > svg': {
                  fontSize: { xs: 20, sm: 24 },
                }
              }
            }}
          >
            {category.name}
          </Button>
        ))}
      </Box>

      {/* 取消按鈕 */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} variant="outlined">
          取消
        </Button>
      </Box>
    </Box>
  );
};

export default CategorySelector;