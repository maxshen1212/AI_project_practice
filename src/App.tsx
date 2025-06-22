/**
 * @file App.tsx
 * @description
 * 這是應用程式的根組件，也是所有組件的樞紐。
 * 它負責管理整個應用的核心狀態，包括：
 * - 當前輸入的金額
 * - 所有的記帳歷史記錄
 * - 所有可用的支出類別
 * - 應用程式的主題和頁面導覽
 *
 * 它也定義了所有處理使用者互動的函式，並將狀態和函式作為 props 傳遞給子組件。
 */
import React, { useState, useEffect } from 'react';
import { Box, Container, ThemeProvider, createTheme, CssBaseline, Typography, IconButton } from '@mui/material';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistoryList from './components/HistoryList';
import CategorySelector, { Category } from './components/CategorySelector';
import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';
import { theme as defaultTheme, DEFAULT_CATEGORIES, createAppTheme } from './theme';
import { CategoryManager } from './components/CategoryManager';
import Sidebar from './components/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

/**
 * @description
 * 透過 TypeScript 的模組擴展（Module Augmentation）功能，
 * 為 Material-UI 的預設主題類型（Palette and PaletteOptions）新增自定義的 `categories` 屬性。
 * 這使得我們可以在整個應用的主題中，安全地使用像 `theme.palette.categories.food` 這樣的自訂顏色。
 */
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

/**
 * @interface HistoryRecord
 * @description 定義單一記帳記錄物件的資料結構。
 */
interface HistoryRecord {
  id: string;
  amount: number;
  date: Date;
  categoryId: string;
}

/**
 * App 根組件
 */
