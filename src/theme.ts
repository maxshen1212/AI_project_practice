import { createTheme } from '@mui/material/styles';
import { blue, green, orange, purple, red } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Palette {
    categories: {
      [key: string]: {
        main: string;
        light: string;
      };
    };
  }
  interface PaletteOptions {
    categories: {
      [key: string]: {
        main: string;
        light: string;
      };
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8B7355',
      light: '#A69076',
    },
    categories: {
      food: {
        main: orange[700],
        light: orange[100],
      },
      daily: {
        main: blue[700],
        light: blue[100],
      },
      transport: {
        main: green[700],
        light: green[100],
      },
      entertainment: {
        main: purple[700],
        light: purple[100],
      },
      others: {
        main: red[700],
        light: red[100],
      },
    },
  },
});