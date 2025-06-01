import React from 'react';
import { Box, Typography, styled } from '@mui/material';

interface DisplayProps {
  total: number;
  currentAmount: string;
}

const DisplayBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  marginBottom: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '8px',
}));

const AmountText = styled(Typography)({
  fontFamily: '"SF Mono", "Monaco", monospace',
  fontWeight: 'bold',
  color: '#2c3e50',
  lineHeight: 1.2,
});

const Display: React.FC<DisplayProps> = ({ total, currentAmount }) => {
  return (
    <DisplayBox>
      <AmountText variant="h4">
        ${total.toFixed(2)}
      </AmountText>
      <AmountText variant="h3">
        ${currentAmount || '0.00'}
      </AmountText>
    </DisplayBox>
  );
};

export default Display;