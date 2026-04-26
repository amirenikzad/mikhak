import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState, useRef  } from 'react';
import {
  GET_ALL_USER,
  GET_ALL_ORGANIZATION,
  GET_SERVICE_USER_ORGANIZATION,
  GET_USER_SERVICE_ORGANIZATION,
  GET_ORGANIZATION_SERVICE_USER,
} from '../../../../Base/UserAccessNames.jsx';
import { ChevronTableName } from '../../../../Base/TableAttributes.jsx';
import { useTableBaseActions } from '../../../../Base/CustomHook/useTableBaseActions.jsx';
import { prouseTableBaseActions } from '../../../../Base/CustomHook/prouseTableBaseActions.jsx';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { DialogBody, DialogContent, DialogRoot } from '../../../../ui/dialog.jsx';
import { BaseHeaderPage } from '../../BaseHeaderPage.jsx';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import ServiceUserOrganizationTable from './ServiceUserOrganizationTable.jsx';
import { Box, HStack } from '@chakra-ui/react';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import FloatingLabelSearchSelectScrollPaginationInput from '../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';

const EditServiceUserOrganization = lazy(() => import('./Edit/EditServiceUserOrganization'));
const AdvancedServiceOrganization = lazy(() => import('./Advanced/AdvancedServiceOrganization'));

