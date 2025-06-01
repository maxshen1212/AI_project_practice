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
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '8px',
  border: `1.5px solid ${theme.palette.primary.light}30`,
  boxShadow: '0 4px 6px rgba(139, 115, 85, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    border: `1.5px solid ${theme.palette.primary.light}60`,
    boxShadow: '0 6px 8px rgba(139, 115, 85, 0.15)',
  }
}));

const AmountText = styled(Typography)(({ theme }) => ({
  fontFamily: '"SF Mono", "Monaco", monospace',
  fontWeight: '600',
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  letterSpacing: '0.02em',
}));

const Display: React.FC<DisplayProps> = ({ total, currentAmount }) => {
  return (
    <DisplayBox>
      <AmountText variant="h4" sx={{ opacity: 0.85 }}>
        ${total}
      </AmountText>
      <AmountText variant="h3">
        ${currentAmount || '0.00'}
      </AmountText>
    </DisplayBox>
  );
};

export default Display;