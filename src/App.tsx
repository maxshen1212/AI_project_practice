import React, { useState } from 'react';
import { Box, Container, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistoryList from './components/HistoryList';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2ecc71',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [currentAmount, setCurrentAmount] = useState<string>('0');
  const [total, setTotal] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);

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
      setTotal(total + amount);
      setHistory([...history, amount]);
      setCurrentAmount('0');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{
            maxWidth: 400,
            mx: 'auto',
            px: 2,
          }}>
            <Display total={total} currentAmount={currentAmount} />
            <Box sx={{
              backgroundColor: '#ffffff',
              p: 3,
              borderRadius: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              mb: 2,
            }}>
              <Keypad
                onInput={handleInput}
                onClear={handleClear}
                onBackspace={handleBackspace}
                onOk={handleOk}
              />
            </Box>
            <HistoryList history={history} />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
