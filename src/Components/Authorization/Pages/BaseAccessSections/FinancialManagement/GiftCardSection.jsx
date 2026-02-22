import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { GIFT_CARD_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_GIFT_CARD } from '../../../../Base/UserAccessNames.jsx';

const GiftCard = lazy(() => import('../../FinancialManagement/GiftCard/GiftCard.jsx'));

export default function GiftCardSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(GIFT_CARD_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_GIFT_CARD)) &&
        <Suspense fallback={'loading...'}>
          <GiftCard />
        </Suspense>
      }
    </Box>
  );
};
