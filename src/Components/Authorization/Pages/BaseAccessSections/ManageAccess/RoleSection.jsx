import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { ROLE_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_ROLES } from '../../../../Base/UserAccessNames.jsx';

const Role = lazy(() => import('../../ManageAccess/Role/Role.jsx'));

export default function RoleSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(ROLE_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_ROLES)) &&
        <Suspense fallback={'loading...'}>
          <Role />
        </Suspense>
      }
    </Box>
  );
};
