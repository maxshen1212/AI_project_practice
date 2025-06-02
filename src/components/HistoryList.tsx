import React from 'react';
import {
  List,
  ListItem,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Icons from '@mui/icons-material';

interface HistoryListProps {
  history: Array<{
    id: string;
    amount: number;
    date: Date;
    category: {
      id: string;
      name: string;
      color: string;
      icon?: string;
    };
  }>;
  onEditRecord: (record: any) => void;
  onDeleteRecord: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onEditRecord,
  onDeleteRecord,
}) => {
  const formatDateTime = (date: Date) => {
    const today = new Date();
    const recordDate = new Date(date);

    if (
      recordDate.getDate() === today.getDate() &&
      recordDate.getMonth() === today.getMonth() &&
      recordDate.getFullYear() === today.getFullYear()
    ) {
      return `今天 ${recordDate.getHours().toString().padStart(2, '0')}:${recordDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    }

    return `${recordDate.getMonth() + 1}/${recordDate.getDate()} ${recordDate
      .getHours()
      .toString()
      .padStart(2, '0')}:${recordDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderCategoryIcon = (iconName: string | undefined) => {
    if (!iconName) return null;
    // @ts-ignore
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {history.length === 0 ? (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            py: 4,
          }}
        >
          還沒有任何支出記錄
        </Typography>
      ) : (
        history.map((record) => (
          <ListItem
            key={record.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: `${record.category.color}15`,
                  color: record.category.color,
                }}
              >
                {renderCategoryIcon(record.category.icon)}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                  }}
                >
                  {record.category.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary' }}
                >
                  {formatDateTime(record.date)}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  minWidth: '80px',
                  textAlign: 'right',
                }}
              >
                {record.amount.toLocaleString()} 元
              </Typography>
              <IconButton
                size="small"
                onClick={() => onEditRecord(record)}
                sx={{ color: 'primary.main' }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDeleteRecord(record.id)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default HistoryList;