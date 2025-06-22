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

interface HistoryRecord {
  id: string;
  amount: number;
  date: Date;
  categoryId: string;
}

interface HistoryListProps {
  history: HistoryRecord[];
  onEditRecord: (record: any) => void;
  onDeleteRecord: (recordId: string) => void;
  categories: Category[];
}

const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onEditRecord,
  onDeleteRecord,
  categories
}) => {
  if (history.length === 0) {
    return <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>尚無紀錄</Typography>;
  }

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  return (
    <List>
      {history.map(record => {
        const category = getCategoryById(record.categoryId);
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
            {CategoryIcon && category && (
              <CategoryIcon
                sx={{
                  color: category.color,
                  mr: 2,
                  fontSize: 24,
                }}
              />
            )}
            <ListItemText
              primary={`$${record.amount}`}
              secondary={category ? category.name : '其他'}
            />
            <Box>
              <IconButton onClick={() => onEditRecord({ ...record, category })}>
                <EditIcon />
              </IconButton>
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