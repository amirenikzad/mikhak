import { Box, Spinner, Text } from '@chakra-ui/react';
import { giveDir, giveText } from '../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableSortLabel from '@mui/material/TableSortLabel';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchWithAxios } from '../../../../../../Base/axios/FetchAxios.jsx';
import { MENU_BACKGROUND_DARK } from '../../../../../../Base/BaseColor.jsx';
import FloatingLabelInput from '../../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { useColorMode } from '../../../../../../ui/color-mode.jsx';
import { SearchIcon } from '../../../../../../Base/CustomIcons/SearchIcon.jsx';
import UserTable from './UserTable.jsx';
import ScrollToPaginate from '../../../../../../Base/CustomComponets/ScrollToPaginate.jsx';
import { CircularCrossFillIcon } from '../../../../../../Base/CustomIcons/CircularCrossFillIcon.jsx';

export default function UserTableTab({
                                       service_id,
                                       reactQueryItemName,
                                       addServiceUserOrganizationAxios,
                                       removeServiceUserOrganizationAxios,
                                     }) {
  const { colorMode } = useColorMode();
  const [allComponentCategory, setAllComponentCategory] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const observer = useRef(null);
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
    { id: 'name', numeric: false, disablePadding: true, label: giveText(0) },
    { id: 'active', numeric: false, disablePadding: false, label: giveText(2) },
  ], []);

  const allComponentCategoryAxios = async ({ pageParam = 1 }) => {
    try {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const newController = new AbortController();
      controllerRef.current = newController;

      const response = await fetchWithAxios.get(
        `/service_user_organization?id=${service_id}&page=${pageParam}&page_size=20&search=${searchValue}&type=user`,
        {
          signal: newController.signal,
        },
      );

      return response.data;
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') return;
      throw error;
    }
  };

  const {
    data: componentData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage: isFetchingListAllComponents,
    isRefetching,
    isError: errorGetAllRoles,
  } = useInfiniteQuery({
    queryKey: [reactQueryItemName, service_id, searchValue],
    queryFn: allComponentCategoryAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementRef = useCallback((node) => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingListAllComponents && !isRefetching) {
        fetchNextPage().then(() => null);
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextPage, hasNextPage, isFetchingListAllComponents, isLoading, isRefetching]);

  useEffect(() => {
    if (componentData) {
      setAllComponentCategory(componentData?.pages.flatMap((page) => page?.users));
    }
  }, [componentData]);

  return (
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
        {isFetchingListAllComponents &&
          <Box position={'absolute'} top={1} right={2} zIndex={'500 !important'}>
            <Spinner color={'blue.600'} />
          </Box>
        }
        {errorGetAllRoles && <Text>خطایی رخ داده است</Text>}

        <TableContainer component={Paper}
                        sx={{
                          backgroundColor: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
                          maxHeight: 300,
                          width: '100%',
                        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id}
                             sx={{
                               backgroundColor: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
                             }}
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
              {stableSort(allComponentCategory, getComparator(order, orderBy)).map((row, index) => (
                <UserTable key={row?.service_id}
                           index={index}
                           row={row}
                           reactQueryItemName={reactQueryItemName}
                           removeServiceUserOrganizationAxios={removeServiceUserOrganizationAxios}
                           addServiceUserOrganizationAxios={addServiceUserOrganizationAxios} />
              ))}
            </TableBody>
          </Table>

          <ScrollToPaginate isLoading={isFetchingListAllComponents}
                            lastElementRef={lastElementRef}
                            hasPagination={true} />
        </TableContainer>
      </Box>
    </Box>
  );
};
