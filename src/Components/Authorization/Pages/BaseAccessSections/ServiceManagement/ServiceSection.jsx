import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { SERVICE_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_SERVICES } from '../../../../Base/UserAccessNames.jsx';

const Service = lazy(() => import('../../ServiceManagement/Service/Service'));

export default function ServiceSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(SERVICE_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_SERVICES)) &&
        <Suspense fallback={'loading...'}>
          <Service />
        </Suspense>
      }
    </Box>
  );
};
