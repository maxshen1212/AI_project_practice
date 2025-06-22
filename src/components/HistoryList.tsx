/**
 * @file HistoryList.tsx
 * @description
 * 這是一個用於顯示記帳歷史列表的 React 組件。
 * 它會遍歷傳入的記帳記錄，並為每一筆記錄顯示其金額、類別名稱和圖示。
 * 使用者可以透過此組件對單筆記錄進行編輯或刪除。
 */
import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Icons from '@mui/icons-material';
import { Category } from './CategorySelector';

/**
 * @interface HistoryRecord
 * @description 定義單一記帳記錄物件的資料結構。
 * 注意：這裡只儲存 `categoryId` 而不是整個 category 物件，以避免資料冗餘。
 */
interface HistoryRecord {
  id: string;         // 唯一識別碼
  amount: number;     // 金額
  date: Date;         // 記錄日期
  categoryId: string; // 對應的類別 ID
}

/**
 * @interface HistoryListProps
 * @description 定義 HistoryList 組件所需的 props。
 */
interface HistoryListProps {
  /** 所有的記帳記錄陣列 */
  history: HistoryRecord[];
  /** 當使用者點擊編輯按鈕時觸發的回呼函式 */
  onEditRecord: (record: any) => void;
  /** 當使用者點擊刪除按鈕時觸發的回呼函式 */
  onDeleteRecord: (recordId: string) => void;
  /** 所有可用的類別列表，用於根據 categoryId 查找類別資訊 */
  categories: Category[];
}

/**
 * HistoryList 組件
 * @param {HistoryListProps} props - 組件的 props
 */
const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onEditRecord,
  onDeleteRecord,
  categories
}) => {
  // 如果沒有任何歷史記錄，則顯示提示文字。
  if (history.length === 0) {
    return <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>尚無紀錄</Typography>;
  }

  /**
   * 根據類別 ID 從完整的類別列表中查找對應的類別物件。
   * @param {string} id - 要查找的類別 ID。
   * @returns {Category | undefined} 返回找到的類別物件，如果找不到則返回 undefined。
   */
  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  // --- UI 渲染 (UI Rendering) ---
  return (
    <List>
      {/* 遍歷 history 陣列，為每一筆記錄渲染一個 ListItem */}
      {history.map(record => {
        // 根據記錄中的 categoryId 查找對應的類別物件。
        const category = getCategoryById(record.categoryId);
        // 如果找到了類別且類別有圖示，則動態獲取圖示組件。
        const CategoryIcon = category?.icon ? (Icons as any)[category.icon] : null;

        return (
          <ListItem
            key={record.id}
            sx={{
              backgroundColor: 'background.paper',
              mb: 1,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* 如果有圖示，則顯示圖示，其顏色與類別顏色一致。 */}
            {CategoryIcon && category && (
              <CategoryIcon
                sx={{
                  color: category.color,
                  mr: 2,
                  fontSize: 24,
                }}
              />
            )}
            {/* 顯示金額和類別名稱。如果找不到類別，則顯示 '其他'。 */}
            <ListItemText
              primary={`$${record.amount}`}
              secondary={category ? category.name : '其他'}
            />
            {/* 編輯和刪除按鈕的容器 */}
            <Box>
              {/* 點擊編輯按鈕時，將完整的記錄資訊（包括查找到的 category 物件）傳遞給上層組件 */}
              <IconButton onClick={() => onEditRecord({ ...record, category })}>
                <EditIcon />
              </IconButton>
              {/* 點擊刪除按鈕時，只傳遞記錄的 ID */}
              <IconButton onClick={() => onDeleteRecord(record.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};

export default HistoryList;