import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { PLATFORM_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_USER } from '../../../../Base/UserAccessNames.jsx';

const Platform = lazy(() => import('../../Settings/Platform.jsx'));

export default function PlatformSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(PLATFORM_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER)) &&
        <Suspense fallback={'loading...'}>
          <Platform />
        </Suspense>
      }
    </Box>
  );
};
