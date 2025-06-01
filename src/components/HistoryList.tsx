// 引入必要的 React 和 Material-UI 組件
import React, { useState } from 'react';
import { Box, Typography, styled, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Category } from './CategorySelector';

// 定義單筆記錄的資料結構
interface HistoryRecord {
  id: string;          // 記錄的唯一識別碼
  amount: number;      // 金額
  date: Date;         // 日期時間
  category: Category;  // 消費類別
}

// 定義 HistoryList 組件的 props 介面
interface HistoryListProps {
  history: HistoryRecord[];                    // 記錄列表
  onEditRecord: (record: HistoryRecord) => void; // 編輯記錄的回調函數
  onDeleteRecord: (recordId: string) => void;    // 刪除記錄的回調函數
}

// 定義類別相關的 props 介面
interface CategoryProps {
  categoryId: string;  // 類別的唯一識別碼
  children?: React.ReactNode;  // 子元素
  className?: string;  // 樣式類名
}

// 基礎容器元件，用於所有記錄項目的共同樣式
const ItemContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  minWidth: 0,
  overflow: 'hidden',
});

// 記錄項目的主容器，使用網格佈局來組織內容
const RecordItem = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '90px 90px minmax(100px, 1fr) 40px', // 分別為：日期時間、類別、金額、操作按鈕
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary.light}30`,
  boxShadow: '0 1px 3px rgba(139, 115, 85, 0.05)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  '&:hover': {
    border: `1px solid ${theme.palette.primary.light}60`,
    boxShadow: '0 2px 4px rgba(139, 115, 85, 0.1)',
    transform: 'translateY(-1px)',
    '& .delete-button': {
      opacity: 1,
    }
  }
}));

// 日期時間顯示元件
const DateTimeComponent = styled(ItemContainer)(({ theme }) => ({
  gap: theme.spacing(1),
  width: '100px',
  minWidth: '100px',
  flexShrink: 0,
  '& .date': {  // 日期樣式
    fontFamily: '"SF Mono", "Monaco", monospace',
    color: theme.palette.text.primary,
    fontSize: '0.9rem',
    letterSpacing: '0.02em',
    fontWeight: 500,
  },
  '& .time': {  // 時間樣式
    fontFamily: '"SF Mono", "Monaco", monospace',
    color: theme.palette.text.secondary,
    fontSize: '0.8rem',
    letterSpacing: '0.02em',
  }
}));

// 類別顯示元件
const CategoryComponent = styled('div')<CategoryProps>(({ theme, categoryId }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1),
  borderRadius: theme.spacing(0.75),
  backgroundColor: `${theme.palette.categories[categoryId as keyof typeof theme.palette.categories].main}15`,
  border: `1px solid ${theme.palette.categories[categoryId as keyof typeof theme.palette.categories].main}30`,
  width: '85px',
  minWidth: '85px',
  flexShrink: 0,
  overflow: 'hidden',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    color: theme.palette.categories[categoryId as keyof typeof theme.palette.categories].main,
    flexShrink: 0,
  },
  '& .category-text': {
    fontSize: '0.85rem',
    letterSpacing: '0.01em',
    fontWeight: 500,
    color: theme.palette.categories[categoryId as keyof typeof theme.palette.categories].main,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    flex: 1,
  }
}));

// 金額顯示元件
const AmountComponent = styled(ItemContainer)(({ theme }) => ({
  position: 'relative',
  justifyContent: 'flex-start',
  minWidth: 0,
  flex: 1,
  '& .amount': {  // 金額文字樣式
    fontFamily: '"SF Mono", "Monaco", monospace',
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: '1.1rem',
    letterSpacing: '0.02em',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    cursor: 'pointer',
  },
  '& .currency': {  // 貨幣符號樣式
    width: '15px',
    flexShrink: 0,
    userSelect: 'none',
  },
  '& .number': {    // 數字樣式
    flex: 1,
    userSelect: 'none',
    paddingLeft: theme.spacing(1),
  },
  '& .amount-tooltip': {  // 金額提示框樣式
    position: 'fixed',
    height: '24px',
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    padding: theme.spacing(0.5, 1),
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontFamily: '"SF Mono", "Monaco", monospace',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.palette.grey[300]}`,
    zIndex: 9999,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& .label': {
      fontSize: '0.85rem',
      color: theme.palette.text.secondary,
    }
  }
}));

// 操作按鈕容器元件
const ActionComponent = styled(ItemContainer)({
  justifyContent: 'center',
  width: '40px',
  minWidth: '40px',
  flexShrink: 0,
});

