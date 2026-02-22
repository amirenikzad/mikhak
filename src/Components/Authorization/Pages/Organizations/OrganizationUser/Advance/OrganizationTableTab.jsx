import { Box, Spinner, Text } from '@chakra-ui/react';
import { giveDir, giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableSortLabel from '@mui/material/TableSortLabel';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  promiseToast,
  updatePromiseToastError,
  checkStatus,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../../Base/BaseFunction.jsx';
import { useSelector } from 'react-redux';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import {
  POST_ORGANIZATION_USER,
  GET_ORGANIZATIONS_USER,
  DELETE_ORGANIZATION_USER,
} from '../../../../../Base/UserAccessNames.jsx';
import { MENU_BACKGROUND_DARK } from '../../../../../Base/BaseColor.jsx';
import FloatingLabelInput from '../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';
import { SearchIcon } from '../../../../../Base/CustomIcons/SearchIcon.jsx';
import OrganizationTable from './OrganizationTable.jsx';
import ScrollToPaginate from '../../../../../Base/CustomComponets/ScrollToPaginate.jsx';
import { CircularCrossFillIcon } from '../../../../../Base/CustomIcons/CircularCrossFillIcon.jsx';

export const OrganizationTableTab = ({ user_id, reactQueryItemName }) => {
  const { colorMode } = useColorMode();
  const accessSlice = useSelector(state => state.accessSlice);
  const [isLoadingSwitches, setIsLoadingSwitches] = useState([]);
  const [allOrganizationsUsers, setAllOrganizationsUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const observer = useRef(null);
  const queryClient = useQueryClient();
  const controllerRef = useRef(null);

  const handleRequestSort = useCallback((property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [orderBy, order]);

  const stableSort = useCallback((array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }, []);

  const getComparator = useCallback((order, orderBy) => {
    return order === 'desc'
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }, []);

  const headCells = useMemo(() => [
    { id: 'name', label: giveText(148) },
    { id: 'status', label: giveText(2) },
  ], []);

  const allOrganizationRoleAxios = useCallback(async ({ pageParam = 1 }) => {
    if (user_id && (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ORGANIZATIONS_USER))) {
      try {
        if (controllerRef.current) {
          controllerRef.current.abort();
        }

        const newController = new AbortController();
        controllerRef.current = newController;

        const response = await fetchWithAxios.get(
          `/organizations_user?user_id=${user_id}&page=${pageParam}&page_size=20&search=${searchValue}`,
          {
            signal: newController.signal,
          },
        );

        return {
          organizations: response.data.organizations,
          next_page: response.data.next_page,
        };
      } catch (error) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') return;
        throw error;
      }
    } else {
      return null;
    }
  }, [accessSlice.isAdmin, accessSlice.userAccess, searchValue, user_id]);

  const {
    data: organizationsData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage: isFetchingListAllOrganizations,
    isRefetching,
    isError: errorGetAllOrganizations,
  } = useInfiniteQuery({
    queryKey: [reactQueryItemName, user_id, searchValue],
    queryFn: allOrganizationRoleAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementRef = useCallback((node) => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingListAllOrganizations && !isRefetching) {
        fetchNextPage().then(() => null);
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextPage, hasNextPage, isFetchingListAllOrganizations, isLoading, isRefetching]);

  useEffect(() => {
    if (organizationsData?.pages[0]) {
      setAllOrganizationsUsers(organizationsData?.pages.flatMap((page) => page?.organizations));
    }
  }, [organizationsData]);

  const addOrganizationRolesAxios = useCallback((id, index) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ORGANIZATION_USER)) {
      const toastId = promiseToast();
      setIsLoadingSwitches((prevState) => [...prevState, index]);

      fetchWithAxios.post(`/organization_user?organization_id=${id}&user_id=${user_id}`, {})
        .then((response) => {
          queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
          setTimeout(() => {
            setIsLoadingSwitches((prevState) => prevState.filter(num => num !== index));
          }, 1000);
          updatePromiseToastSuccessWarningInfo({ toastId, response });

        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        });
    }
  }, [accessSlice.isAdmin, accessSlice.userAccess, reactQueryItemName, user_id]);

  const removeOrganizationUserAxios = useCallback((organization_role_id, index) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ORGANIZATION_USER)) {
      const toastId = promiseToast();
      setIsLoadingSwitches((prevState) => [...prevState, index]);

      fetchWithAxios.delete(`/organization_user?id=${organization_role_id}`)
        .then((response) => {
          if (checkStatus({ status: response.data.status })) {
            queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
            setTimeout(() => {
              setIsLoadingSwitches((prevState) => prevState.filter(num => num !== index));
            }, 1000);
          }
          updatePromiseToastSuccessWarningInfo({ toastId, response });

        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        });
    }
  }, [accessSlice.isAdmin, accessSlice.userAccess, reactQueryItemName]);

  return (
    <Box w={'100%'}>
      <FloatingLabelInput label={giveText(10)}
                          value={searchValue}
                          dir={giveDir()}
                          mx={3}
                          hasInputLeftElement={true}
                          InputLeftElementIcon={<SearchIcon width={'1rem'} color="gray.300" />}
                          hasInputRightElement={searchValue}
                          InputRightElement={(
                            <Box mx={2} cursor={'pointer'} onClick={() => setSearchValue('')}>
                              <CircularCrossFillIcon color={'red'} width={'1rem'} />
                            </Box>
                          )}
                          onChange={(e) => {
                            setSearchValue(e.target.value);
                          }} />

      <Box mt={2} dir={'ltr'} position={'relative'}>
        {isFetchingListAllOrganizations &&
          <Box position={'absolute'} top={1} right={2} zIndex={'500 !important'}>
            <Spinner color={'blue.600'} />
          </Box>
        }
        {errorGetAllOrganizations && <Text>خطایی رخ داده است</Text>}

        <TableContainer component={Paper}
                        sx={{
                          backgroundColor: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
                          maxHeight: 400,
                        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id}
                             sx={{
                               backgroundColor: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
                             }}
                             align={headCell.numeric ? 'right' : 'left'}
                             sortDirection={orderBy === headCell.id ? order : false}>
                    <TableSortLabel active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    sx={{
                                      '& .MuiTableSortLabel-icon': {
                                        color: colorMode === 'light'
                                          ? 'gray  !important'
                                          : 'white !important',
                                      },
                                    }}
                                    onClick={() => handleRequestSort(headCell.id)}>
                      <Text fontWeight={'500'} color={colorMode === 'light' ? 'black' : 'white'}>
                        {headCell.label}
                      </Text>
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(allOrganizationsUsers, getComparator(order, orderBy)).map((row, index) => (
                <OrganizationTable key={row?.id}
                                   index={index}
                                   row={row}
                                   isLoadingSwitches={isLoadingSwitches}
                                   removeOrganizationRoleAxios={removeOrganizationUserAxios}
                                   addOrganizationRolesAxios={addOrganizationRolesAxios} />
              ))}
            </TableBody>
          </Table>

          <ScrollToPaginate isLoading={isFetchingListAllOrganizations}
                            lastElementRef={lastElementRef}
                            hasPagination={true} />
        </TableContainer>
      </Box>
    </Box>
  );
};
