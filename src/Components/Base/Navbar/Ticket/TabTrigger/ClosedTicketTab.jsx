import { TicketIcon } from '../../../CustomIcons/TicketIcon.jsx';
import { Box, HStack, Spinner, Text } from '@chakra-ui/react';
import { giveText } from '../../../MultiLanguages/HandleLanguage.jsx';
import { useCountTickets } from '../Sections/useCountTickets.jsx';
import { useSelector } from 'react-redux';
import { useColorMode } from '../../../../ui/color-mode.jsx';

export const ClosedTicketTab = ({ tabsValue, tab3 }) => {
  const ticketSlice = useSelector(state => state.ticketSlice);
  const { colorMode } = useColorMode();

  const {
    allClosedTicketsCount,
    isFetchingAllClosedTicketsCount,
    myClosedTicketsCount,
    isFetchingMyClosedTicketsCount,
  } = useCountTickets({
    reload: ticketSlice.reloadAgainCounts,
    getMyAllClosed: true,
    getMy: false,
    getAll: false,
    getNew: false,
    getAllClosed: true,
  });

  const textColor = tabsValue === tab3
    ? colorMode === 'light' ? 'black' : 'white'
    : colorMode === 'light' ? 'gray' : 'gray';

  return (
    <>
      <TicketIcon width={'1.1rem'} color={tabsValue === tab3 ? 'red' : 'red.300'} />
      <HStack gap={1}>
        <Text color={textColor}>{giveText(332)}</Text>
        {(isFetchingAllClosedTicketsCount || allClosedTicketsCount !== null) &&
          <Box w={'18px'}
               h={'18px'}
               borderRadius={'full'}
               backgroundColor={tabsValue === tab3 ? 'red' : 'red.300'}
               color={'gray.200'}
               transition={'all 0.2s ease'}
               mb={4}>
            {isFetchingAllClosedTicketsCount &&
              <Spinner size={'xs'} my={4} color={'white'} mt={'2px'} mx={'auto'} borderWidth={'1px'} />
            }
            <Text fontSize={'11px'}>{allClosedTicketsCount}</Text>
          </Box>
        }
      </HStack>
      <Text color={textColor}>/</Text>
      <HStack gap={1}>
        <Text color={textColor}>{giveText(359)}</Text>
        {(isFetchingMyClosedTicketsCount || myClosedTicketsCount !== null) &&
          <Box w={'18px'}
               h={'18px'}
               borderRadius={'full'}
               backgroundColor={tabsValue === tab3 ? 'red' : 'red.300'}
               color={'gray.200'}
               transition={'all 0.2s ease'}
               mb={4}>
            {isFetchingMyClosedTicketsCount &&
              <Spinner size={'xs'} my={4} color={'white'} mt={'2px'} mx={'auto'} borderWidth={'1px'} />
            }
            <Text fontSize={'11px'}>{myClosedTicketsCount}</Text>
          </Box>
        }
      </HStack>
    </>
  );
};
