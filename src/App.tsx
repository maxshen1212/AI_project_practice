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

// 擴展主題類型定義
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

interface HistoryRecord {
  id: string;
  amount: number;
  date: Date;
  category: Category;
}

const App: React.FC = () => {
  const [currentAmount, setCurrentAmount] = useState<string>('0');
  const [total, setTotal] = useState<number>(0);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [editingRecord, setEditingRecord] = useState<HistoryRecord | null>(null);

  // 從 localStorage 讀取已保存的類別
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const savedCategories = localStorage.getItem('categories');
      return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
    } catch (error) {
      console.error('Error loading categories:', error);
      return DEFAULT_CATEGORIES;
    }
  });

  // 根據類別生成主題
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

  const [selectedPage, setSelectedPage] = useState('accounting');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 當類別變更時，保存到 localStorage 並更新主題
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

  const handleClear = () => {
    setCurrentAmount('0');
    setShowCategorySelector(false);
    setPendingAmount(null);
    setEditingRecord(null);
  };

  const handleBackspace = () => {
    if (currentAmount.length > 1) {
      setCurrentAmount(currentAmount.slice(0, -1));
    } else {
      setCurrentAmount('0');
    }
  };

  const handleOk = () => {
    const amount = parseFloat(currentAmount);
    if (!isNaN(amount)) {
      setPendingAmount(amount);
      setShowCategorySelector(true);
    }
  };

  const handleCategorySelect = (category: Category) => {
    if (editingRecord) {
      if (pendingAmount === 0) {
        handleDeleteRecord(editingRecord.id);
        setEditingRecord(null);
      } else {
        const newHistory = history.map(record => {
          if (record.id === editingRecord.id) {
            const newRecord = {
              ...record,
              amount: pendingAmount || record.amount,
              category: category
            };
            setTotal(prev => prev - record.amount + (pendingAmount || record.amount));
            return newRecord;
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
        category: category
      };
      setTotal(total + pendingAmount);
      setHistory([...history, newRecord]);
    }
    setCurrentAmount('0');
    setShowCategorySelector(false);
    setPendingAmount(null);
  };

  const handleCategoryCancel = () => {
    setShowCategorySelector(false);
    setPendingAmount(null);
    setEditingRecord(null);
    setCurrentAmount(editingRecord ? editingRecord.amount.toString() : '0');
  };

  const handleEditRecord = (record: HistoryRecord) => {
    setEditingRecord(record);
    setCurrentAmount(record.amount.toString());
    setPendingAmount(record.amount);
    setShowCategorySelector(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    const recordToDelete = history.find(record => record.id === recordId);
    if (recordToDelete) {
      setTotal(prev => prev - recordToDelete.amount);
      setHistory(history.filter(record => record.id !== recordId));
    }
  };

  const handleThemeChange = (newTheme: ReturnType<typeof createTheme>, updatedCategories: Category[]) => {
    setAppTheme(newTheme);
    setCategories(updatedCategories);
  };

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
              <CategoryManager onThemeChange={handleThemeChange} initialCategories={categories} />
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
