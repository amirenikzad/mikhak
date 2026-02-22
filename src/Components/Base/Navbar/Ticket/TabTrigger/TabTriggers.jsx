import { HStack, Separator, Tabs } from '@chakra-ui/react';
import { useMemo } from 'react';
import { NewTicketTab } from './NewTicketTab.jsx';
import { OpenTicketTab } from './OpenTicketTab.jsx';
import { ClosedTicketTab } from './ClosedTicketTab.jsx';

export default function TabTriggers({ tabsValue, tabs }) {
  const [tab1, tab2, tab3] = useMemo(() => tabs, []);

  return (
    <>
      <Tabs.Trigger px={2} value={tab1}>
        <NewTicketTab tabsValue={tabsValue} tab1={tab1} />
      </Tabs.Trigger>

      <HStack>
        <Separator orientation="vertical" height="8" />
      </HStack>

      <Tabs.Trigger px={2} value={tab2}>
        <OpenTicketTab tabsValue={tabsValue} tab2={tab2} />
      </Tabs.Trigger>

      <HStack>
        <Separator orientation="vertical" height="8" />
      </HStack>

      <Tabs.Trigger px={2} value={tab3}>
        <ClosedTicketTab tabsValue={tabsValue} tab3={tab3} />
      </Tabs.Trigger>
    </>
  );
}
