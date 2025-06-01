/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('渲染記帳應用程式', () => {
  render(<App />);
  // 檢查總金額顯示（使用 h3 標籤）
  const totalAmount = screen.getByRole('heading', { level: 3 });
  expect(totalAmount).toHaveTextContent('$0');
});
