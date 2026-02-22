import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { TICKET_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_TICKET } from '../../../../Base/UserAccessNames.jsx';

const Ticket = lazy(() => import('../../../../Base/Navbar/Ticket/Ticket'));

export default function TicketSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(TICKET_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_TICKET)) &&
        <Suspense fallback={'loading...'}>
          <Ticket />
        </Suspense>
      }
    </Box>
  );
};
