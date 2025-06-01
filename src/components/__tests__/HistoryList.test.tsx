import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import type { PaletteColor, PaletteColorOptions } from '@mui/material';
import HistoryList from '../HistoryList';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import type { Category } from '../CategorySelector';

// 定義記錄的類型
interface HistoryRecord {
  id: string;          // 記錄的唯一識別碼
  amount: number;      // 金額
  date: Date;         // 日期時間
  category: {         // 消費類別
    id: string;       // 類別ID
    name: string;     // 類別名稱
    icon: JSX.Element; // 類別圖標
  };
}

// 擴展主題類型以包含自定義類別
declare module '@mui/material/styles' {
  interface Palette {
    categories: {
      food: PaletteColor;
      daily: PaletteColor;
      transport: PaletteColor;
      medical: PaletteColor;
      entertainment: PaletteColor;
      others: PaletteColor;
    };
  }
  interface PaletteOptions {
    categories?: {
      food: PaletteColorOptions;
      daily: PaletteColorOptions;
      transport: PaletteColorOptions;
      medical: PaletteColorOptions;
      entertainment: PaletteColorOptions;
      others: PaletteColorOptions;
    };
  }
}

// 創建測試用的主題
const theme = createTheme({
  palette: {
    background: {
      default: '#F5F2ED', // 預設背景色
      paper: '#FFFFFF',   // 紙張背景色
    },
    text: {
      primary: '#5C4033',   // 主要文字顏色
      secondary: '#8B7355', // 次要文字顏色
    },
    categories: {
      food: {
        main: '#FF5722',
        light: '#FFCCBC',
        dark: '#E64A19',
        contrastText: '#FFFFFF'
      },
      daily: {
        main: '#4CAF50',
        light: '#C8E6C9',
        dark: '#388E3C',
        contrastText: '#FFFFFF'
      },
      transport: {
        main: '#2196F3',
        light: '#BBDEFB',
        dark: '#1976D2',
        contrastText: '#FFFFFF'
      },
      medical: {
        main: '#F44336',
        light: '#FFCDD2',
        dark: '#D32F2F',
        contrastText: '#FFFFFF'
      },
      entertainment: {
        main: '#9C27B0',
        light: '#E1BEE7',
        dark: '#7B1FA2',
        contrastText: '#FFFFFF'
      },
      others: {
        main: '#9E9E9E',
        light: '#F5F5F5',
        dark: '#616161',
        contrastText: '#FFFFFF'
      }
    },
  },
});

// 創建測試用的記錄數據
const mockHistory: HistoryRecord[] = [
  {
    id: '1',
    amount: 100,
    date: new Date('2024-03-20T10:30:00'),
    category: {
      id: 'food',
      name: '飲食',
      icon: <RestaurantIcon />,
    },
  },
  {
    id: '2',
    amount: 40,
    date: new Date('2024-03-21T10:30:00'),
    category: {
      id: 'daily',
      name: '日用品',
      icon: <ShoppingBasketIcon />,
    },
  },
  {
    id: '3',
    amount: 40,
    date: new Date('2024-03-21T10:30:00'),
    category: {
      id: 'daily',
      name: '日用品',
      icon: <ShoppingBasketIcon />,
    },
  },
  {
    id: '4',
    amount: 100,
    date: new Date('2024-03-21T10:30:00'),
    category: {
      id: 'food',
      name: '飲食',
      icon: <RestaurantIcon />,
    },
  },
];

// 歷史記錄列表組件的測試套件
describe('HistoryList', () => {
  // 模擬編輯和刪除的回調函數
  const mockOnEditRecord = jest.fn();
  const mockOnDeleteRecord = jest.fn();

  // 每個測試前重置所有模擬函數
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 封裝渲染函數，提供主題支援
  const renderHistoryList = (history: HistoryRecord[] = []) => {
    const utils = render(
      <ThemeProvider theme={theme}>
        <HistoryList
          history={history}
          onEditRecord={mockOnEditRecord}
          onDeleteRecord={mockOnDeleteRecord}
        />
      </ThemeProvider>
    );
    return { ...utils };
  };

  // 測試空記錄狀態的顯示
  test('空記錄時顯示預設狀態', () => {
    renderHistoryList();
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  // 測試金額的顯示
  test('顯示記錄的金額', () => {
    renderHistoryList(mockHistory);
    // 檢查金額 40 的記錄
    const amount40Elements = screen.getAllByText(/40/);
    expect(amount40Elements).toHaveLength(2);

    // 檢查金額 100 的記錄
    const amount100Elements = screen.getAllByText(/100/);
    expect(amount100Elements).toHaveLength(2);
  });

  // 測試類別的顯示
  test('顯示記錄的類別', () => {
    renderHistoryList(mockHistory);
    // 檢查飲食類別
    const foodCategories = screen.getAllByText('飲食');
    expect(foodCategories).toHaveLength(2);
    expect(foodCategories[0]).toBeInTheDocument();

    // 檢查日用品類別
    const dailyCategories = screen.getAllByText('日用品');
    expect(dailyCategories).toHaveLength(2);
    expect(dailyCategories[0]).toBeInTheDocument();
  });

  // 測試刪除功能
  test('點擊刪除按鈕時調用刪除函數', () => {
    renderHistoryList(mockHistory);
    const deleteButton = screen.getByTestId('delete-button-1');
    fireEvent.click(deleteButton);
    expect(mockOnDeleteRecord).toHaveBeenCalledWith('1');
  });

  // 測試編輯功能
  test('雙擊記錄時調用編輯函數', () => {
    renderHistoryList(mockHistory);
    const record = screen.getByTestId('record-1');
    fireEvent.doubleClick(record);
    expect(mockOnEditRecord).toHaveBeenCalledWith(mockHistory[0]);
  });
});