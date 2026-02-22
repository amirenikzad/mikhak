import { Box, Spinner, Stack, Text } from '@chakra-ui/react';
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
import { useSelector } from 'react-redux';
import { fetchWithAxios } from '../../../../../../Base/axios/FetchAxios.jsx';
import { MENU_BACKGROUND_DARK } from '../../../../../../Base/BaseColor.jsx';
import FloatingLabelInput from '../../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { useColorMode } from '../../../../../../ui/color-mode.jsx';
import { SearchIcon } from '../../../../../../Base/CustomIcons/SearchIcon.jsx';
import ServiceTable from './ServiceTable.jsx';
import ScrollToPaginate from '../../../../../../Base/CustomComponets/ScrollToPaginate.jsx';
import { GET_ORGANIZATION_SERVICE_USER } from '../../../../../../Base/UserAccessNames.jsx';
import { CircularCrossFillIcon } from '../../../../../../Base/CustomIcons/CircularCrossFillIcon.jsx';

export default function OrganizationServicesTableTab({
                                                       org_id,
                                                       reactQueryItemName,
                                                       addServiceUserOrganizationAxios,
                                                       removeServiceUserOrganizationAxios,
                                                     }) {
  const { colorMode } = useColorMode();
  const accessSlice = useSelector(state => state.accessSlice);
  const [allOrganizationServices, setAllOrganizationServices] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const observer = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (!org_id) {
      setAllOrganizationServices([]);
    }
  }, [org_id]);

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
    { id: 'user', label: giveText(225) },
    { id: 'status', label: giveText(2) },
  ], []);

  const allOrganizationServiceAxios = async ({ pageParam = 1 }) => {
    if (org_id && (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ORGANIZATION_SERVICE_USER))) {
      try {
        if (controllerRef.current) {
          controllerRef.current.abort();
        }

        const newController = new AbortController();
        controllerRef.current = newController;

        const response = await fetchWithAxios.get(
          `/organization_service_user?id=${org_id}&page=${pageParam}&page_size=20&search=${searchValue}`,
          {
            signal: newController.signal,
          },
        );

        return {
          services: response.data.services,
          next_page: response.data.next_page,
        };
      } catch (error) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') return;
        throw error;
      }
    } else {
      return null;
    }
  };

  const {
    data: ServicesData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage: isFetchingListAllServices,
    isRefetching,
    isError: errorGetAllServices,
  } = useInfiniteQuery({
    queryKey: [reactQueryItemName, org_id, searchValue],
    queryFn: allOrganizationServiceAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementRef = useCallback((node) => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingListAllServices && !isRefetching) {
        fetchNextPage().then(() => null);
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextPage, hasNextPage, isFetchingListAllServices, isLoading, isRefetching]);

  useEffect(() => {
    if (ServicesData?.pages[0]) {
      setAllOrganizationServices(ServicesData?.pages.flatMap((page) => page?.services));
    }
  }, [ServicesData]);

  return (
    <Stack spacing={2} w={'100%'}>
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
        {isFetchingListAllServices &&
          <Box position={'absolute'} top={1} right={2} zIndex={'500 !important'}>
            <Spinner color={'blue.600'} />
          </Box>
        }
        {errorGetAllServices && <Text>خطایی رخ داده است</Text>}

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
              {stableSort(allOrganizationServices, getComparator(order, orderBy)).map((row, index) => (
                <ServiceTable key={row?.id}
                              index={index}
                              row={row}
                              reactQueryItemName={reactQueryItemName}
                              addServiceUserOrganizationAxios={addServiceUserOrganizationAxios}
                              removeServiceUserOrganizationAxios={removeServiceUserOrganizationAxios} />
              ))}
            </TableBody>
          </Table>

          <ScrollToPaginate isLoading={isFetchingListAllServices}
                            lastElementRef={lastElementRef}
                            hasPagination={true} />
        </TableContainer>
      </Box>
    </Stack>
  );
};