export default function ServiceUserOrganization() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [open, setOpen] = useState([]);
  const [selectedService, setSelectedService] = useState({
    fa_name: null,
    service_id: null,
  });
  const [isOpenAddAdvanced, setIsOpenAddAdvanced] = useState(false);
  const [isOpenConfig, setIsOpenConfig] = useState(false);
  const dispatch = useDispatch();
  const removeId = useMemo(() => 'service_ids', []);
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'get_service_user_organization_list', []);
  const [totalCountLabel, setTotalCountLabel] = useState(0);

  const [selectedOrganizationFilter, setSelectedOrganizationFilter] = useState({
    id: '',
    name: '',
  });

  const [selectedServiceFilter, setSelectedServiceFilter] = useState({
    id: '',
    name: '',
  });

  const [searchedOrganizationValue, setSearchedOrganizationValue] = useState('');
  const [searchedServiceValue, setSearchedServiceValue] = useState('');

  const organizationController = new AbortController();
  const serviceController = new AbortController();

  const observerOrganization = useRef(null);
  const observerService = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const allOrganizations = async ({ pageParam = 1 }) => {
    const res = await fetchWithAxios.get(
      `/organization/all?page=${pageParam}&page_size=20&search=${searchedOrganizationValue}`,
      { signal: organizationController.signal }
    );

    return {
      organizations: res.data.organizations || [],
      next_page: res.data.next_page,
    };
  };

  const {
    data: organizationsData,
    fetchNextPage: fetchNextOrganizations,
    hasNextPage: hasNextOrganizationPage,
    isFetchingNextPage: isFetchingOrganizations,
    isLoading: isLoadingOrganizations,
  } = useInfiniteQuery({
    queryKey: ['all_organizations_list', searchedOrganizationValue],
    queryFn: allOrganizations,
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage?.next_page,
  });

  const organizationsList = useMemo(
      () => organizationsData?.pages.flatMap(p => p.organizations) || [],
      [organizationsData]
    );
  
  const allServices = async ({ pageParam = 1 }) => {
    const res = await fetchWithAxios.get(
      `/services/all?page=${pageParam}&page_size=20&search=${searchedServiceValue}`,
      { signal: serviceController.signal }
    );

    return {
      services: res.data.services || [],
      next_page: res.data.next_page,
    };
  };

  const {
    data: servicesData,
    fetchNextPage: fetchNextServices,
    hasNextPage: hasNextServicePage,
    isFetchingNextPage: isFetchingServices,
    isLoading: isLoadingServices,
  } = useInfiniteQuery({
    queryKey: ['all_services_list', searchedServiceValue],
    queryFn: allServices,
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage?.next_page,
  });

  const servicesList = useMemo(
    () => servicesData?.pages.flatMap(p => p.services) || [],
    [servicesData]
  );

  const organizationSelect = () => (
    <Box w="200px">
      <FloatingLabelSearchSelectScrollPaginationInput
        label={giveText(131)} // Organization
        list={organizationsList}
        usernameKey="name"
        lastElementUserRef={observerOrganization}
        loading={isFetchingOrganizations}
        value={searchedOrganizationValue}
        onChange={(e) => {
          organizationController.abort();
          setSearchedOrganizationValue(e.target.value);
        }}
        onClear={() => {
          setSearchedOrganizationValue('');
          setSelectedOrganizationFilter({ id: '', name: '' });
        }}
        onSelectMethod={(v) => {
          setSelectedOrganizationFilter({
            id: v.id,
            name: v.name,
          });
          setSearchedOrganizationValue(v.name);
        }}
      />
    </Box>
  );

  const serviceSelect = () => (
    <Box w="200px">
      <FloatingLabelSearchSelectScrollPaginationInput
        label={giveText(225)}
        list={servicesList}
        usernameKey="fa_name"
        lastElementUserRef={observerService}
        loading={isFetchingServices}
        value={searchedServiceValue}
        onChange={(e) => {
          serviceController.abort();
          setSearchedServiceValue(e.target.value);
        }}
        onClear={() => {
          setSearchedServiceValue('');
          setSelectedServiceFilter({ id: '', name: '' });
        }}
        onSelectMethod={(v) => {
          setSelectedServiceFilter({
            id: v.id,
            name: v.fa_name,
          });
          setSearchedServiceValue(v.fa_name);
        }}
      />
    </Box>
  );

  // const queryParameter = useMemo(() => {
  //   let q = '';

  //   if (selectedOrganizationFilter.name) {
  //     q += `&org_id=${encodeURIComponent(selectedOrganizationFilter.id)}`;
  //   }

  //   if (selectedServiceFilter.name) {
  //     q += `&service_id=${encodeURIComponent(selectedServiceFilter.id)}`;
  //   }
  //   q.page = currentPage;
  //   q.page_size = pageSize;

  //   return q;
  // }, [
  //   selectedOrganizationFilter.name,
  //   selectedServiceFilter.name,
  //   currentPage, pageSize
  // ]);
  const queryParameter = useMemo(() => {
    const params = [];

    if (selectedOrganizationFilter.name) {
      params.push(`org_id=${encodeURIComponent(selectedOrganizationFilter.id)}`);
    }

    if (selectedServiceFilter.name) {
      params.push(`service_id=${encodeURIComponent(selectedServiceFilter.id)}`);
    }

    params.push(`page=${currentPage}`);
    params.push(`page_size=${pageSize}`);

    return '&' + params.join('&');
  }, [
    selectedOrganizationFilter.name,
    selectedOrganizationFilter.id,
    selectedServiceFilter.name,
    selectedServiceFilter.id,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(224) },
      { type: 'text', text: giveText(321) },
    ]));
  }, []);

  const hasAccess = useMemo(() => {
    return (accessSlice.isAdmin || (accessSlice.userAccess?.includes(GET_SERVICE_USER_ORGANIZATION)));
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  const hasAccessAdvance = useMemo(() => {
    return accessSlice.isAdmin ||
      (accessSlice.userAccess?.includes(GET_ALL_ORGANIZATION) && accessSlice.userAccess?.includes(GET_ORGANIZATION_SERVICE_USER)) ||
      (accessSlice.userAccess?.includes(GET_ALL_USER) && accessSlice.userAccess?.includes(GET_USER_SERVICE_ORGANIZATION));
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const headCellsValues = useMemo(() => [
    ChevronTableName,
    {
      id: 'fa_name',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(225)}
          {/* <Box 
            minW="25px"
            h="25px"
            bg="blue.500"
            color="white"
            borderRadius="50%"
            fontSize="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {totalCountLabel}
          </Box> */}
          
        </Box>
      )
    },
    // { id: 'fa_name', label: giveText(225) },
    { id: 'user', label: giveText(0) },
    { id: 'organization', label: giveText(131) },
  ], [totalCountLabel]);

  const onShiftN = useCallback(() => {
    setIsOpenAddAdvanced(true);
  }, []);

  const {
    listValue,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    lastElementRef,
    controller,
  } = useTableBaseActions({
    getAllURL: '/service_user_organization/all',
    update: updated,
    onShiftA: onShiftN,
    checkAccess: hasAccess,
    headCellsValues: headCellsValues,
    responseKey: 'services',
    searchValue: searchValue,
    removeURL: '/service_user_organization/all',
    removeId: removeId,
    removeIdRequest: 'org_ids',
    reactQueryItemName: reactQueryItemName,

    queryParameter,
  });

  useEffect(() => {
  setTotalCountLabel(totalCount ?? 0);
}, [totalCount]);

  useEffect(() => {
    setOpen(Array(listValue.length).fill(false));
  }, [listValue.length]);

  const sortedListValue = useMemo(() => {
    return stableSort(listValue, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, listValue]);

  const onOpenAdd = useCallback(() => setIsOpenAddAdvanced(true), []);
  const onOpenConfig = useCallback((e) => {
    if (!e.open) updated();
    setIsOpenConfig(e.open);
  }, []);
  const onOpenAddAdvanced = useCallback((e) => {
    if (!e.open) updated();
    setIsOpenAddAdvanced(e.open);
  }, []);

    const totalPages = useMemo(() => {
    const count = totalCount ?? 0;
    return Math.max(1, Math.ceil(count / pageSize));
  }, [totalCount, pageSize]);

  useEffect(() => {
    if (totalCount == null) return; 
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, totalCount]);

  const onNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const onPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return <>
    <BaseHeaderPage hasAddButton={hasAccessAdvance}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(321)}
                    <Box 
                      minW="25px"
                      h="25px"
                      bg="blue.500"
                      color="white"
                      borderRadius="50%"
                      fontSize="12px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {totalCountLabel}
                    </Box>
                    
                  </Box>}
                    description={giveText(322)}
                    addTitle={giveText(102)}
                    onOpenAdd={onOpenAdd}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    controller={controller}
                    
                    extension={
                      <HStack>
                        {organizationSelect()}
                        {serviceSelect()}
                      </HStack>
                    }
                    />

    <BaseTablePage isLoadingListAllUsers={isFetching}
                   headCells={headCells}
                   order={order}
                   orderBy={orderBy}
                   setOrderBy={setOrderBy}
                   setOrder={setOrder}
                   lastElementRef={lastElementRef}

                   currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={onNextPage}
                    onPreviousPage={onPreviousPage}
                    showPageNavigator={true}
                    hasPagination={false}
                   body={sortedListValue?.map((row, index) => (
                     <ServiceUserOrganizationTable key={row.id}
                                                   row={row}
                                                   open={open}
                                                   setOpen={setOpen}
                                                   index={index}
                                                   hasAccess={hasAccess}
                                                   setIsOpenConfig={setIsOpenConfig}
                                                   setSelectedService={setSelectedService} />
                   ))} 
                   />

    <DialogRoot lazyMount placement={'center'} open={isOpenConfig} onOpenChange={onOpenConfig}>
      <DialogContent maxW={'55rem'}>
        <DialogBody minH={'550px'}>
          <Suspense fallback={'loading...'}>
            <EditServiceUserOrganization selectedCategory={selectedService} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} open={isOpenAddAdvanced} onOpenChange={onOpenAddAdvanced}>
      <DialogContent maxW={'50rem'}>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AdvancedServiceOrganization />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  </>;
}
