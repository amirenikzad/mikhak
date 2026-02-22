import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { USER_ROLE_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_USER_ROLE } from '../../../../Base/UserAccessNames.jsx';

const UserRole = lazy(() => import('../../ManageAccess/UserRole/UserRole.jsx'));

export default function UserRoleSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(USER_ROLE_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER_ROLE)) &&
        <Suspense fallback={'loading...'}>
          <UserRole />
        </Suspense>
      }
    </Box>
  );
};
