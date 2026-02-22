import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, HStack, Separator, Spinner, Stack, Text } from '@chakra-ui/react';
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
import { MENU_BACKGROUND_DARK } from '../../../../../Base/BaseColor.jsx';
import FloatingLabelInput from '../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { useActiveInactiveAll } from '../../../../../Base/CustomHook/useActiveInactiveAll.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';
import { SearchIcon } from '../../../../../Base/CustomIcons/SearchIcon.jsx';
import PermissionTable from './PermissionTable.jsx';
import ScrollToPaginate from '../../../../../Base/CustomComponets/ScrollToPaginate.jsx';
import { CircularCrossFillIcon } from '../../../../../Base/CustomIcons/CircularCrossFillIcon.jsx';

export default function EditRolePermission({ selectedRole = {} }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const { colorMode } = useColorMode();
  const [allPermissions, setAllPermissions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const buttonId = useMemo(() => 'add_role_permission_submit_id', []);
  const reactQueryItemName = useMemo(() => 'get_permission_list', []);
  const setORCatchAllURL = useMemo(() => '/set_unset_role_perm', []);
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
    { id: 'name', numeric: false, disablePadding: true, label: giveText(37) },
    { id: 'active', numeric: false, disablePadding: false, label: giveText(2) },
  ], []);

  const allPermissionsAxios = async ({ pageParam = 1 }) => {
    try {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const newController = new AbortController();
      controllerRef.current = newController;

      const response = await fetchWithAxios.get(
        `/role_permission?id=${selectedRole.role_id}&page=${pageParam}&page_size=20&search=${searchValue}`,
        {
          signal: newController.signal,
        },
      );

      return response.data;
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        return [];
      }
      throw error;
    }
  };

  const {
    data: permissionData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage: isFetchingAllPermissions,
    isRefetching,
    isError: errorGetAllUsers,
  } = useInfiniteQuery({
    queryKey: [reactQueryItemName, selectedRole, searchValue],
    queryFn: allPermissionsAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementRef = useCallback((node) => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingAllPermissions && !isRefetching) {
        fetchNextPage().then(() => null);
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextPage, hasNextPage, isFetchingAllPermissions, isLoading, isRefetching]);

  useEffect(() => {
    if (permissionData) {
      setAllPermissions(permissionData?.pages.flatMap((page) => page?.permissions));
    }
  }, [permissionData]);

  const { More } = useActiveInactiveAll({
    setORCatchAllURL: setORCatchAllURL,
    setORCatchAllParameter: 'role_id',
    setORCatchAllUpdate: () => queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: 'inherit' }}>
      <Base buttonId={buttonId}
            title={giveText(68)}
            hasSubmitButton={false}
            px={0}
            ml={0}
            mr={0}
            w={'100%'}
            Content={
              <Stack gap={2}>
                <HStack spacing={3} cursor={'default'}>
                  <Text my={'auto'} fontWeight={'500'} fontSize={'17px'} w={'200px'}>{giveText(43)}:</Text>
                  <Text my={'auto'} fontWeight={'800'} fontSize={'17px'} w={'200px'}>{selectedRole.role_name}</Text>
                </HStack>

                <Separator borderColor={colorMode === 'light' ? 'black' : 'white'} />

                <Box w={'100%'}>
                  <FloatingLabelInput label={giveText(10)}
                                      value={searchValue}
                                      dir={giveDir()}
                                      mx={3}
                                      mb={2}
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
                    {isFetchingAllPermissions &&
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
                          {stableSort(allPermissions, getComparator(order, orderBy)).map((row, index) => (
                            <PermissionTable key={row?.permission_id}
                                             index={index}
                                             row={row}
                                             selectedRole={selectedRole}
                                             reactQueryItemName={reactQueryItemName} />
                          ))}
                        </TableBody>
                      </Table>

                      <ScrollToPaginate isLoading={isFetchingAllPermissions}
                                        lastElementRef={lastElementRef}
                                        hasPagination={true} />
                    </TableContainer>
                  </Box>
                </Box>

                {(accessSlice.isAdmin || accessSlice.userAccess?.includes(`${setORCatchAllURL}_post`)) &&
                  More({ id: selectedRole.role_id })
                }
              </Stack>
            } />
    </motion.div>
  );
};
