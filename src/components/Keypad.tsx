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
  height: '64px',
  fontSize: '1.5rem',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: '#ffffff',
  color: '#333333',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f8f9fa',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
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
          color: '#e74c3c',
          fontWeight: 'bold',
          fontSize: '1.2rem',
        };
      case '⌫':
        return {
          color: '#e74c3c',
          '& svg': {
            fontSize: '1.8rem',
          }
        };
      case 'OK':
        return {
          backgroundColor: '#2ecc71',
          color: '#ffffff',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#27ae60',
          }
        };
      case '+':
        return {
          color: '#3498db',
          fontWeight: 'bold',
          fontSize: '1.8rem',
        };
      default:
        return {
          fontFamily: '"SF Mono", "Monaco", monospace',
        };
    }
  };

  const handleClick = (btn: string) => {
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
      case '':
        break;
      default:
        onInput(btn);
    }
  };

  return (
    <Grid container spacing={1.5}>
      {buttons.map((btn, index) => (
        <Grid
          item
          xs={btn === 'OK' ? 6 : 3}
          key={index}
        >
          {btn !== '' && (
            <CalcButton
              variant={btn === 'OK' ? 'contained' : 'outlined'}
              onClick={() => handleClick(btn)}
              sx={getButtonStyle(btn)}
            >
              {btn === '⌫' ? <BackspaceIcon /> : btn}
            </CalcButton>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default Keypad;