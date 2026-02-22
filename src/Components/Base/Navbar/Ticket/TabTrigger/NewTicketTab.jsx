import { TicketIcon } from '../../../CustomIcons/TicketIcon.jsx';
import { Box, HStack, Spinner, Text } from '@chakra-ui/react';
import { giveText } from '../../../MultiLanguages/HandleLanguage.jsx';
import { useCountTickets } from '../Sections/useCountTickets.jsx';
import { useSelector } from 'react-redux';
import { useColorMode } from '../../../../ui/color-mode.jsx';

export const NewTicketTab = ({ tabsValue, tab1 }) => {
  const ticketSlice = useSelector(state => state.ticketSlice);
  const { colorMode } = useColorMode();
  
  const {
    newTicketsCount,
    isFetchingNewTicketsCount,
  } = useCountTickets({
    reload: ticketSlice.reloadAgainCounts,
    getMyAllClosed: false,
    getMy: false,
    getAll: false,
    getNew: true,
    getAllClosed: false,
  });

  const textColor = tabsValue === tab1
    ? colorMode === 'light' ? 'black' : 'white'
    : colorMode === 'light' ? 'gray' : 'gray';

  return (
    <>
      <TicketIcon width={'1.1rem'} color={tabsValue === tab1 ? 'green' : 'green.500'} />
      <HStack>
        <Text color={textColor}>{giveText(353)}</Text>
        {(isFetchingNewTicketsCount || newTicketsCount !== null) &&
          <Box w={'18px'}
               h={'18px'}
               borderRadius={'full'}
               backgroundColor={tabsValue === tab1 ? 'green' : 'green.500'}
               color={'gray.200'}
               transition={'all 0.2s ease'}
               mb={4}>
            {isFetchingNewTicketsCount &&
              <Spinner size={'xs'} my={4} color={'white'} mt={'2px'} mx={'auto'} borderWidth={'1px'} />
            }
            <Text fontSize={'11px'}>{newTicketsCount}</Text>
          </Box>
        }
      </HStack>
    </>
  );
};
