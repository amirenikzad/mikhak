import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { PERMISSION_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_PERMISSIONS } from '../../../../Base/UserAccessNames.jsx';

const Permission = lazy(() => import('../../ManageAccess/Permission/Permission.jsx'));

export default function PermissionSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(PERMISSION_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_PERMISSIONS)) &&
        <Suspense fallback={'loading...'}>
          <Permission />
        </Suspense>
      }
    </Box>
  );
};
