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
  fontWeight: 'bold',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: '#2f3542',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#3d4453',
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
          backgroundColor: '#e67e22',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#d35400',
          }
        };
      case '⌫':
        return {
          backgroundColor: '#f1c40f',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#f39c12',
          }
        };
      case 'OK':
        return {
          backgroundColor: '#3498db',
          color: '#ffffff',
          height: '100%',
          '&:hover': {
            backgroundColor: '#2980b9',
          }
        };
      case '+':
        return {
          fontSize: '2rem',
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