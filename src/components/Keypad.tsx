import React from 'react';
import { Grid, Button, styled } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';

interface KeypadProps {
  onInput: (value: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onOk: () => void;
}

const CalcButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '80px',
  fontSize: '2rem',
  fontWeight: '500',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 4px rgba(139, 115, 85, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 8px rgba(139, 115, 85, 0.15)',
  }
}));

const Keypad: React.FC<KeypadProps> = ({
  onInput,
  onClear,
  onBackspace,
  onOk
}) => {
  const buttons = [
    '7', '8', '9', 'AC',
    '4', '5', '6', '⌫',
    '1', '2', '3', 'OK',
    '.', '0', '+', ''
  ];

  const getButtonStyle = (btn: string) => {
    switch (btn) {
      case 'AC':
        return {
          backgroundColor: '#A67F59',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#8B6B4A',
          }
        };
      case '⌫':
        return {
          backgroundColor: '#9F8170',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#8B6F5F',
          }
        };
      case 'OK':
        return {
          backgroundColor: '#8B7355',
          color: '#FFFFFF',
          height: '100%',
          '&:hover': {
            backgroundColor: '#6F5B45',
          }
        };
      case '+':
        return {
          fontSize: '2rem',
          color: '#8B7355',
        };
      default:
        return {};
    }
  };

  return (
    <Grid container spacing={1.5}>
      {buttons.map((btn, index) => (
        <Grid
          item
          xs={btn === 'OK' ? 3 : 3}
          key={index}
          sx={btn === 'OK' ? { gridRow: 'span 2' } : {}}
        >
          {btn !== '' && (
            <CalcButton
              onClick={() => {
                switch (btn) {
                  case 'AC':
                    onClear();
                    break;
                  case '⌫':
                    onBackspace();
                    break;
                  case 'OK':
                    onOk();
                    break;
                  default:
                    onInput(btn);
                }
              }}
              sx={getButtonStyle(btn)}
            >
              {btn === '⌫' ? <BackspaceIcon sx={{ fontSize: '2rem' }} /> : btn}
            </CalcButton>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default Keypad;