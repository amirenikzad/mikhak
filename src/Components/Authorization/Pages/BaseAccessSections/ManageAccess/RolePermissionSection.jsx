import { Box } from '@chakra-ui/react';
import React, { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { ROLE_PERMISSION_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_ROLES_PERMISSIONS } from '../../../../Base/UserAccessNames.jsx';

const RolePermission = lazy(() => import('../../ManageAccess/RolePermission/RolePermission.jsx'));

export default function RolePermissionSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(ROLE_PERMISSION_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_ROLES_PERMISSIONS)) &&
        <Suspense fallback={'loading...'}>
          <RolePermission />
        </Suspense>
      }
    </Box>
  );
};