// 刪除按鈕元件
const DeleteButton = styled(IconButton)(({ theme }) => ({
  opacity: 0,
  transition: 'all 0.2s ease',
  color: theme.palette.error.main,
  padding: theme.spacing(0.45),
  '&:hover': {
    backgroundColor: theme.palette.error.light + '20',
  }
}));

// 格式化日期函數：將日期轉換為 MM/DD 格式
const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
};

// 格式化時間函數：將時間轉換為 HH:MM 格式
const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 格式化金額函數：只顯示整數，超過五位數顯示省略號
const formatAmount = (amount: number): string => {
  const integerStr = Math.trunc(amount).toString();
  if (integerStr.length > 5) {
    return integerStr.slice(0, 5) + '...';
  }
  return integerStr;
};

// 歷史記錄列表主組件
const HistoryList: React.FC<HistoryListProps> = ({ history, onEditRecord, onDeleteRecord }) => {
  // 用於追蹤當前懸停的記錄項目
  const [hoveredRecordId, setHoveredRecordId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // 處理雙擊編輯事件
  const handleDoubleClick = (record: HistoryRecord) => {
    onEditRecord(record);
  };

  // 處理刪除事件
  const handleDelete = (e: React.MouseEvent, recordId: string) => {
    e.stopPropagation();
    onDeleteRecord(recordId);
  };

  return (
    // 外層容器
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2.5,
      p: 3,
      backgroundColor: 'background.default',
      borderRadius: '12px',
      border: '1.5px solid',
      borderColor: 'primary.main',
      boxShadow: '0 2px 4px rgba(139, 115, 85, 0.1)',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      {history.length === 0 ? (
        // 空記錄的顯示
        <RecordItem>
          <DateTimeComponent>
            <Typography className="date">--/--</Typography>
            <Typography className="time">--:--</Typography>
          </DateTimeComponent>
          <CategoryComponent categoryId="others">
            <Typography className="category-text">---</Typography>
          </CategoryComponent>
          <AmountComponent>
            <Typography className="amount">
              <span className="currency">$</span>
              <span className="number">0</span>
            </Typography>
          </AmountComponent>
          <ActionComponent>
            <DeleteButton
              className="delete-button"
              onClick={(e) => e.preventDefault()}
              size="small"
              sx={{ visibility: 'hidden' }}
            >
              <DeleteIcon fontSize="small" />
            </DeleteButton>
          </ActionComponent>
        </RecordItem>
      ) : (
        // 記錄列表的顯示
        [...history].reverse().map((record) => (
          <RecordItem
            key={record.id}
            onDoubleClick={() => handleDoubleClick(record)}
            data-testid={`record-${record.id}`}
          >
            {/* 日期時間區塊 */}
            <DateTimeComponent>
              <Typography className="date">{formatDate(record.date)}</Typography>
              <Typography className="time">{formatTime(record.date)}</Typography>
            </DateTimeComponent>
            {/* 類別區塊 */}
            <CategoryComponent categoryId={record.category.id}>
              {record.category.icon}
              <Typography className="category-text">{record.category.name}</Typography>
            </CategoryComponent>
            {/* 金額區塊 */}
            <AmountComponent
              onMouseEnter={(e) => {
                const amount = Math.trunc(record.amount);
                if (amount.toString().length > 5) {
                  setHoveredRecordId(record.id);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({
                    top: rect.top - 30,
                    left: rect.left + 15
                  });
                }
              }}
              onMouseLeave={() => setHoveredRecordId(null)}
              onClick={(e) => e.stopPropagation()}
            >
              <Typography
                className="amount"
                onClick={() => handleDoubleClick(record)}
              >
                <span className="currency">$</span>
                <span className="number">{formatAmount(record.amount)}</span>
              </Typography>
            </AmountComponent>
            {/* 操作按鈕區塊 */}
            <ActionComponent>
              <DeleteButton
                className="delete-button"
                onClick={(e) => handleDelete(e, record.id)}
                size="small"
                data-testid={`delete-button-${record.id}`}
              >
                <DeleteIcon fontSize="small" />
              </DeleteButton>
            </ActionComponent>
          </RecordItem>
        ))
      )}
      {hoveredRecordId && (
        <Box
          className="amount-tooltip"
          sx={{
            position: 'fixed',
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            backgroundColor: theme => theme.palette.grey[100],
            border: theme => `1px solid ${theme.palette.grey[300]}`,
            padding: '4px 8px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          ${Math.trunc(history.find(r => r.id === hoveredRecordId)?.amount || 0)}
        </Box>
      )}
    </Box>
  );
};

export default HistoryList;