import { TicketIcon } from '../../../CustomIcons/TicketIcon.jsx';
import { Box, HStack, Spinner, Text } from '@chakra-ui/react';
import { giveText } from '../../../MultiLanguages/HandleLanguage.jsx';
import { useCountTickets } from '../Sections/useCountTickets.jsx';
import { useSelector } from 'react-redux';
import { useColorMode } from '../../../../ui/color-mode.jsx';

export const OpenTicketTab = ({ tabsValue, tab2 }) => {
  const ticketSlice = useSelector(state => state.ticketSlice);
  const { colorMode } = useColorMode();
  const {
    allTicketsCount,
    isFetchingAllTicketsCount,
    myTicketsCount,
    isFetchingMyTicketsCount,
  } = useCountTickets({
    reload: ticketSlice.reloadAgainCounts,
    getMyAllClosed: false,
    getMy: true,
    getAll: true,
    getNew: false,
    getAllClosed: false,
  });
  const textColor = tabsValue === tab2
    ? colorMode === 'light' ? 'black' : 'white'
    : colorMode === 'light' ? 'gray' : 'gray';

  return (
    <>
      <TicketIcon width={'1.1rem'} color={tabsValue === tab2 ? 'blue.600' : 'blue.400'} />
      <HStack>
        <HStack gap={1}>
          <Text color={textColor}>{giveText(358)}</Text>
          {(isFetchingAllTicketsCount || allTicketsCount !== null) &&
            <Box w={'18px'}
                 h={'18px'}
                 borderRadius={'full'}
                 backgroundColor={tabsValue === tab2 ? 'blue.600' : 'blue.400'}
                 color={'gray.200'}
                 transition={'all 0.2s ease'}
                 mb={4}>
              {isFetchingAllTicketsCount &&
                <Spinner size={'xs'} my={4} color={'white'} mt={'2px'} mx={'auto'} borderWidth={'1px'} />
              }
              <Text fontSize={'11px'}>{allTicketsCount}</Text>
            </Box>
          }
        </HStack>
        <Text color={textColor}>/</Text>
        <HStack gap={1}>
          <Text color={textColor}>{giveText(333)}</Text>
          {(isFetchingMyTicketsCount || myTicketsCount !== null) &&
            <Box w={'18px'}
                 h={'18px'}
                 borderRadius={'full'}
                 backgroundColor={tabsValue === tab2 ? 'blue.600' : 'blue.400'}
                 color={'gray.200'}
                 transition={'all 0.2s ease'}
                 mb={4}>
              {isFetchingMyTicketsCount &&
                <Spinner size={'xs'} my={4} color={'white'} mt={'2px'} mx={'auto'} borderWidth={'1px'} />
              }
              <Text fontSize={'11px'}>{myTicketsCount}</Text>
            </Box>
          }
        </HStack>
      </HStack>
    </>
  );
};
