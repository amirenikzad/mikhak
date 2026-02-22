import { lazy, Suspense, useState } from 'react';
import { Box, Select, createListCollection, Portal } from '@chakra-ui/react';
import { giveDir, giveText } from '../../../MultiLanguages/HandleLanguage.jsx';
import { FilterIcon } from '../../../CustomIcons/FilterIcon.jsx';

const BaseTicketTable = lazy(() => import('../BaseTicketTable/BaseTicketTable.jsx'));

export default function AllClosedTickets({ searchValue, searchFilter, setController }) {
  const [selectedOption, setSelectedOption] = useState('false');

  const options = createListCollection({
    items: [
      { label: giveText(342), value: 'false' },
      { label: giveText(346), value: 'true' },
    ],
  });

  return <>
    <Box position={'absolute'}
         mt={'-3rem'}
         right={giveDir() === 'rtl' ? null : 0}
         left={giveDir() === 'rtl' ? 0 : null}>
      <Select.Root width={'6rem'}
                   size={'sm'}
                   collection={options}
                   defaultValue={[selectedOption]}
                   onChange={(e) => {
                     setSelectedOption(e.target.value);
                   }}>
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger px={1} dir={'ltr'}>
            <Select.ValueText placeholder="Select Option" />
          </Select.Trigger>
          <Select.IndicatorGroup px={1} dir={'ltr'}>
            <FilterIcon width={'1rem'} />
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {options.items.map((framework) => (
                <Select.Item px={1} borderRadius={0} item={framework} key={framework.value} cursor={'pointer'}>
                  {framework.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Box>

    <Suspense fallback={'loading...'}>
      <BaseTicketTable searchValue={searchValue}
                       showClosedTime={true}
                       chatable={false}
                       closeable={false}
                       setController={setController}
                       queryParameter={`&key=${searchFilter}&user=false&status=2${selectedOption ? `&agent=${selectedOption}` : ''}`} />
    </Suspense>
  </>;
};
