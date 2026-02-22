import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { USERS_WALLET_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_USERS_WALLET } from '../../../../Base/UserAccessNames.jsx';

const WalletManager = lazy(() => import('../../FinancialManagement/UserWallet/UserWallet.jsx'));

export default function UserWalletManagerSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(USERS_WALLET_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USERS_WALLET)) &&
        <Suspense fallback={'loading...'}>
          <WalletManager />
        </Suspense>
      }
    </Box>
  );
};
