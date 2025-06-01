import React from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
  onCancel: () => void;
  amount: string;
  isEditing?: boolean;
}

const categories: Category[] = [
  { id: 'food', name: '飲食', icon: <RestaurantIcon /> },
  { id: 'daily', name: '日用品', icon: <ShoppingBasketIcon /> },
  { id: 'transport', name: '交通', icon: <DirectionsSubwayIcon /> },
  { id: 'medical', name: '醫療', icon: <LocalHospitalIcon /> },
  { id: 'entertainment', name: '娛樂', icon: <SportsEsportsIcon /> },
  { id: 'others', name: '其他', icon: <MoreHorizIcon /> },
];

const CategoryGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const CategoryButton = styled(Button)<{ categoryid: string }>(({ theme, categoryid }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: `${theme.palette.categories[categoryid as keyof typeof theme.palette.categories].main}15`,
  border: `1px solid ${theme.palette.categories[categoryid as keyof typeof theme.palette.categories].main}30`,
  borderRadius: '12px',
  color: theme.palette.categories[categoryid as keyof typeof theme.palette.categories].main,
  transition: 'all 0.2s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
  },
  '&:hover': {
    backgroundColor: theme.palette.categories[categoryid as keyof typeof theme.palette.categories].main,
    color: '#FFFFFF',
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 8px ${theme.palette.categories[categoryid as keyof typeof theme.palette.categories].main}30`,
  }
}));

const AmountDisplay = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelect,
  onCancel,
  amount,
  isEditing = false
}) => {
  return (
    <Box>
      <AmountDisplay variant="h4">
        ${amount}
      </AmountDisplay>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        {isEditing ? '編輯支出類別' : '選擇支出類別'}
      </Typography>
      <CategoryGrid>
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            onClick={() => onSelect(category)}
            categoryid={category.id}
          >
            {category.icon}
            <Typography variant="body2">
              {category.name}
            </Typography>
          </CategoryButton>
        ))}
      </CategoryGrid>
      <ActionButtons>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            minWidth: '120px',
            color: 'text.secondary',
            borderColor: 'text.secondary',
          }}
        >
          取消
        </Button>
      </ActionButtons>
    </Box>
  );
};

export default CategorySelector;