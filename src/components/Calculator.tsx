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

const DisplayBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
  marginBottom: theme.spacing(2),
  backgroundColor: '#ffffff',
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
}));

const AmountDisplay = styled(Typography)({
  textAlign: 'right',
  padding: '8px',
  fontFamily: 'monospace',
});

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [records, setRecords] = useState<number[]>([]);

  const handleInput = (value: string) => {
    switch (value) {
      case 'AC':
        setInput('');
        break;
      case 'backspace':
        setInput(input.slice(0, -1));
        break;
      case 'OK':
        const amount = parseFloat(input);
        if (!isNaN(amount)) {
          setRecords([...records, amount]);
          setTotal(prev => prev + amount);
          setInput('');
        }
        break;
      default:
        // 限制小數點後兩位
        if (value === '.' && input.includes('.')) return;
        if (value === '.' && input === '') {
          setInput('0.');
        } else {
          const newInput = input + value;
          if (newInput.includes('.')) {
            const [, decimal] = newInput.split('.');
            if (decimal && decimal.length > 2) return;
          }
          setInput(newInput);
        }
    }
  };

  return (
    <Box sx={{ maxWidth: 300, mx: 'auto', p: 2 }}>
      <DisplayBox>
        <AmountDisplay variant="h5">
          ${total.toFixed(2)}
        </AmountDisplay>
        <AmountDisplay variant="h4" sx={{ backgroundColor: '#f5f5f5' }}>
          ${input || '0.00'}
        </AmountDisplay>
      </DisplayBox>

      <Grid container spacing={1}>
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
        <Grid item xs={3}>
          <CalcButton
            variant="outlined"
            onClick={() => handleInput('AC')}
            sx={{ color: 'error.main' }}
          >
            AC
          </CalcButton>
        </Grid>
        <Grid item xs={3}>
          <CalcButton
            variant="outlined"
            onClick={() => handleInput('backspace')}
            sx={{ color: 'error.main' }}
          >
            <BackspaceIcon />
          </CalcButton>
        </Grid>
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