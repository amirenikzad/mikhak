import React, { memo } from 'react';
import Checkbox from '@mui/material/Checkbox';

export const CheckBoxTable = memo(function CheckBoxTable({
                                                           row,
                                                           listId,
                                                           ids,
                                                           onChangeCheckbox,
                                                         }) {
  const isChecked = row ? ids.has(row[listId]) : false;
  const handleClick = () => row && onChangeCheckbox(row[listId]);

  return (
    <Checkbox sx={{ color: 'gray' }}
              color="primary"
              checked={isChecked}
              onChange={handleClick}
              inputProps={{ 'aria-labelledby': 'checkbox' }} />
  );
});
