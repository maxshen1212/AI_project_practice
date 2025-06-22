/**
 * @file Keypad.tsx
 * @description
 * 這是一個計算機按鍵區的 React 組件。
 * 它提供了一個 4x4 的網格佈局，包含數字鍵、功能鍵（清除、退格）和確認鍵。
 * 使用者點擊按鈕時，會透過 props 中的回呼函式通知上層組件執行相應的操作。
 */
import React from 'react';
import { Grid, Button, styled } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';

/**
 * @interface KeypadProps
 * @description 定義 Keypad 組件所需的回呼函式 props。
 */
interface KeypadProps {
  /** 當使用者輸入數字或小數點時觸發 */
  onInput: (value: string) => void;
  /** 當使用者點擊 'AC' (全部清除) 按鈕時觸發 */
  onClear: () => void;
  /** 當使用者點擊退格按鈕時觸發 */
  onBackspace: () => void;
  /** 當使用者點擊 'OK' (確認) 按鈕時觸發 */
  onOk: () => void;
}

/**
 * @constant CalcButton
 * @description
 * 按鍵的自定義樣式組件。
 * 使用 MUI 的 `styled` API 來創建具有統一外觀和懸停效果的按鈕。
 */
const CalcButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '80px',
  fontSize: '2rem',
  fontWeight: '500',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 4px rgba(139, 115, 85, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 8px rgba(139, 115, 85, 0.15)',
  }
}));

/**
 * Keypad 組件
 * @param {KeypadProps} props - 組件的 props
 */
const Keypad: React.FC<KeypadProps> = ({
  onInput,
  onClear,
  onBackspace,
  onOk
}) => {
  /**
   * @constant buttons
   * @description
   * 定義按鍵的佈局和顯示文字。
   * 陣列中的空字串 '' 用於佔位，讓佈局保持完整。
   */
  const buttons = [
    '7', '8', '9', 'AC',
    '4', '5', '6', '⌫',
    '1', '2', '3', 'OK',
    '.', '0', '+', ''
  ];

  /**
   * 根據按鈕的類型返回特定的樣式。
   * 這使得功能鍵（如 AC, OK）可以有不同於數字鍵的特殊外觀。
   * @param {string} btn - 按鈕的文字或標識符。
   * @returns {object} 返回一個 MUI `sx` prop 可接受的樣式物件。
   */
  const getButtonStyle = (btn: string) => {
    switch (btn) {
      case 'AC':
        return {
          backgroundColor: '#A67F59',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#8B6B4A',
          }
        };
      case '⌫':
        return {
          backgroundColor: '#9F8170',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#8B6F5F',
          }
        };
      case 'OK':
        return {
          backgroundColor: '#8B7355',
          color: '#FFFFFF',
          height: '100%', // 使 OK 按鈕填滿其佔用的兩行空間
          '&:hover': {
            backgroundColor: '#6F5B45',
          }
        };
      case '+':
        // '+' 鍵在此佈局中可能是一個擴展功能，這裡只定義了基本樣式。
        return {
          fontSize: '2rem',
          color: '#8B7355',
        };
      default:
        // 預設情況（數字鍵和小數點）返回空物件，使用 CalcButton 的基礎樣式。
        return {};
    }
  };

  // --- UI 渲染 (UI Rendering) ---
  return (
    <Grid container spacing={1.5}>
      {/* 遍歷 buttons 陣列，為每個元素生成一個按鈕 */}
      {buttons.map((btn, index) => (
        <Grid
          item
          xs={3} // 每個網格項佔用 3/12 的寬度，即每行 4 個
          key={index}
          // 特殊佈局：讓 'OK' 按鈕佔據兩行的空間
          sx={btn === 'OK' ? { gridRow: 'span 2' } : {}}
        >
          {/* 如果按鈕文字不是空字串，則渲染按鈕 */}
          {btn !== '' && (
            <CalcButton
              // 根據按鈕的類型，決定點擊時要呼叫哪個上層的回呼函式
              onClick={() => {
                switch (btn) {
                  case 'AC':
                    onClear();
                    break;
                  case '⌫':
                    onBackspace();
                    break;
                  case 'OK':
                    onOk();
                    break;
                  default:
                    onInput(btn);
                }
              }}
              // 應用特殊樣式
              sx={getButtonStyle(btn)}
            >
              {/* 如果是退格鍵，顯示圖示；否則，顯示文字 */}
              {btn === '⌫' ? <BackspaceIcon sx={{ fontSize: '2rem' }} /> : btn}
            </CalcButton>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default Keypad;