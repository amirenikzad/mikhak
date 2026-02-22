import { Box, Button, Text } from '@chakra-ui/react';
import { MENU_BACKGROUND_DARK_HOVER } from '../BaseColor';
import { ADMIN_ROUTE, TICKET_ROUTE } from '../BaseRouts.jsx';
import { useNavigate } from 'react-router';
import { TicketIcon } from '../CustomIcons/TicketIcon.jsx';
import { memo } from 'react';
import { GET_ALL_TICKET } from '../UserAccessNames.jsx';
import { fetchWithAxios } from '../axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

export const TicketsNavbar = memo(function TicketsNavbar() {
  const accessSlice = useSelector((state) => state.accessSlice);
  const navigate = useNavigate();

  const newTicketsCountAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_TICKET)) {
      const response = await fetchWithAxios.get('/ticket/count?status=0');
      return response.data.result;
    }
  };

  const {
    data: newTicketsCount,
  } = useQuery({
    queryKey: ['new_tickets_count_navbar', accessSlice],
    queryFn: newTicketsCountAxios,
    refetchOnWindowFocus: false,
    refetchInterval: 1 * 60 * 1000,
  });

  return (
    <Button borderRadius={'full'}
            aria-label={'news button'}
            position={'relative'}
            p={0}
            backgroundColor={'transparent'}
            onClick={() => {
              if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_TICKET)) {
                navigate(`${ADMIN_ROUTE}${TICKET_ROUTE}`);
              }
            }}
            _hover={{ backgroundColor: MENU_BACKGROUND_DARK_HOVER }}>
      <TicketIcon color={'white'} size={'1.5rem'} />

      {newTicketsCount > 1 &&
        <Box position={'absolute'}
             bottom={-1}
             right={0}
             dir={'ltr'}
             w={'18px'}
             h={'18px'}
             borderRadius={'full'}
             backgroundColor={'green'}>
          <Text fontSize={'10px'}>{newTicketsCount > 99 ? '+99' : newTicketsCount}</Text>
        </Box>
      }
    </Button>
  );
});
