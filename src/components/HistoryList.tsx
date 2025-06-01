import React from 'react';
import { Paper, Typography, List, ListItem, styled, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface HistoryListProps {
  history: number[];
}

const HistoryPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: 'none',
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
  }
}));

const HistoryItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: '1px solid #f0f0f0',
  '&:last-child': {
    borderBottom: 'none',
  },
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#f8f9fa',
  }
}));

const AmountText = styled(Typography)({
  fontFamily: '"SF Mono", "Monaco", monospace',
  fontWeight: 500,
  letterSpacing: '1px',
  color: '#2c3e50',
});

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  return (
    <HistoryPaper>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: '#34495e',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          marginBottom: 2
        }}
      >
        <AddCircleIcon sx={{ color: '#2ecc71' }} />
        記帳歷史
      </Typography>
      <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
        {history.length === 0 ? (
          <Box sx={{
            textAlign: 'center',
            py: 4,
            color: '#95a5a6',
            fontSize: '0.9rem'
          }}>
            尚無記帳紀錄
          </Box>
        ) : (
          history.map((amount, index) => (
            <HistoryItem key={index}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" sx={{ color: '#95a5a6' }}>
                  #{history.length - index}
                </Typography>
              </Box>
              <AmountText>
                ${amount.toFixed(2)}
              </AmountText>
            </HistoryItem>
          ))
        )}
      </List>
    </HistoryPaper>
  );
};

export default HistoryList;