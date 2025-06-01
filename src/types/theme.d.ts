import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomPaletteColor extends PaletteColor {}
  interface CustomPaletteColorOptions extends PaletteColorOptions {}

  interface Palette {
    categories: {
      [key: string]: CustomPaletteColor;
    };
  }

  interface PaletteOptions {
    categories?: {
      [key: string]: CustomPaletteColorOptions;
    };
  }
}