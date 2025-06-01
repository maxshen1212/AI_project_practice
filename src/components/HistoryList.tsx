import React from 'react';
import { Box, Typography, styled } from '@mui/material';

interface HistoryRecord {
  amount: number;
  date: Date;
}

interface HistoryListProps {
  history: HistoryRecord[];
}

const HistoryBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#3498db',
  borderRadius: '12px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  maxHeight: '120px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '3px',
  }
}));

const HistoryItem = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
  '&:not(:last-child)': {
    opacity: 0.7,
  }
});

const DateTimeContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '2px',
});

const DateText = styled(Typography)({
  fontFamily: '"SF Mono", "Monaco", monospace',
  color: '#ffffff',
  fontSize: '1rem',
  opacity: 0.9,
});

const TimeText = styled(Typography)({
  fontFamily: '"SF Mono", "Monaco", monospace',
  color: '#ffffff',
  fontSize: '0.85rem',
  opacity: 0.7,
});

const AmountText = styled(Typography)({
  fontFamily: '"SF Mono", "Monaco", monospace',
  fontWeight: 'bold',
  color: '#ffffff',
  textAlign: 'right',
  fontSize: '1.5rem',
  lineHeight: '2rem',
});

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  return (
    <HistoryBox>
      {history.length === 0 ? (
        <HistoryItem>
          <DateTimeContainer>
            <DateText>----/--/--</DateText>
            <TimeText>--:--</TimeText>
          </DateTimeContainer>
          <AmountText>$0.00</AmountText>
        </HistoryItem>
      ) : (
        [...history].reverse().map((record, index) => (
          <HistoryItem key={index}>
            <DateTimeContainer>
              <DateText>{formatDate(record.date)}</DateText>
              <TimeText>{formatTime(record.date)}</TimeText>
            </DateTimeContainer>
            <AmountText>
              ${record.amount.toFixed(2)}
            </AmountText>
          </HistoryItem>
        ))
      )}
    </HistoryBox>
  );
};

export default HistoryList;