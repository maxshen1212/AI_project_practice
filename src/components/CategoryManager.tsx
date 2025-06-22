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

interface CategoryData {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

interface CategoryManagerProps {
  onThemeChange: (newTheme: ReturnType<typeof createAppTheme>, categories: CategoryData[]) => void;
  initialCategories: CategoryData[];
  onDeleteCategory: (categoryId: string, deleteRecords: boolean) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ onThemeChange, initialCategories, onDeleteCategory }) => {
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<CategoryData>>({
    color: '#000000'
  });
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deleteRecords, setDeleteRecords] = useState(false);

  useEffect(() => {
    if (!editingCategory) {
      setCategories(initialCategories);
    }
  }, [initialCategories, editingCategory]);

  const handleDeleteClick = (id: string) => {
    if (id === 'others') {
      alert('無法刪除預設類別');
      return;
    }
    setDeletingCategoryId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingCategoryId) {
      onDeleteCategory(deletingCategoryId, deleteRecords);
    }
    handleDeleteCancel();
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeletingCategoryId(null);
    setDeleteRecords(false);
  };

  const updateTheme = (updatedCategories: CategoryData[]) => {
    const customCategories: Record<string, {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    }> = updatedCategories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: {
        main: cat.color,
        light: cat.color + '20',
        dark: cat.color,
        contrastText: '#fff'
      }
    }), {});

    if (!customCategories.others) {
      customCategories.others = {
        main: '#757575',
        light: '#75757520',
        dark: '#757575',
        contrastText: '#fff'
      };
    }

    onThemeChange(createAppTheme(customCategories), updatedCategories);
  };

  const handleSave = () => {
    if (editingCategory) {
      if (!editingCategory.name || !editingCategory.color) {
        alert('請填寫完整的類別資料（名稱和顏色）');
        return;
      }
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory.id ? editingCategory : cat
      );
      setCategories(updatedCategories);
      updateTheme(updatedCategories);
      setEditingCategory(null);
    } else if (isAdding && newCategory.id) {
      if (!newCategory.id || !newCategory.name || !newCategory.color) {
        alert('請填寫完整的類別資料');
        return;
      }

      if (categories.some(cat => cat.id === newCategory.id)) {
        alert('類別ID已存在，請使用其他ID');
        return;
      }

      const updatedCategories = [...categories, newCategory as CategoryData];
      setCategories(updatedCategories);
      updateTheme(updatedCategories);
      setIsAdding(false);
      setNewCategory({ color: '#000000' });
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setIsAdding(false);
    setNewCategory({ color: '#000000' });
  };

  const renderEditForm = (category: CategoryData | Partial<CategoryData>, isNew: boolean = false) => (
    <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={2.5}>
          <TextField
            fullWidth
            size="small"
            label="類別ID"
            value={category.id || ''}
            disabled={!isNew}
            onChange={e => {
              if (isNew) {
                setNewCategory(prev => ({ ...prev, id: e.target.value }));
              }
            }}
          />
        </Grid>
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
        <Grid item xs={12} sm={2.5}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              sx={{ flex: 1 }}
            >
              儲存
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCancel}
              sx={{ flex: 1 }}
            >
              取消
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAdding(true)}
          disabled={isAdding || editingCategory !== null}
        >
          新增類別
        </Button>
      </Box>

      {isAdding && renderEditForm(newCategory, true)}
      {editingCategory && renderEditForm(editingCategory)}

      <List>
        {categories.map(category => {
          // @ts-ignore
          const CategoryIcon = category.icon ? Icons[category.icon] : null;

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
              {CategoryIcon && (
                <CategoryIcon
                  sx={{
                    color: category.color,
                    mr: 2,
                    fontSize: 24,
                  }}
                />
              )}
              <ListItemText
                primary={category.name}
                secondary={category.id}
              />
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: category.color,
                  mr: 2
                }}
              />
              <IconButton
                edge="end"
                onClick={() => setEditingCategory(category)}
              >
                <EditIcon />
              </IconButton>
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