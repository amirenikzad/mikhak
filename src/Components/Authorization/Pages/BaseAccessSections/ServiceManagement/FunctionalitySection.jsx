import { Box } from '@chakra-ui/react';
import { lazy, Suspense, useEffect } from 'react';
import { setPageName } from '../../../../../store/features/pagesSlice.jsx';
import { FUNCTIONALITY_NAME } from '../../../../Base/PageNames.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_FUNCTIONALITIES } from '../../../../Base/UserAccessNames.jsx';

const Functionality = lazy(() => import('../../ServiceManagement/Functionality/Functionality'));

export default function FunctionalitySection() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageName(FUNCTIONALITY_NAME));
  }, []);

  return (
    <Box mt={5} mr={4} mx={3}>
      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_FUNCTIONALITIES)) &&
        <Suspense fallback={'loading...'}>
          <Functionality />
        </Suspense>
      }
    </Box>
  );
};
