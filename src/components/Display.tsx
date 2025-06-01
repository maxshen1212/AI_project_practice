import React from 'react';
import { Paper, Typography, styled } from '@mui/material';

interface DisplayProps {
  total: number;
  currentAmount: string;
}

const DisplayBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  marginBottom: theme.spacing(2),
  backgroundColor: '#f8f9fa',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: 'none',
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
  }
}));

const AmountDisplay = styled(Typography)({
  textAlign: 'right',
  padding: '12px',
  fontFamily: '"SF Mono", "Monaco", monospace',
  letterSpacing: '1px',
});

const HistoryLabel = styled(Typography)({
  color: '#666',
  fontSize: '0.9rem',
  marginBottom: '4px',
});

const Display: React.FC<DisplayProps> = ({ total, currentAmount }) => {
  return (
    <DisplayBox>
      <HistoryLabel>上次計算結果</HistoryLabel>
      <AmountDisplay
        variant="h5"
        sx={{
          color: '#666',
          fontSize: '1.2rem',
        }}
      >
        ${total.toFixed(2)}
      </AmountDisplay>
      <AmountDisplay
        variant="h4"
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#2c3e50',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        ${currentAmount || '0.00'}
      </AmountDisplay>
    </DisplayBox>
  );
};

export default Display;