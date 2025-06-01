import React, { useState } from 'react';
import { Box, Container, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistoryList from './components/HistoryList';

interface HistoryRecord {
  amount: number;
  date: Date;
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1e272e',
      paper: '#2f3542',
    },
    primary: {
      main: '#3498db',
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
  const [history, setHistory] = useState<HistoryRecord[]>([]);

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
      const newRecord: HistoryRecord = {
        amount,
        date: new Date()
      };
      setTotal(total + amount);
      setHistory([...history, newRecord]);
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
              backgroundColor: 'background.paper',
              p: 3,
              borderRadius: '24px',
            }}>
              <HistoryList history={history} />
              <Keypad
                onInput={handleInput}
                onClear={handleClear}
                onBackspace={handleBackspace}
                onOk={handleOk}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
