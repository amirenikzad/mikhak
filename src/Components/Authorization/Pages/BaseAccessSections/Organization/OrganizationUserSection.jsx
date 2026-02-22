import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { ORGANIZATION_USER_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_ORGANIZATION_USER } from '../../../../Base/UserAccessNames.jsx';

const OrganizationUser = lazy(() => import('../../Organizations/OrganizationUser/OrganizationUser.jsx'));

export default function OrganizationUserSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(ORGANIZATION_USER_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_ORGANIZATION_USER)) &&
        <Suspense fallback={'loading...'}>
          <OrganizationUser />
        </Suspense>
      }
    </Box>
  );
};
