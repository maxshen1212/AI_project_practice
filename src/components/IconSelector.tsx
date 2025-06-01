import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Grid,
  Tooltip,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

// 定義所有可用的圖標
const iconList = Object.keys(Icons)
  .filter(key => key !== 'default' && !key.includes('Outlined') && !key.includes('Rounded') && !key.includes('Sharp') && !key.includes('TwoTone'))
  .map(key => ({
    name: key,
    // @ts-ignore
    component: Icons[key]
  }));

interface IconSelectorProps {
  onSelect: (iconName: string) => void;
  selectedIcon?: string;
  color?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({ onSelect, selectedIcon, color }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = iconList.filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconClick = (iconName: string) => {
    onSelect(iconName);
    setOpen(false);
  };

  // @ts-ignore
  const SelectedIcon = selectedIcon ? Icons[selectedIcon] : null;

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          width: 48,
          height: 48,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          color: color || 'inherit',
        }}
      >
        {SelectedIcon ? <SelectedIcon /> : <SearchIcon />}
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          選擇圖標
          <TextField
            size="small"
            placeholder="搜尋圖標..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ ml: 2, width: 200 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {filteredIcons.map(({ name, component: Icon }) => (
              <Grid item key={name}>
                <Tooltip title={name}>
                  <IconButton
                    onClick={() => handleIconClick(name)}
                    sx={{
                      color: selectedIcon === name ? color : 'inherit',
                      backgroundColor: selectedIcon === name ? `${color}15` : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedIcon === name ? `${color}25` : 'action.hover',
                      },
                    }}
                  >
                    <Icon />
                  </IconButton>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IconSelector;