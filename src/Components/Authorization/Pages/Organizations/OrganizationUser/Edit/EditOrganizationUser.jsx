import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, HStack, Separator, Spinner, Stack, Text } from '@chakra-ui/react';
import {
  promiseToast,
  updatePromiseToastError,
  checkStatus,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../../Base/BaseFunction.jsx';
import { motion } from 'motion/react';
import { Base } from '../../../../../Authentication/Base.jsx';
import { useSelector } from 'react-redux';
import { giveDir, giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableSortLabel from '@mui/material/TableSortLabel';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { POST_ORGANIZATION_USER, DELETE_ORGANIZATION_USER } from '../../../../../Base/UserAccessNames.jsx';
import { MENU_BACKGROUND_DARK } from '../../../../../Base/BaseColor.jsx';
import { User } from '../../../../../Base/Extensions.jsx';
import FloatingLabelInput from '../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { useActiveInactiveAll } from '../../../../../Base/CustomHook/useActiveInactiveAll.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';
import { SearchIcon } from '../../../../../Base/CustomIcons/SearchIcon.jsx';
import UserTable from './UserTable.jsx';
import ScrollToPaginate from '../../../../../Base/CustomComponets/ScrollToPaginate.jsx';
import { CircularCrossFillIcon } from '../../../../../Base/CustomIcons/CircularCrossFillIcon.jsx';

export default function EditOrganizationUser({ selectedOrganization = {} }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const { colorMode } = useColorMode();
  const [allUsers, setAllUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isLoadingSwitches, setIsLoadingSwitches] = useState([]);
  const buttonId = useMemo(() => 'add_role_permission_submit_id', []);
  const observer = useRef(null);
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_organization_user_list', []);
  const setORCatchAllURL = useMemo(() => '/set_unset_organization_user', []);
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
    { id: 'name', numeric: false, disablePadding: true, label: giveText(51) },
    { id: 'active', numeric: false, disablePadding: false, label: giveText(2) },
  ], []);

  const allOrganizationUserAxios = useCallback(async ({ pageParam = 1 }) => {
    try {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const newController = new AbortController();
      controllerRef.current = newController;

      const response = await fetchWithAxios.get(
        `/organization_user?id=${selectedOrganization.organization_id}&page=${pageParam}&page_size=20&search=${searchValue}`,
        {
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
  }, [searchValue, selectedOrganization.organization_id]);

  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage: isFetchingListAllUsers,
    isRefetching,
    isError: errorGetAllUsers,
  } = useInfiniteQuery({
    queryKey: [reactQueryItemName, selectedOrganization, searchValue],
    queryFn: allOrganizationUserAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

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

  useEffect(() => {
    if (usersData) {
      setAllUsers(usersData?.pages.flatMap((page) => page?.users));
    }
  }, [usersData]);

  const addOrganizationUserAxios = useCallback((user_id, index) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ORGANIZATION_USER)) {
      const toastId = promiseToast();
      setIsLoadingSwitches((prevState) => [...prevState, index]);

      fetchWithAxios.post(`/organization_user?organization_id=${selectedOrganization.organization_id}&user_id=${user_id}`, {})
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
  }, [accessSlice.isAdmin, accessSlice.userAccess, reactQueryItemName, selectedOrganization.organization_id]);

  const removeOrganizationUserAxios = useCallback((user_organization_id, index) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ORGANIZATION_USER)) {
      const toastId = promiseToast();
      setIsLoadingSwitches((prevState) => [...prevState, index]);

      fetchWithAxios.delete(`/organization_user?id=${user_organization_id}`)
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

  const { More } = useActiveInactiveAll({
    setORCatchAllURL: setORCatchAllURL,
    setORCatchAllParameter: 'org_id',
    setORCatchAllUpdate: () => queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base buttonId={buttonId}
            title={giveText(147)}
            hasSubmitButton={false}
            px={0}
            py={0}
            mr={0}
            ml={0}
            box_shadow={false}
            w={'650px'}
            Content={
              <Stack gap={2}>
                <HStack spacing={3}>
                  <Text my={'auto'} fontWeight={'500'} w={'200px'}>{giveText(131)}:</Text>
                  <User maxLengthTop={15}
                        maxLengthBottom={15}
                        userInfo={{
                          username: selectedOrganization.organization_name,
                          profile_pic: selectedOrganization.image,
                          email: selectedOrganization.mission,
                        }} />
                </HStack>

                <Separator borderColor={colorMode === 'light' ? 'black' : 'white'} />

                <Box w={'100%'}>
                  <Box mb={2}>
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
                  </Box>

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
                          {stableSort(allUsers, getComparator(order, orderBy)).map((row, index) => (
                            <UserTable key={row?.user_id}
                                       index={index}
                                       row={row}
                                       isLoadingSwitches={isLoadingSwitches}
                                       addOrganizationUserAxios={addOrganizationUserAxios}
                                       removeOrganizationUserAxios={removeOrganizationUserAxios} />
                          ))}
                        </TableBody>
                      </Table>

                      <ScrollToPaginate isLoading={isFetchingListAllUsers}
                                        lastElementRef={lastElementRef}
                                        hasPagination={true} />
                    </TableContainer>
                  </Box>
                </Box>

                {(accessSlice.isAdmin || accessSlice.userAccess?.includes(`${setORCatchAllURL}_post`)) &&
                  More({ id: selectedOrganization.organization_id })
                }
              </Stack>
            } />
    </motion.div>
  );
};
