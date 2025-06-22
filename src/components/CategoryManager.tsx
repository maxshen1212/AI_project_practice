/**
 * @file CategoryManager.tsx
 * @description
 * 這是一個用於管理記帳類別的 React 組件。它允許使用者新增、編輯和刪除類別。
 * 當類別的顏色被修改時，它會觸發一個主題更新。當類別被刪除時，
 * 它會提供一個選項，讓使用者決定是否同時刪除該類別下的所有記帳記錄。
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import * as Icons from '@mui/icons-material';
import { createAppTheme, DEFAULT_CATEGORIES } from '../theme';
import IconSelector from './IconSelector';

/**
 * @interface CategoryData
 * @description 定義單一類別物件的資料結構。
 */
interface CategoryData {
  id: string;      // 唯一識別碼
  name: string;    // 類別名稱
  color: string;   // 代表顏色 (HEX 格式)
  icon?: string;   // 圖示名稱 (來自 @mui/icons-material)
}

/**
 * @interface CategoryManagerProps
 * @description 定義 CategoryManager 組件所需的 props。
 */
interface CategoryManagerProps {
  /** 當類別列表更新時，觸發此回呼函式以更新上層應用的主題和類別列表 */
  onThemeChange: (newTheme: ReturnType<typeof createAppTheme>, categories: CategoryData[]) => void;
  /** 從上層應用傳入的初始類別列表 */
  initialCategories: CategoryData[];
  /** 當使用者確認刪除一個類別時，觸發此回呼函式 */
  onDeleteCategory: (categoryId: string, deleteRecords: boolean) => void;
}

/**
 * CategoryManager 組件
 * @param {CategoryManagerProps} props - 組件的 props
 */
