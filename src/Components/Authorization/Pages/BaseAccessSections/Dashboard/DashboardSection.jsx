import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { DASHBOARD_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_GIFT_CARD } from '../../../../Base/UserAccessNames.jsx';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';

const Dashboard = lazy(() => import('../../Dashboard/Dashboard'));

export default function DashboardSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(DASHBOARD_NAME));

    dispatch(setBreadcrumbAddress([{
      type: 'text',
      text: giveText(77),
    }]));
  }, []);

  return (
    <Box mt={1} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_GIFT_CARD)) &&
        <Suspense fallback={'loading...'}>
          <Dashboard />
        </Suspense>
      }
    </Box>
  );
};
