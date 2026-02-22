import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { TRANSACTION_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_USER, GET_TRANSACTION_USERS_WALLET } from '../../../../Base/UserAccessNames.jsx';

const UsersTransactions = lazy(() => import('../../FinancialManagement/UsersTransactions/UsersTransactions.jsx'));

export default function UsersTransactionsSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(TRANSACTION_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || (accessSlice.userAccess?.includes(GET_TRANSACTION_USERS_WALLET) && accessSlice.userAccess?.includes(GET_ALL_USER))) &&
        <Suspense fallback={'loading...'}>
          <UsersTransactions />
        </Suspense>
      }
    </Box>
  );
};
