import React from 'react';
import { Box, Typography } from '@mui/material';

interface DisplayProps {
  total: number;
  currentAmount: string;
}

const Display: React.FC<DisplayProps> = ({ total, currentAmount }) => {
  return (
    <Box sx={{
      backgroundColor: 'background.paper',
      borderRadius: '16px',
      p: { xs: 2, sm: 3, md: 4 },
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: 1,
          fontSize: { xs: '0.9rem', sm: '1rem' }
        }}
      >
        總支出
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 500,
          color: 'text.primary',
          mb: 2,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
        }}
      >
        {total.toLocaleString()} 元
      </Typography>
      <Typography
        variant="body1"
        sx={{
          textAlign: 'right',
          color: 'text.primary',
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }
        }}
      >
        {currentAmount}
      </Typography>
    </Box>
  );
};

export default Display;