import { createTheme } from '@mui/material/styles';

// 預設類別顏色
export const CATEGORY_COLORS = {
  BROWN: '#8B7355',      // 深棕色
  ROSEWOOD: '#9F8170',   // 玫瑰木色
  EARTH: '#A67F59',      // 土黃色
  KHAKI: '#8B7E66',      // 卡其色
  SAND: '#B38B4D',       // 沙棕色
  GRAY_BROWN: '#8E8279', // 灰棕色
} as const;

// 預設類別調色板
const defaultCategories = {
  food: {
    main: CATEGORY_COLORS.BROWN,
    light: '#A69783',
    dark: '#6F5B45',
    contrastText: '#fff'
  },
  daily: {
    main: CATEGORY_COLORS.ROSEWOOD,
    light: '#B4A397',
    dark: '#8B6F5F',
    contrastText: '#fff'
  },
  transport: {
    main: CATEGORY_COLORS.EARTH,
    light: '#BFA084',
    dark: '#8B6B4A',
    contrastText: '#fff'
  },
  medical: {
    main: CATEGORY_COLORS.KHAKI,
    light: '#A69B87',
    dark: '#6F654E',
    contrastText: '#fff'
  },
  entertainment: {
    main: CATEGORY_COLORS.SAND,
    light: '#C9A97A',
    dark: '#9F7B42',
    contrastText: '#fff'
  },
  others: {
    main: CATEGORY_COLORS.GRAY_BROWN,
    light: '#A69992',
    dark: '#776C64',
    contrastText: '#fff'
  },
};

// 預設類別資料
export const DEFAULT_CATEGORIES = [
  { id: 'food', name: '飲食', color: CATEGORY_COLORS.BROWN, icon: 'RestaurantIcon' },
  { id: 'daily', name: '日用品', color: CATEGORY_COLORS.ROSEWOOD, icon: 'ShoppingCartIcon' },
  { id: 'transport', name: '交通', color: CATEGORY_COLORS.EARTH, icon: 'DirectionsCarIcon' },
  { id: 'medical', name: '醫療', color: CATEGORY_COLORS.KHAKI, icon: 'LocalHospitalIcon' },
  { id: 'entertainment', name: '娛樂', color: CATEGORY_COLORS.SAND, icon: 'SportsEsportsIcon' },
  { id: 'others', name: '其他', color: CATEGORY_COLORS.GRAY_BROWN, icon: 'Category' },
];

// 創建基本主題
export const createAppTheme = (customCategories = {}) => {
  return createTheme({
    palette: {
      primary: {
        main: CATEGORY_COLORS.BROWN,
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