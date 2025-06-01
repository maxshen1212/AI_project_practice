import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import * as Icons from '@mui/icons-material';

export type Category = {
  id: string;
  name: string;
  color: string;
  icon?: string;
};

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
  onCancel: () => void;
  amount: string;
  isEditing?: boolean;
  categories: Category[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelect,
  onCancel,
  amount,
  isEditing = false,
  categories
}) => {
  // 排序類別列表，確保 'others' 在最後
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.id === 'others') return 1;
    if (b.id === 'others') return -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {isEditing ? '編輯支出' : '新增支出'}: {amount} 元
      </Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2,
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '4px'
      }}>
        {sortedCategories.map(category => {
          // @ts-ignore
          const CategoryIcon = category.icon ? Icons[category.icon] : null;

          return (
            <Button
              key={category.id}
              variant="contained"
              onClick={() => onSelect(category)}
              startIcon={CategoryIcon && <CategoryIcon />}
              sx={{
                backgroundColor: category.color,
                '&:hover': {
                  backgroundColor: category.color,
                  opacity: 0.8,
                },
                height: '60px',
                fontSize: '1.1rem',
                textTransform: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {category.name}
            </Button>
          );
        })}
      </Box>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} variant="outlined">
          取消
        </Button>
      </Box>
    </Box>
  );
};

export default CategorySelector;