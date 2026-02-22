import { ActionBarRoot, ActionBarContent, ActionBarSeparator } from '../../ui/action-bar.jsx';
import { memo } from 'react';
import { ActionBarTrigger } from './ActionBarTrigger.jsx';
import { ActionBarButtons } from './ActionBarButtons.jsx';

export const ActionBarTables = memo(function ActionBarTables({
                                                               selectedCount,
                                                               buttons = [{
                                                                 title: '',
                                                                 hasAccess: false,
                                                                 hoverBackgroundColor: ['red.600', 'red.200'],
                                                                 backgroundColor: ['red.600', 'red.300'],
                                                                 color: ['red.600', 'red.400'],
                                                                 onClickFunc: () => null,
                                                               }],
                                                             }) {

  return (
    <ActionBarRoot open={selectedCount > 0}>
      <ActionBarContent className={'box_shadow'}>
        <ActionBarTrigger selectedCount={selectedCount} />

        <ActionBarSeparator />

        <ActionBarButtons buttons={buttons} />
      </ActionBarContent>
    </ActionBarRoot>
  );
});
