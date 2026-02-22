import { memo } from 'react';
import { ActionBarSelectionTrigger } from '../../ui/action-bar.jsx';

export const ActionBarTrigger = memo(function ActionBarTrigger({ selectedCount }) {

  return (
    <ActionBarSelectionTrigger p={2}>
      {selectedCount} selected
    </ActionBarSelectionTrigger>
  );
});
