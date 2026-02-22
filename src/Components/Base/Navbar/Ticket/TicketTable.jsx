import { lazy, memo, Suspense, useCallback, useMemo, useState } from 'react';
import { Tabs } from '@chakra-ui/react';
import { useColorMode } from '../../../ui/color-mode.jsx';
import TabTriggers from './TabTrigger/TabTriggers.jsx';

const BaseTicketTable = lazy(() => import('./BaseTicketTable/BaseTicketTable'));
const AllAnsweredTickets = lazy(() => import('./Tabs/AllAnsweredTickets'));
const AllClosedTickets = lazy(() => import('./Tabs/AllClosedTickets'));

export const TicketTable = memo(function TicketTable({ searchValue, searchFilter, setController }) {
  const { colorMode } = useColorMode();
  const tab1 = useMemo(() => 'new_tickets', []);
  const tab2 = useMemo(() => 'all_tickets', []);
  const tab3 = useMemo(() => 'close_tickets', []);
  const [tabsValue, setTabsValue] = useState(tab1);

  const onChangeTabsValue = useCallback((e) => {
    setTabsValue(e.value);
  }, []);

  return (
    <Tabs.Root px={'2rem'}
               mt={2}
               value={tabsValue}
               onValueChange={onChangeTabsValue}
               variant="plain"
               unmountOnExit
               lazyMount={true}>
      <Tabs.List borderBottomWidth={0}
                 borderTopWidth={1}
                 borderRightWidth={1}
                 borderLeftWidth={1}
                 borderTopRadius={5}
                 backgroundColor={colorMode === 'light' ? 'gray.100' : 'gray.900'}
                 px={1}
                 py={1}>
        <TabTriggers tabsValue={tabsValue} tabs={[tab1, tab2, tab3]} />

        <Tabs.Indicator rounded="l2" boxShadow={'xl'} bgColor={colorMode === 'light' ? 'white' : 'gray.800'} />
      </Tabs.List>

      <Tabs.Content borderWidth={1} borderBottomRadius={8} borderTopEndRadius={8} value={tab1}>
        <Suspense fallback={'loading...'}>
          <BaseTicketTable searchValue={searchValue}
                           showClosedTime={false}
                           setController={setController}
                           queryParameter={`&key=${searchFilter}&user=false&status=0`} />
        </Suspense>
      </Tabs.Content>
      <Tabs.Content borderWidth={1}
                    borderBottomRadius={8}
                    borderTopEndRadius={8}
                    position={'relative'}
                    value={tab2}>
        <Suspense fallback={'loading...'}>
          <AllAnsweredTickets searchValue={searchValue} searchFilter={searchFilter} setController={setController} />
        </Suspense>
      </Tabs.Content>
      <Tabs.Content borderWidth={1}
                    borderBottomRadius={8}
                    borderTopEndRadius={8}
                    position={'relative'}
                    value={tab3}>
        <Suspense fallback={'loading...'}>
          <AllClosedTickets searchValue={searchValue} searchFilter={searchFilter} setController={setController} />
        </Suspense>
      </Tabs.Content>
    </Tabs.Root>
  );
});
