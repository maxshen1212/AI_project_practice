/**
 * @file Display.tsx
 * @description
 * 這是一個用於顯示總支出和當前輸入金額的 React 組件。
 * 它是一個純粹的展示組件，負責將從上層傳入的數據以格式化的方式呈現給使用者。
 */
import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * @interface DisplayProps
 * @description 定義 Display 組件所需的 props。
 */
interface DisplayProps {
  /** 應用程式的總支出金額 */
  total: number;
  /** 使用者當前在計算機上輸入的金額字串 */
  currentAmount: string;
}

/**
 * Display 組件
 * @param {DisplayProps} props - 組件的 props，包含 total 和 currentAmount。
 */
const Display: React.FC<DisplayProps> = ({ total, currentAmount }) => {
  // --- UI 渲染 (UI Rendering) ---
  return (
    // 主容器，使用 Box 組件設定背景、圓角、內邊距和陰影，使其具有卡片外觀。
    <Box sx={{
      backgroundColor: 'background.paper',
      borderRadius: '16px',
      p: { xs: 2, sm: 3, md: 4 }, // 響應式內邊距
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}>
      {/* "總支出" 標題文字 */}
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: 1,
          fontSize: { xs: '0.9rem', sm: '1rem' } // 響應式字體大小
        }}
      >
        總支出
      </Typography>

      {/* 顯示總支出金額 */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 500,
          color: 'text.primary',
          mb: 2,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } // 響應式字體大小
        }}
      >
        {/* 使用 toLocaleString() 來為數字加上千分位分隔符，增加可讀性 */}
        {total.toLocaleString()} 元
      </Typography>

      {/* 顯示使用者當前輸入的金額 */}
      <Typography
        variant="body1"
        sx={{
          textAlign: 'right', // 文字靠右對齊，模擬計算機顯示
          color: 'text.primary',
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' } // 響應式字體大小
        }}
      >
        {currentAmount}
      </Typography>
    </Box>
  );
};

export default Display;