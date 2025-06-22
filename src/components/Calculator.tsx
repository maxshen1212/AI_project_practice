/**
 * @file Calculator.tsx
 * @description 這是一個實現基本計算功能的 React 組件。
 * 它包含一個顯示屏，用於顯示當前輸入和計算總額，以及一個按鍵區，
 * 用於輸入數字和執行操作，如清除、退格和確認。
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Button,
  Typography,
  styled,
} from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';

/**
 * 計算機按鈕的自定義樣式組件。
 * 使用 MUI 的 `styled` API 來定義統一的按鈕外觀。
 */
const CalcButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '60px',
  fontSize: '1.5rem',
  borderRadius: '4px',
  border: '1px solid #e0e0e0',
  backgroundColor: '#ffffff',
  color: '#333333',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  }
}));

/**
 * 顯示區域的容器樣式組件。
 * 用於包裝總金額和當前輸入的顯示。
 */
const DisplayBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
  marginBottom: theme.spacing(2),
  backgroundColor: '#ffffff',
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
}));

/**
 * 用於顯示金額（總額和輸入）的文字樣式組件。
 * 設置了特定的字體和對齊方式。
 */
const AmountDisplay = styled(Typography)({
  textAlign: 'right',
  padding: '8px',
  fontFamily: 'monospace',
});

/**
 * Calculator 組件
 * 這是一個功能齊全的計算機 UI 組件。
 */
const Calculator: React.FC = () => {
  // --- 狀態管理 (State Management) ---

  /**
   * @state {string} input - 儲存使用者當前在顯示屏上輸入的數字字串。
   */
  const [input, setInput] = useState<string>('');

  /**
   * @state {number} total - 儲存所有已確認記錄的累計總額。
   */
  const [total, setTotal] = useState<number>(0);

  /**
   * @state {number[]} records - 儲存一個陣列，包含所有已透過 'OK' 按鈕確認的金額記錄。
   */
  const [records, setRecords] = useState<number[]>([]);

  // --- 事件處理 (Event Handlers) ---

  /**
   * 處理所有按鍵點擊事件。
   * @param {string} value - 被點擊按鈕的值 (例如 '7', '.', 'AC', 'OK')。
   */
  const handleInput = (value: string) => {
    switch (value) {
      // 'AC' (All Clear) 按鈕：清空當前輸入。
      case 'AC':
        setInput('');
        break;

      // 'backspace' 按鈕：刪除輸入字串的最後一個字元。
      case 'backspace':
        setInput(input.slice(0, -1));
        break;

      // 'OK' 按鈕：確認當前輸入。
      case 'OK':
        const amount = parseFloat(input); // 將輸入字串轉換為浮點數。
        // 只有在輸入是有效數字時才進行處理。
        if (!isNaN(amount)) {
          setRecords([...records, amount]); // 將當前金額加入到記錄陣列中。
          setTotal(prev => prev + amount);  // 將當前金額累加到總額中。
          setInput('');                     // 清空輸入框，準備下一次輸入。
        }
        break;

      // 預設情況：處理數字和 小數點的輸入。
      default:
        // 如果輸入的是小數點，且當前輸入中已存在小數點，則不執行任何操作。
        if (value === '.' && input.includes('.')) return;

        // 如果當前輸入為空，且使用者按下了小數點，則自動補上 "0."。
        if (value === '.' && input === '') {
          setInput('0.');
        } else {
          // 否則，將新輸入的字元拼接到現有字串後面。
          const newInput = input + value;

          // 檢查並限制小數點後只能有兩位。
          if (newInput.includes('.')) {
            const [, decimal] = newInput.split('.');
            if (decimal && decimal.length > 2) return; // 如果超過兩位，則不更新輸入。
          }
          setInput(newInput); // 更新輸入狀態。
        }
    }
  };

  // --- UI 渲染 (UI Rendering) ---

  return (
    <Box sx={{ maxWidth: 300, mx: 'auto', p: 2 }}>
      {/* 顯示區域 */}
      <DisplayBox>
        {/* 顯示總金額，格式化為兩位小數 */}
        <AmountDisplay variant="h5">
          ${total.toFixed(2)}
        </AmountDisplay>
        {/* 顯示當前輸入，如果為空則顯示 '0.00' */}
        <AmountDisplay variant="h4" sx={{ backgroundColor: '#f5f5f5' }}>
          ${input || '0.00'}
        </AmountDisplay>
      </DisplayBox>

      {/* 按鍵網格佈局 */}
      <Grid container spacing={1}>
        {/* 透過 map 迴圈動態生成數字 0-9 和 小數點的按鈕 */}
        {[7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0].map((key) => (
          <Grid item xs={3} key={key}>
            <CalcButton
              variant="outlined"
              onClick={() => handleInput(key.toString())}
            >
              {key}
            </CalcButton>
          </Grid>
        ))}

        {/* 'AC' 清除按鈕 */}
        <Grid item xs={3}>
          <CalcButton
            variant="outlined"
            onClick={() => handleInput('AC')}
            sx={{ color: 'error.main' }}
          >
            AC
          </CalcButton>
        </Grid>

        {/* 'backspace' 退格按鈕 */}
        <Grid item xs={3}>
          <CalcButton
            variant="outlined"
            onClick={() => handleInput('backspace')}
            sx={{ color: 'error.main' }}
          >
            <BackspaceIcon />
          </CalcButton>
        </Grid>

        {/* 'OK' 確認按鈕 */}
        <Grid item xs={6}>
          <CalcButton
            variant="contained"
            onClick={() => handleInput('OK')}
            sx={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#1565c0',
              }
            }}
          >
            OK
          </CalcButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calculator;