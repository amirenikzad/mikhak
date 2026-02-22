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
import { DELETE_USER_ROLE, GET_USERS_ROLE, POST_USER_ROLE } from '../../../../../Base/UserAccessNames.jsx';
import { MENU_BACKGROUND_DARK } from '../../../../../Base/BaseColor.jsx';
import FloatingLabelInput from '../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';
import { SearchIcon } from '../../../../../Base/CustomIcons/SearchIcon.jsx';
import UsersTable from './UsersTable.jsx';
import ScrollToPaginate from '../../../../../Base/CustomComponets/ScrollToPaginate.jsx';
import { CircularCrossFillIcon } from '../../../../../Base/CustomIcons/CircularCrossFillIcon.jsx';

export const UserTableTab = ({ role_id, reactQueryItemName }) => {
  const { colorMode } = useColorMode();
  const accessSlice = useSelector(state => state.accessSlice);
  const [isLoadingSwitches, setIsLoadingSwitches] = useState([]);
  // const [allUserRoles, setAllUserRoles] = useState([]);

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
    { id: 'username', label: giveText(0) },
    { id: 'status', label: giveText(2) },
  ], []);

  const addUserRoleAxios = (id, index) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_USER_ROLE)) {
      const toastId = promiseToast();
      setIsLoadingSwitches((prevState) => [...prevState, index]);

      fetchWithAxios.post(`/user_role?user_id=${id}&role_id=${role_id}`, {})
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
  };

  const allUsersRoleAxios = async ({ pageParam = 1 }) => {
    if (role_id && (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_USERS_ROLE))) {
      try {
        if (controllerRef.current) {
          controllerRef.current.abort();
        }

        const newController = new AbortController();
        controllerRef.current = newController;

        const response = await fetchWithAxios.get(
          `/users_role?role_id=${role_id}&page=${pageParam}&page_size=20&search=${searchValue}`, {
            signal: newController.signal,
          },
        );

        return {
          users: response.data.users,
          next_page: response.data.next_page,
        };
      } catch (error) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') return;
        throw error;
      }
    } else {
      return {
        users: null,
        next_page: null,
      };
    }
  };

  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage: isFetchingListAllUsers,
    isRefetching,
    isError: errorGetAllUsers,
  } = useInfiniteQuery({
    queryKey: [reactQueryItemName, role_id, searchValue],
    queryFn: allUsersRoleAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

    const allUserRoles = useMemo(() => {
                                      return usersData?.pages?.flatMap(page => page?.users) ?? [];
                                    }, [usersData]);

  const lastElementRef = useCallback((node) => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingListAllUsers && !isRefetching) {
        fetchNextPage().then(() => null);
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextPage, hasNextPage, isFetchingListAllUsers, isLoading, isRefetching]);

  // useEffect(() => {
  //   if (usersData?.pages[0]) {
  //     setAllUserRoles(usersData?.pages.flatMap((page) => page?.users));
  //   }
  // }, [usersData]);
  

  const removeUserRoleAxios = useCallback((user_role_id, index) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_USER_ROLE)) {
      const toastId = promiseToast();
      setIsLoadingSwitches((prevState) => [...prevState, index]);

      fetchWithAxios.delete(`/user_role?id=${user_role_id}`)
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

      <Box dir={'ltr'} position={'relative'}>
        {isFetchingListAllUsers &&
          <Box position={'absolute'} top={1} right={2} zIndex={'500 !important'}>
            <Spinner color={'blue.600'} />
          </Box>
        }
        {errorGetAllUsers && <Text>خطایی رخ داده است</Text>}

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
              {stableSort(allUserRoles, getComparator(order, orderBy)).map((row, index) => (
                <UsersTable key={row?.user_id}
                            index={index}
                            row={row}
                            isLoadingSwitches={isLoadingSwitches}
                            addRolePermissionAxios={addUserRoleAxios}
                            removeRolePermissionAxios={removeUserRoleAxios} />
              ))}
            </TableBody>
          </Table>

          <ScrollToPaginate isLoading={isFetchingListAllUsers} lastElementRef={lastElementRef} hasPagination={true} />
        </TableContainer>
      </Box>
    </Box>
  );
};
