import { createTheme } from '@mui/material/styles';
import { blue, green, orange, purple, red } from '@mui/material/colors';

// 預設類別顏色配置
const defaultCategories = {
  food: {
    main: orange[700],
    light: orange[100],
    dark: orange[900],
    contrastText: '#fff'
  },
  daily: {
    main: blue[700],
    light: blue[100],
    dark: blue[900],
    contrastText: '#fff'
  },
  transport: {
    main: green[700],
    light: green[100],
    dark: green[900],
    contrastText: '#fff'
  },
  medical: {
    main: red[700],
    light: red[100],
    dark: red[900],
    contrastText: '#fff'
  },
  entertainment: {
    main: purple[700],
    light: purple[100],
    dark: purple[900],
    contrastText: '#fff'
  },
  others: {
    main: red[700],
    light: red[100],
    dark: red[900],
    contrastText: '#fff'
  },
};

// 創建基本主題
export const createAppTheme = (customCategories = {}) => {
  return createTheme({
    palette: {
      primary: {
        main: '#8B7355',
        light: '#A69076',
      },
      categories: {
        ...defaultCategories,
        ...customCategories,
      },
    },
  });
};

// 導出預設主題
export const theme = createAppTheme();