const App: React.FC = () => {
  // --- 狀態管理 (State Management) ---

  /** @state {string} currentAmount - 使用者在數字鍵盤上當前輸入的金額字串 */
  const [currentAmount, setCurrentAmount] = useState<string>('0');

  /**
   * @state {HistoryRecord[]} history - 所有的記帳記錄。
   * 初始化時，會嘗試從 `localStorage` 讀取已儲存的記錄。
   * `try-catch` 區塊用於處理可能的 JSON 解析錯誤。
   * `map` 用於將從 localStorage 讀取出的日期字串轉換回 Date 物件。
   */
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const savedHistory = localStorage.getItem('history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        return parsedHistory.map((record: any) => ({
          ...record,
          date: new Date(record.date),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  });

  /** @state {number} total - 總支出金額，此狀態會由 useEffect 根據 history 自動計算 */
  const [total, setTotal] = useState<number>(0);
  /** @state {boolean} showCategorySelector - 控制是否顯示類別選擇畫面 */
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  /** @state {number | null} pendingAmount - 當使用者按下 OK 後，臨時儲存待處理的金額 */
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  /** @state {HistoryRecord | null} editingRecord - 如果使用者正在編輯一筆記錄，這裡會儲存該記錄的物件 */
  const [editingRecord, setEditingRecord] = useState<HistoryRecord | null>(null);

  /**
   * @state {Category[]} categories - 所有可用的類別。
   * 初始化時，會嘗試從 `localStorage` 讀取使用者自訂的類別。
   * 如果讀取失敗或不存在，則使用 `DEFAULT_CATEGORIES` 作為預設值。
   */
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const savedCategories = localStorage.getItem('categories');
      return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
    } catch (error) {
      console.error('Error loading categories:', error);
      return DEFAULT_CATEGORIES;
    }
  });

  /**
   * @state {Theme} appTheme - 應用程式的 Material-UI 主題物件。
   * 初始化時，會根據 `categories` 狀態動態生成主題。
   */
  const [appTheme, setAppTheme] = useState(() => {
    const customCategories = categories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: {
        main: cat.color,
        light: cat.color + '20',
        dark: cat.color,
        contrastText: '#fff'
      }
    }), {});
    return createAppTheme(customCategories);
  });

  /** @state {string} selectedPage - 當前顯示的頁面 ID (例如 'accounting', 'categories') */
  const [selectedPage, setSelectedPage] = useState('accounting');
  /** @state {boolean} sidebarOpen - 控制側邊欄的展開與收合狀態 */
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- 副作用處理 (Side Effects) ---

  /**
   * @effect
   * 當 `categories` 狀態改變時觸發。
   * 1. 將最新的類別列表儲存到 `localStorage`。
   * 2. 根據新的類別列表重新生成並更新應用程式的主題。
   */
  useEffect(() => {
    try {
      localStorage.setItem('categories', JSON.stringify(categories));
      const customCategories = categories.reduce((acc, cat) => ({
        ...acc,
        [cat.id]: {
          main: cat.color,
          light: cat.color + '20',
          dark: cat.color,
          contrastText: '#fff'
        }
      }), {});
      setAppTheme(createAppTheme(customCategories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }, [categories]);

  /**
   * @effect
   * 當 `history` 狀態改變時觸發，將最新的歷史記錄儲存到 `localStorage`。
   */
  useEffect(() => {
    try {
      localStorage.setItem('history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }, [history]);

  /**
   * @effect
   * 當 `history` 狀態改變時觸發，自動重新計算總支出金額。
   * 這確保了 `total` 永遠與 `history` 的內容保持同步。
   */
  useEffect(() => {
    setTotal(history.reduce((acc, record) => acc + record.amount, 0));
  }, [history]);

  // --- 事件處理函式 (Event Handlers) ---

  /** 處理數字鍵盤的輸入 */
  const handleInput = (value: string) => {
    if (currentAmount === '0' && value !== '.') {
      setCurrentAmount(value);
    } else {
      if (value === '.' && currentAmount.includes('.')) return;
      if (value === '.' && currentAmount === '0') {
        setCurrentAmount('0.');
      } else {
        const newAmount = currentAmount + value;
        if (newAmount.includes('.')) {
          const [, decimal] = newAmount.split('.');
          if (decimal && decimal.length > 2) return;
        }
        setCurrentAmount(newAmount);
      }
    }
  };

  /** 處理 'AC' 清除按鈕 */
  const handleClear = () => {
    setCurrentAmount('0');
    setShowCategorySelector(false);
    setPendingAmount(null);
    setEditingRecord(null);
  };

  /** 處理退格按鈕 */
  const handleBackspace = () => {
    if (currentAmount.length > 1) {
      setCurrentAmount(currentAmount.slice(0, -1));
    } else {
      setCurrentAmount('0');
    }
  };

  /** 處理 'OK' 確認按鈕，觸發類別選擇 */
  const handleOk = () => {
    const amount = parseFloat(currentAmount);
    if (!isNaN(amount)) {
      setPendingAmount(amount);
      setShowCategorySelector(true);
    }
  };

  /** 處理在類別選擇畫面選擇一個類別後的操作 */
  const handleCategorySelect = (category: Category) => {
    if (editingRecord) {
      if (pendingAmount === 0) {
        handleDeleteRecord(editingRecord.id);
        setEditingRecord(null);
      } else {
        const newHistory = history.map(record => {
          if (record.id === editingRecord.id) {
            return {
              ...record,
              amount: pendingAmount || record.amount,
              categoryId: category.id
            };
          }
          return record;
        });
        setHistory(newHistory);
        setEditingRecord(null);
      }
    } else if (pendingAmount !== null && pendingAmount !== 0) {
      const newRecord: HistoryRecord = {
        id: Date.now().toString(),
        amount: pendingAmount,
        date: new Date(),
        categoryId: category.id
      };
      setHistory([...history, newRecord]);
    }
    setCurrentAmount('0');
    setShowCategorySelector(false);
    setPendingAmount(null);
  };

  /** 處理在類別選擇畫面點擊取消 */
  const handleCategoryCancel = () => {
    setShowCategorySelector(false);
    setPendingAmount(null);
    setEditingRecord(null);
    setCurrentAmount(editingRecord ? editingRecord.amount.toString() : '0');
  };

  /** 處理在歷史列表中點擊編輯按鈕 */
  const handleEditRecord = (record: HistoryRecord) => {
    setEditingRecord(record);
    setCurrentAmount(record.amount.toString());
    setPendingAmount(record.amount);
    setShowCategorySelector(true);
  };

  /** 處理在歷史列表中點擊刪除按鈕 */
  const handleDeleteRecord = (recordId: string) => {
    setHistory(history.filter(record => record.id !== recordId));
  };

  /** 處理從 CategoryManager 傳來的類別刪除請求 */
  const handleDeleteCategory = (categoryId: string, deleteRecords: boolean) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);

    if (deleteRecords) {
      setHistory(history.filter(record => record.categoryId !== categoryId));
    } else {
      const othersCategory = categories.find(cat => cat.id === 'others');
      if (othersCategory) {
        const updatedHistory = history.map(record => {
          if (record.categoryId === categoryId) {
            return { ...record, categoryId: othersCategory.id };
          }
          return record;
        });
        setHistory(updatedHistory);
      }
    }
  };

  /** 處理從 CategoryManager 傳來的類別變更，以更新主題 */
  const handleThemeChange = (newTheme: ReturnType<typeof createTheme>, updatedCategories: Category[]) => {
    setAppTheme(newTheme);
    setCategories(updatedCategories);
  };

  /**
   * 根據 `selectedPage` 狀態，動態渲染主內容區域的函式。
   * @returns {React.ReactElement}
   */
  const renderContent = () => {
    switch (selectedPage) {
      case 'categories':
        return (
          <Box sx={{ p: 4 }}>
            <Box sx={{
              backgroundColor: 'background.paper',
              p: 4,
              borderRadius: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>類別管理</Typography>
              </Box>
              <CategoryManager
                onThemeChange={handleThemeChange}
                initialCategories={categories}
                onDeleteCategory={handleDeleteCategory}
              />
            </Box>
          </Box>
        );
      case 'settings':
        return (
          <Box sx={{ p: 4 }}>
            <Box sx={{
              backgroundColor: 'background.paper',
              p: 4,
              borderRadius: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>使用者設定</Typography>
              <p>設定頁面開發中...</p>
            </Box>
          </Box>
        );
      case 'accounting':
      default:
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Display total={total} currentAmount={currentAmount} />
            </Box>
            <Box sx={{
              backgroundColor: 'background.paper',
              p: 4,
              borderRadius: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
              {showCategorySelector ? (
                <CategorySelector
                  onSelect={handleCategorySelect}
                  onCancel={handleCategoryCancel}
                  amount={pendingAmount?.toString() || '0'}
                  isEditing={!!editingRecord}
                  categories={categories}
                />
              ) : (
                <>
                  <HistoryList
                    history={history}
                    onEditRecord={handleEditRecord}
                    onDeleteRecord={handleDeleteRecord}
                    categories={categories}
                  />
                  <Box sx={{ mt: 4 }}>
                    <Keypad
                      onInput={handleInput}
                      onClear={handleClear}
                      onBackspace={handleBackspace}
                      onOk={handleOk}
                    />
                  </Box>
                </>
              )}
            </Box>
          </>
        );
    }
  };

  // --- 主渲染區 (Main Render) ---
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar
          selectedItem={selectedPage}
          onItemSelect={setSelectedPage}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: '100vh',
            backgroundColor: 'background.default',
            py: { xs: 2, sm: 4, md: 6 },
            px: { xs: 1, sm: 2, md: 3 },
            ml: {
              xs: 0,
              md: sidebarOpen ? '240px' : '65px'
            },
            transition: theme => theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '64px',
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              px: 2,
              backgroundColor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
              zIndex: 1100,
            }}
          >
            <IconButton
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ color: 'primary.main' }}
            >
              {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
          <Box sx={{ mt: { xs: '64px', md: 0 } }}>
            <Container maxWidth="md">
              {renderContent()}
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
