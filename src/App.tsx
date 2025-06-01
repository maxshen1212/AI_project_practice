import React, { useState } from 'react';
import { Box, Container, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistoryList from './components/HistoryList';
import CategorySelector, { Category } from './components/CategorySelector';
import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';

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
    } else if (pendingAmount !== null) {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: 6,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{
            maxWidth: 440,
            mx: 'auto',
          }}>
            <Display total={total} currentAmount={currentAmount} />
            <Box sx={{
              backgroundColor: 'background.paper',
              p: 4,
              borderRadius: '16px',
              mt: 3,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
              {showCategorySelector ? (
                <CategorySelector
                  onSelect={handleCategorySelect}
                  onCancel={handleCategoryCancel}
                  amount={pendingAmount?.toFixed(2) || '0.00'}
                  isEditing={!!editingRecord}
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
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
