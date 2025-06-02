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
  const renderCategoryIcon = (iconName: string | undefined) => {
    if (!iconName) return null;
    // @ts-ignore
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

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
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)'
        },
        gap: { xs: 1.5, sm: 2 },
        maxHeight: { xs: '60vh', sm: '400px' },
        overflowY: 'auto',
        padding: '4px'
      }}>
        {sortedCategories.map(category => (
          <Button
            key={category.id}
            variant="contained"
            onClick={() => onSelect(category)}
            startIcon={renderCategoryIcon(category.icon)}
            sx={{
              backgroundColor: category.color,
              '&:hover': {
                backgroundColor: category.color,
                opacity: 0.8,
              },
              height: { xs: '50px', sm: '60px' },
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              textTransform: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '& .MuiButton-startIcon': {
                marginRight: { xs: 1, sm: 1.5 },
                '& > svg': {
                  fontSize: { xs: 20, sm: 24 },
                }
              }
            }}
          >
            {category.name}
          </Button>
        ))}
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