export const CategoryManager: React.FC<CategoryManagerProps> = ({ onThemeChange, initialCategories, onDeleteCategory }) => {
  // --- 狀態管理 (State Management) ---

  /** @state {CategoryData[]} categories - 組件內部維護的類別列表 */
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);

  /** @state {CategoryData | null} editingCategory - 正在被編輯的類別物件；如果為 null，則表示沒有類別正在被編輯 */
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  /** @state {Partial<CategoryData>} newCategory - 正在新增的類別物件的臨時資料 */
  const [newCategory, setNewCategory] = useState<Partial<CategoryData>>({ color: '#000000' });

  /** @state {boolean} isAdding - 標記是否正處於「新增模式」 */
  const [isAdding, setIsAdding] = useState(false);

  /** @state {boolean} deleteConfirmOpen - 控制刪除確認對話框的開啟與關閉 */
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  /** @state {string | null} deletingCategoryId - 準備要刪除的類別的 ID */
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  /** @state {boolean} deleteRecords - 在刪除確認對話框中，標記使用者是否選擇了同時刪除記帳記錄 */
  const [deleteRecords, setDeleteRecords] = useState(false);

  /**
   * @effect
   * 使用 useEffect 來同步來自 props 的 `initialCategories`。
   * 當 `initialCategories` 改變時（例如在上層組件中刪除了ㄧ個類別），
   * 這個 effect 會更新組件內部的 `categories` 狀態，以確保 UI 同步。
   * `!editingCategory` 的條件是為了防止在編輯過程中，父組件的更新覆蓋掉使用者的輸入。
   */
  useEffect(() => {
    if (!editingCategory) {
      setCategories(initialCategories);
    }
  }, [initialCategories, editingCategory]);

  // --- 事件處理 (Event Handlers) ---

  /**
   * 處理刪除按鈕的點擊事件。
   * @param {string} id - 要刪除的類別 ID。
   */
  const handleDeleteClick = (id: string) => {
    // 'others' 類別是預設的後備類別，不允許被刪除。
    if (id === 'others') {
      alert('無法刪除預設類別');
      return;
    }
    // 設定要刪除的類別 ID，並打開確認對話框。
    setDeletingCategoryId(id);
    setDeleteConfirmOpen(true);
  };

  /**
   * 處理刪除確認對話框中的「確認刪除」按鈕點擊事件。
   */
  const handleDeleteConfirm = () => {
    if (deletingCategoryId) {
      // 呼叫從 props 傳入的 onDeleteCategory 方法，將刪除操作交給上層組件處理。
      onDeleteCategory(deletingCategoryId, deleteRecords);
    }
    // 關閉對話框並重置相關狀態。
    handleDeleteCancel();
  };

  /**
   * 處理刪除確認對話框中的「取消」按鈕點擊或關閉事件。
   */
  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeletingCategoryId(null);
    setDeleteRecords(false); // 重置勾選框狀態
  };

  /**
   * 根據更新後的類別列表，重新生成主題並透過 onThemeChange prop 通知上層組件。
   * @param {CategoryData[]} updatedCategories - 最新的類別列表。
   */
  const updateTheme = (updatedCategories: CategoryData[]) => {
    // 將類別列表轉換成主題生成器所需的格式。
    const customCategories: Record<string, any> = updatedCategories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: {
        main: cat.color,
        light: cat.color + '20',
        dark: cat.color,
        contrastText: '#fff'
      }
    }), {});

    // 確保 'others' 類別的顏色定義永遠存在，以防萬一。
    if (!customCategories.others) {
      customCategories.others = {
        main: '#757575',
        light: '#75757520',
        dark: '#757575',
        contrastText: '#fff'
      };
    }
    // 呼叫上層的回呼函式。
    onThemeChange(createAppTheme(customCategories), updatedCategories);
  };

  /**
   * 處理儲存按鈕（在編輯或新增模式下）的點擊事件。
   */
  const handleSave = () => {
    // 處理編輯現有類別的情況。
    if (editingCategory) {
      if (!editingCategory.name || !editingCategory.color) {
        alert('請填寫完整的類別資料（名稱和顏色）');
        return;
      }
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory.id ? editingCategory : cat
      );
      setCategories(updatedCategories); // 更新內部狀態
      updateTheme(updatedCategories); // 更新主題和上層狀態
      setEditingCategory(null); // 退出編輯模式
    }
    // 處理新增類別的情況。
    else if (isAdding && newCategory.id) {
      if (!newCategory.id || !newCategory.name || !newCategory.color) {
        alert('請填寫完整的類別資料');
        return;
      }
      if (categories.some(cat => cat.id === newCategory.id)) {
        alert('類別ID已存在，請使用其他ID');
        return;
      }

      const updatedCategories = [...categories, newCategory as CategoryData];
      setCategories(updatedCategories); // 更新內部狀態
      updateTheme(updatedCategories);   // 更新主題和上層狀態
      setIsAdding(false);             // 退出新增模式
      setNewCategory({ color: '#000000' }); // 重置新類別的表單
    }
  };

  /**
   * 處理取消按鈕（在編輯或新增模式下）的點擊事件。
   */
  const handleCancel = () => {
    setEditingCategory(null);
    setIsAdding(false);
    setNewCategory({ color: '#000000' });
  };

  /**
   * 渲染用於新增或編輯類別的表單。
   * @param {CategoryData | Partial<CategoryData>} category - 要編輯的類別資料或新類別的臨時資料。
   * @param {boolean} isNew - 標記是否為新增模式。
   */
  const renderEditForm = (category: CategoryData | Partial<CategoryData>, isNew: boolean = false) => (
    <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
      <Grid container spacing={2} alignItems="center">
        {/* 類別 ID 輸入框 (僅在新增時可編輯) */}
        <Grid item xs={12} sm={2.5}>
          <TextField
            fullWidth
            size="small"
            label="類別ID"
            value={category.id || ''}
            disabled={!isNew || category.id === 'others'} // ID 不可變更
            onChange={e => {
              if (isNew) {
                setNewCategory(prev => ({ ...prev, id: e.target.value }));
              }
            }}
          />
        </Grid>
        {/* 類別名稱輸入框 */}
        <Grid item xs={12} sm={2.5}>
          <TextField
            fullWidth
            size="small"
            label="類別名稱"
            value={category.name || ''}
            onChange={e => {
              if (isNew) {
                setNewCategory(prev => ({ ...prev, name: e.target.value }));
              } else {
                setEditingCategory(prev => ({ ...prev!, name: e.target.value }));
              }
            }}
          />
        </Grid>
        {/* 顏色選擇器 */}
        <Grid item xs={12} sm={2.5}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="color"
              value={category.color || '#000000'}
              onChange={e => {
                if (isNew) {
                  setNewCategory(prev => ({ ...prev, color: e.target.value }));
                } else {
                  setEditingCategory(prev => ({ ...prev!, color: e.target.value }));
                }
              }}
              style={{
                width: '100%',
                height: '40px',
                padding: '0',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </Box>
        </Grid>
        {/* 圖示選擇器 */}
        <Grid item xs={12} sm={2}>
          <IconSelector
            selectedIcon={category.icon}
            color={category.color}
            onSelect={(iconName) => {
              if (isNew) {
                setNewCategory(prev => ({ ...prev, icon: iconName }));
              } else {
                setEditingCategory(prev => ({ ...prev!, icon: iconName }));
              }
            }}
          />
        </Grid>
        {/* 儲存和取消按鈕 */}
        <Grid item xs={12} sm={2.5}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" onClick={handleSave} sx={{ flex: 1 }}>儲存</Button>
            <Button variant="outlined" size="small" onClick={handleCancel} sx={{ flex: 1 }}>取消</Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  // --- UI 渲染 (UI Rendering) ---
  return (
    <Box>
      {/* 新增類別按鈕 */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAdding(true)}
          disabled={isAdding || editingCategory !== null} // 當處於新增或編輯模式時禁用
        >
          新增類別
        </Button>
      </Box>

      {/* 根據狀態，條件性地渲染新增或編輯表單 */}
      {isAdding && renderEditForm(newCategory, true)}
      {editingCategory && renderEditForm(editingCategory)}

      {/* 類別列表 */}
      <List>
        {categories.map(category => {
          // 動態地從 @mui/icons-material 取得圖示組件
          const CategoryIcon = category.icon ? (Icons as any)[category.icon] : null;

          return (
            <ListItem
              key={category.id}
              sx={{
                backgroundColor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {/* 顯示類別圖示 */}
              {CategoryIcon && (
                <CategoryIcon sx={{ color: category.color, mr: 2, fontSize: 24 }} />
              )}
              {/* 顯示類別名稱和 ID */}
              <ListItemText
                primary={category.name}
                secondary={category.id}
              />
              {/* 顯示顏色預覽 */}
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: category.color,
                  mr: 2
                }}
              />
              {/* 編輯按鈕 */}
              <IconButton edge="end" onClick={() => setEditingCategory(category)}>
                <EditIcon />
              </IconButton>
              {/* 刪除按鈕 ('others' 類別的刪除按鈕被禁用) */}
              <IconButton
                edge="end"
                onClick={() => handleDeleteClick(category.id)}
                disabled={category.id === 'others'}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          );
        })}
      </List>

      {/* 刪除確認對話框 */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您確定要刪除這個類別嗎？
          </DialogContentText>
          <FormControlLabel
            control={
              <Checkbox
                checked={deleteRecords}
                onChange={(e) => setDeleteRecords(e.target.checked)}
              />
            }
            label="同時刪除此類別的所有記帳記錄"
          />
          {/* 條件性地顯示提示訊息 */}
          {!deleteRecords && (
            <DialogContentText sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
              提示：若不勾選，此類別的所有記錄將會被歸類到「其他」。
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>取消</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            確認刪除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};