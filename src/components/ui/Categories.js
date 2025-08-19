import React from 'react';
import { List, ListItem, ListItemText, Typography, Chip } from '@mui/material';

function Categories() {
  const categories = [
    { name: 'React', count: 15 },
    { name: 'JavaScript', count: 12 },
    { name: 'CSS', count: 8 },
    { name: '개발 일지', count: 5 },
    { name: '알고리즘', count: 7 },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category.name} button>
            <ListItemText primary={category.name} />
            <Chip label={category.count} size="small" />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Categories; 