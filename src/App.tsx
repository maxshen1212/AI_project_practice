import React, { useState } from 'react';
import { Box, Container, ThemeProvider, createTheme, CssBaseline, Typography } from '@mui/material';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistoryList from './components/HistoryList';
import CategorySelector, { Category } from './components/CategorySelector';
import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';
import { theme as defaultTheme } from './theme';
import { CategoryManager } from './components/CategoryManager';
import Sidebar from './components/Sidebar';

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

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F5F2ED',
      paper: '#FFFFFF',
    },
    primary: {
      main: '#8B7355',
      light: '#A69783',
      dark: '#6F5B45',
    },
    secondary: {
      main: '#9F8170',
      light: '#B4A397',
      dark: '#8B6F5F',
    },
    text: {
      primary: '#5C4033',
      secondary: '#8B7355',
    },
    categories: {
      food: {
        main: '#8B7355',
        light: '#A69783',
        dark: '#6F5B45',
        contrastText: '#FFFFFF',
      },
      daily: {
        main: '#9F8170',
        light: '#B4A397',
        dark: '#8B6F5F',
        contrastText: '#FFFFFF',
      },
      transport: {
        main: '#A67F59',
        light: '#BFA084',
        dark: '#8B6B4A',
        contrastText: '#FFFFFF',
      },
      medical: {
        main: '#8B7E66',
        light: '#A69B87',
        dark: '#6F654E',
        contrastText: '#FFFFFF',
      },
      entertainment: {
        main: '#B38B4D',
        light: '#C9A97A',
        dark: '#9F7B42',
        contrastText: '#FFFFFF',
      },
      others: {
        main: '#8E8279',
        light: '#A69992',
        dark: '#776C64',
        contrastText: '#FFFFFF',
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
      letterSpacing: '0.02em',
      color: '#5C4033',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.01em',
      color: '#5C4033',
    },
    body2: {
      fontSize: '0.9rem',
      letterSpacing: '0.01em',
      color: '#5C4033',
    },
  },
  spacing: (factor: number) => `${factor * 8}px`,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '12px 16px',
          borderRadius: '8px',
          '&.MuiButton-outlined': {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [currentAmount, setCurrentAmount] = useState<string>('0');
  const [total, setTotal] = useState<number>(0);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [editingRecord, setEditingRecord] = useState<HistoryRecord | null>(null);
  const [theme, setTheme] = useState(defaultTheme);
  const [selectedPage, setSelectedPage] = useState('accounting');
  const [categories, setCategories] = useState<Category[]>([
    { id: 'food', name: '飲食', color: '#f57c00' },
    { id: 'daily', name: '日用品', color: '#1976d2' },
    { id: 'transport', name: '交通', color: '#388e3c' },
    { id: 'medical', name: '醫療', color: '#d32f2f' },
    { id: 'entertainment', name: '娛樂', color: '#7b1fa2' },
    { id: 'others', name: '其他', color: '#757575' },
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    setTheme(newTheme);
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
              <CategoryManager onThemeChange={handleThemeChange} />
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
    <ThemeProvider theme={theme}>
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
            py: 6,
            px: 3,
            ml: sidebarOpen ? '240px' : '65px',
            transition: theme => theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Container maxWidth="md">
            {renderContent()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
