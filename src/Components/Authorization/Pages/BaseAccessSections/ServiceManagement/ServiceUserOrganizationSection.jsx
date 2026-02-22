import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { SERVICE_USER_ORGANIZATION_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_SERVICE_USER_ORGANIZATION } from '../../../../Base/UserAccessNames.jsx';

const ServiceUserOrganization = lazy(() => import('../../ServiceManagement/ServiceUserOrganization/ServiceUserOrganization.jsx'));

export default function ServiceUserOrganizationSection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(SERVICE_USER_ORGANIZATION_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_SERVICE_USER_ORGANIZATION)) &&
        <Suspense fallback={'loading...'}>
          <ServiceUserOrganization />
        </Suspense>
      }
    </Box>
  );
};
