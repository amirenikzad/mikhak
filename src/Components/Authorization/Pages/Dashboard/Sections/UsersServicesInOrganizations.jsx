import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { giveDir, giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import {
  GET_ALL_SERVICES,
  GET_ALL_ORGANIZATION,
  GET_ORGANIZATION_USERS_COUNT,
} from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { BaseLineChart } from './Base/BaseLineChart.jsx';
import { Box, Center, Grid, GridItem, HStack, Spinner, Text, Tabs, createListCollection } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { ChevronDownOutlineIcon } from '../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { useSearchParams } from 'react-router';
import FloatingLabelSelect from '../../../../Base/CustomComponets/FloatingLabelSelect.jsx';
import { Tooltip } from '../../../../ui/tooltip.jsx';

export const UsersServicesInOrganizations = memo(function UsersServicesInOrganizations({ barHeight }) {
  const orgName = useMemo(() => 'org_name', []);
  const orgId = useMemo(() => 'org_id', []);
  const serviceNameEn = useMemo(() => 'service_name_en', []);
  const serviceNameFA = useMemo(() => 'service_name_fa', []);
  const serviceId = useMemo(() => 'service_id', []);
  const monthName = useMemo(() => 'month_name', []);
  const accessSlice = useSelector(state => state.accessSlice);
  const refetchInterval = useMemo(() => 5 * 60 * 1000, []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrganization, setSelectedOrganization] = useState({
    [orgName]: searchParams.get(orgName) || '',
    [orgId]: searchParams.get(orgId) || '',
  });
  const [selectedService, setSelectedService] = useState({
    [serviceNameEn]: searchParams.get(serviceNameEn) || '',
    [serviceNameFA]: searchParams.get(serviceNameFA) || '',
    [serviceId]: searchParams.get(serviceId) || '',
  });
  const [searchedSelectOrganizationValue, setSearchedSelectOrganizationValue] = useState(selectedOrganization.value || '');
  const [organizationsOptions, setOrganizationsOptions] = useState([]);
  const [searchedSelectServiceValue, setSearchedSelectServiceValue] = useState(selectedService[giveDir() === 'rtl' ? serviceNameFA : serviceNameEn] || '');
  const [servicesOptions, setServicesOptions] = useState([]);
  const servicesObserver = useRef(null);
  const OrganizationObserver = useRef(null);
  const [selectedMonth, setSelectedMonth] = useState(searchParams.has(monthName) ? [searchParams.get(monthName)] : ['6']);
  const monthsOptions = createListCollection({
    items: [
      { value: '1', label: '1' },
      { value: '3', label: '3' },
      { value: '6', label: '6' },
      { value: '12', label: '12' },
    ],
  });
  const chartController = new AbortController();
  const selectOrganizationController = new AbortController();
  const selectServicesController = new AbortController();
  const serviceInputRef = useRef(null);
  const organizationInputRef = useRef(null);

  const [searchedSelectOrganizationUserValue, setSearchedSelectOrganizationUserValue] = useState('');
  const [organizationUsersOptions, setOrganizationUsersOptions] = useState([]);
  const organization_id = selectedOrganization[orgId] ?? '';
  const [orgInitialized, setOrgInitialized] = useState(false);

  const [selectedOrganizationUser, setSelectedOrganizationUser] = useState({
    username: '',
    id: '',
  });

  useEffect(() => {
    setSelectedOrganizationUser({ username: '', id: '' });
    setSearchedSelectOrganizationUserValue('');
    setOrganizationUsersOptions([]);
  }, [selectedOrganization[orgId]]);



  const usersOrganizationsAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ORGANIZATION_USERS_COUNT)) {
      const response = await fetchWithAxios.get(
        // `/organizations_users/count?org_id=${selectedOrganization[orgId] || 'all'}&service_name=${selectedService[serviceNameEn] || 'all'}&months=${parseInt(selectedMonth[0])}`,
        `/organizations_users/count?org_id=${selectedOrganization[orgId] || 'all'}&service_name=${selectedService[serviceNameEn] || 'all'}&user_id=${selectedOrganizationUser.id || ''}&months=${parseInt(selectedMonth[0])}`,
        {
          signal: chartController.signal,
        },
      );
      let period = [];
      let request_count = [];
      let total_amount = [];
      response.data.result.map((value) => {
        period.push(value.period);
        request_count.push(value.request_count);
        total_amount.push(value.total_amount);
      });

      return [period, request_count, total_amount];
    } else {
      return null;
    }
  };

  const {
    data: usersOrganizationsData,
    isFetching,
  } = useQuery({
    queryKey: ['usersOrganizations', selectedOrganization, selectedService, accessSlice, selectedMonth, selectedOrganizationUser],
    queryFn: usersOrganizationsAxios,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  const allOrganizations = async ({ pageParam = 1 }) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_ORGANIZATION)) {
      try {
        const response = await fetchWithAxios.get(
          `/organization/all?page=${pageParam}&page_size=20&search=${searchedSelectOrganizationValue}`,
          {
            signal: selectOrganizationController.signal,
          },
        );

        return {
          organizations: response.data.organizations,
          next_page: response.data.next_page,
        };
      } catch (error) {
        throw error;
      }
    }
  };

  const {
    data: organizationsData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage: isFetchingOrganizations,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['all_organization_data_list', searchedSelectOrganizationValue],
    queryFn: allOrganizations,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  //.............................
  const organizationsUser = async ({ pageParam = 1 }) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_ORGANIZATION)) {
      try {
        const response = await fetchWithAxios.get(
          // `/users_organization?org_id=${organization_id}&page=${pageParam}&page_size=20&search=${searchedSelectOrganizationUserValue}`
          `/users_organization?org_id=${selectedOrganization[orgId]}&page=${pageParam}&page_size=20&search=${searchedSelectOrganizationUserValue}`
        );

        return {
          users: response.data.items,
          next_page: response.data.next_page,
        };
      } catch (error) {
        throw error;
      }
    }
  };

  const {
    data: organizationUsersData,
    fetchNextPage: fetchNextOrganizationUsers,
    hasNextPage: organizationUsersHasNextPage,
    isFetchingNextPage: isFetchingOrganizationUsers,
    isLoading: isLoadingOrganizationUsers,
    isRefetching: isRefetchingOrganizationUsers,
  } = useInfiniteQuery({
    queryKey: ['organization_user_list', organization_id, searchedSelectOrganizationUserValue],
    queryFn: organizationsUser,
    // enabled: !!selectedOrganization[orgId] && selectedOrganization[orgId] !== 'all',
    enabled: !!selectedOrganization[orgId] &&
      selectedOrganization[orgId] !== '' &&
      selectedOrganization[orgId] !== 'all',
      
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const organizationUsersObserver = useRef(null);

  const lastElementOrganizationUserRef = useCallback((node) => {
    if (isLoadingOrganizationUsers) return;

    if (organizationUsersObserver.current)
      organizationUsersObserver.current.disconnect();

    organizationUsersObserver.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        organizationUsersHasNextPage &&
        !isFetchingOrganizationUsers &&
        !isRefetchingOrganizationUsers
      ) {
        fetchNextOrganizationUsers();
      }
    });

    if (node) organizationUsersObserver.current.observe(node);
  }, [
    fetchNextOrganizationUsers,
    organizationUsersHasNextPage,
    isFetchingOrganizationUsers,
    isLoadingOrganizationUsers,
    isRefetchingOrganizationUsers,
  ]);



  useEffect(() => {
    if (organizationUsersData) {
      setOrganizationUsersOptions(
        organizationUsersData?.pages.flatMap((p) => p.users)
      );
    }
  }, [organizationUsersData]);








  const lastElementOrganizationRef = useCallback((node) => {
    if (isLoading) return;

    if (OrganizationObserver.current) OrganizationObserver.current.disconnect();

    OrganizationObserver.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetching && !isRefetching) {
        fetchNextPage().then(() => null);
      }
    });

    if (node) OrganizationObserver.current.observe(node);
  }, [fetchNextPage, hasNextPage, isFetching, isLoading, isRefetching]);

  useEffect(() => {
    if (organizationsData) {
      setOrganizationsOptions(organizationsData?.pages.flatMap((page) => page?.organizations));
    }
  }, [organizationsData]);

  const allServices = async ({ pageParam = 1 }) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_SERVICES)) {
      try {
        const response = await fetchWithAxios.get(
          `/services/all?page=${pageParam}&page_size=20&search=${searchedSelectServiceValue}`,
          {
            signal: selectServicesController.signal,
          },
        );

        // const services = response.data.services.filter((service) => service.for_sell !== false);
        const services = response.data.services;

        return {
          services: services,
          next_page: response.data.next_page,
        };
      } catch (error) {
        throw error;
      }
    }
  };

  const {
    data: servicesData,
    fetchNextPage: fetchingNectPageServices,
    hasNextPage: serviceHasNextPage,
    isLoading: servicesIsLoading,
    isFetchingNextPage: isFetchingServices,
    isRefetching: serviceIsRefetching,
  } = useInfiniteQuery({
    queryKey: ['all_services_list', searchedSelectServiceValue],
    queryFn: allServices,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementServicesRef = useCallback((node) => {
    if (servicesIsLoading) return;

    if (servicesObserver.current) servicesObserver.current.disconnect();

    servicesObserver.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && serviceHasNextPage && !isFetchingServices && !serviceIsRefetching) {
        fetchingNectPageServices().then(() => null);
      }
    });

    if (node) servicesObserver.current.observe(node);
  }, [fetchingNectPageServices, serviceHasNextPage, isFetchingServices, servicesIsLoading, serviceIsRefetching]);

  useEffect(() => {
    if (servicesData) {
      setServicesOptions(servicesData?.pages.flatMap((page) => page?.services));
    }
  }, [servicesData]);

  const saveSelectedParams = useCallback(({ uname_fa, uname_fa_key, uname_en, uname_en_key, uid, uid_key }) => {
    const newParams = new URLSearchParams(searchParams);
    if (uname_fa) newParams.set(uname_fa_key, uname_fa);
    if (uname_en) newParams.set(uname_en_key, uname_en);
    if (uid) newParams.set(uid_key, uid);

    setSearchParams(newParams);
  }, [setSearchParams]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (!searchParams.has(orgName) || !searchParams.has(orgId)) {
      newParams.set(orgName, giveDir() === 'rtl' ? 'همه' : 'all');
      newParams.set(orgId, giveDir() === 'rtl' ? 'همه' : 'all');
      setSearchedSelectOrganizationValue('all');
    }
    if (!searchParams.has(serviceNameEn) || !searchParams.has(serviceNameFA) || !searchParams.has(serviceId)) {
      newParams.set(serviceNameEn, 'all');
      newParams.set(serviceNameFA, 'همه');
      newParams.set(serviceId, 'all');
      setSearchedSelectServiceValue('all');
    }
    setSearchParams(newParams);
  }, []);

  const deleteSelectedParams = (keys = []) => {
    const newParams = new URLSearchParams(searchParams);

    keys.map(key => {
      if (newParams.has(key)) newParams.delete(key);
    });

    setSearchParams(newParams);
  };

  return (
    <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.01 }}>
      <Tabs.Root defaultValue="request_base"
                 variant="subtle"
                 colorPalette={'cyan'}
                 borderWidth={1}
                 gap={0}
                 py={4}
                 px={4}
                 boxShadow={'lg'}
                 borderRadius={8}>
        <Grid templateColumns="repeat(3, 1fr)" gap={1}>
          <GridItem colSpan={1} my={'auto'}>
            <Text px={4} fontSize={'18px'} fontWeight={'500'} cursor={'default'}>{giveText(372)}</Text>
          </GridItem>

          <GridItem colSpan={2} my={'auto'} dir={giveDir(true)}>
            <HStack spacing={1} direction={'column'}>
              <Tabs.List rounded="l3" p="1">
                <Tabs.Trigger px={2} value="request_base">{giveText(406)}</Tabs.Trigger>
                <Tabs.Trigger px={2} value="amount_base">{giveText(407)}</Tabs.Trigger>
              </Tabs.List>

              {/* Organization */}
              <FloatingLabelSearchSelectScrollPaginationInput label={giveText(131)}
                                                              placeholder={''}
                                                              dir={'ltr'}
                                                              usernameKey={'name'}
                                                              // inputWidth={'60px'}
                                                              isFetching={isFetchingOrganizations}
                                                              list={[{
                                                                name: giveDir() === 'rtl' ? 'همه' : 'all',
                                                                id: 'all',
                                                              }, ...organizationsOptions]}
                                                              lastElementUserRef={lastElementOrganizationRef}
                                                              loading={isFetchingOrganizations}
                                                              hasInputLeftElement={true}
                                                              hasInputRightElement={true}
                                                              value={searchedSelectOrganizationValue}
                                                              ref={organizationInputRef}
                                                              InputLeftElementIcon={(
                                                                <ChevronDownOutlineIcon width={'1rem'} />
                                                              )}
                                                              onChange={(event) => {
                                                                selectOrganizationController.abort();
                                                                chartController.abort();
                                                                setSearchedSelectOrganizationValue(event.target.value);
                                                              }}
                                                              onKeyDown={(event) => {
                                                                if (event.key === 'Backspace') {
                                                                  selectOrganizationController.abort();
                                                                  chartController.abort();
                                                                  setSelectedOrganization({
                                                                    [orgId]: '',
                                                                    [orgName]: '',
                                                                  });
                                                                  setSearchedSelectOrganizationValue('');
                                                                  deleteSelectedParams([orgName, orgId]);
                                                                }
                                                              }}
                                                              onClear={() => {
                                                                  setSearchedSelectOrganizationValue('');
                                                                  setSelectedOrganization({ [orgId]: '', [orgName]: '' });
                                                                  deleteSelectedParams([orgName, orgId]);
                                                                }}
                                                              onSelectMethod={(value) => {
                                                                selectOrganizationController.abort();
                                                                chartController.abort();
                                                                setSelectedOrganization({
                                                                  [orgId]: value.id,
                                                                  [orgName]: value.name,
                                                                });
                                                                setSearchedSelectOrganizationValue(value.name);
                                                                saveSelectedParams({
                                                                  uname_fa: value.name,
                                                                  uname_fa_key: orgName,
                                                                  uid: value.id,
                                                                  uid_key: orgId,
                                                                });
                                                                // if (giveDir() === 'rtl') {
                                                                //   setSearchedSelectOrganizationValue(value.fa_name);
                                                                // } else {
                                                                //   setSearchedSelectOrganizationValue(value.en_name);
                                                                // }
                                                              }} />

              {/* {selectedOrganization[orgId] && selectedOrganization[orgId] !== '' && selectedOrganization[orgId] !== 'all' && ( */}
              {(!selectedOrganization[orgId] ||
                      selectedOrganization[orgId] === '' ||
                      selectedOrganization[orgId] === 'all') ? (
                <Tooltip
                  bg={'black'}
                  color={'white'}
                  content={giveText(451)}
                  fontWeight={'bold'}
                >
                  <FloatingLabelSearchSelectScrollPaginationInput
                    label={giveText(147)}
                    picKey={''}
                    dir={'ltr'}
                    usernameKey={'username'}
                    isFetching={isFetchingOrganizationUsers}
                    list={organizationUsersOptions}
                    lastElementUserRef={lastElementOrganizationUserRef}
                    loading={isFetchingOrganizationUsers}
                    hasInputLeftElement={true}
                    hasInputRightElement={true}
                    value={searchedSelectOrganizationUserValue}
                    onChange={(event) => {
                      setSearchedSelectOrganizationUserValue(event.target.value);
                    }}
                    onClear={() => {
                      setSearchedSelectOrganizationUserValue('');
                      setOrganizationUsersOptions([]);

                      setSelectedOrganizationUser({ username: '', id: '' });
                    }}
                    onSelectMethod={(value) => {
                      setSearchedSelectOrganizationUserValue(value.username);
                      setSelectedOrganizationUser({ username: value.username, id: value.id });

                    }}

                    disabled={
                      !selectedOrganization[orgId] ||
                      selectedOrganization[orgId] === '' ||
                      selectedOrganization[orgId] === 'all'
                    }

                  />
                </Tooltip>
              ) : (
                <FloatingLabelSearchSelectScrollPaginationInput
                  label={giveText(147)}
                  picKey={''}
                  dir={'ltr'}
                  usernameKey={'username'}
                  isFetching={isFetchingOrganizationUsers}
                  list={organizationUsersOptions}
                  lastElementUserRef={lastElementOrganizationUserRef}
                  loading={isFetchingOrganizationUsers}
                  hasInputLeftElement={true}
                  hasInputRightElement={true}
                  value={searchedSelectOrganizationUserValue}
                  onChange={(event) => {
                    setSearchedSelectOrganizationUserValue(event.target.value);
                  }}
                  onClear={() => {
                    setSearchedSelectOrganizationUserValue('');
                    setOrganizationUsersOptions([]);

                    setSelectedOrganizationUser({ username: '', id: '' });
                  }}
                  onSelectMethod={(value) => {
                    setSearchedSelectOrganizationUserValue(value.username);
                    setSelectedOrganizationUser({ username: value.username, id: value.id });

                  }}

                  disabled={
                    !selectedOrganization[orgId] ||
                    selectedOrganization[orgId] === '' ||
                    selectedOrganization[orgId] === 'all'
                  }

                />
              )}


              {/* SERVICE */}
              <FloatingLabelSearchSelectScrollPaginationInput label={giveText(225)}
                                                              placeholder={''}
                                                              dir={'ltr'}
                                                              usernameKey={giveDir() === 'rtl' ? 'fa_name' : 'en_name'}
                                                              // inputWidth={'80px'}
                                                              isFetching={isFetchingServices}
                                                              list={[{
                                                                fa_name: 'همه',
                                                                en_name: 'all',
                                                                id: 'all',
                                                              }, ...servicesOptions]}
                                                              lastElementUserRef={lastElementServicesRef}
                                                              loading={isFetchingServices}
                                                              hasInputLeftElement={true}
                                                              hasInputRightElement={true}
                                                              value={searchedSelectServiceValue}
                                                              InputLeftElementIcon={(
                                                                <ChevronDownOutlineIcon width={'1rem'} />
                                                              )}
                                                              ref={serviceInputRef}
                                                              // InputRightElement={(
                                                              //                     <HStack mx={2}>
                                                              //                       {/* {InputLeftElement} */}
                                                  
                                                              //                       {searchedSelectServiceValue &&
                                                              //                         <Box cursor={'pointer'} 
                                                              //                             // onClick={() => {
                                                              //                             //     setSearchedSelectServiceValue('');
                                                              //                             //     serviceInputRef.current?.focus();
                                                              //                             //   }}
                                                              //                             onMouseDown={(e) => {
                                                              //                                           e.preventDefault();
                                                              //                                           setSearchedSelectServiceValue('');
                                                              //                                           serviceInputRef.current?.focus();
                                                              //                                         }}
                                                              //                               >
                                                              //                           <CircularCrossFillIcon color={'red'} width={'1rem'} />
                                                              //                         </Box>
                                                              //                       }
                                                              //                     </HStack>
                                                              //                   )}
                                                          
                                                              onClear={() => {
                                                                  setSearchedSelectServiceValue(''); 
                                                                  setSelectedService({ [serviceId]: '', [serviceNameFA]: '', [serviceNameEn]: '' });
                                                                  deleteSelectedParams([serviceNameFA, serviceNameEn, serviceId]);
                                                                }}

                                                              onChange={(event) => {
                                                                selectServicesController.abort();
                                                                chartController.abort();
                                                                setSearchedSelectServiceValue(event.target.value);
                                                              }}
                                                              onKeyDown={(event) => {
                                                                if (event.key === 'Backspace') {
                                                                  selectServicesController.abort();
                                                                  chartController.abort();
                                                                  setSelectedService({
                                                                    [serviceId]: '',
                                                                    [serviceNameFA]: '',
                                                                    [serviceNameEn]: '',
                                                                  });
                                                                  setSearchedSelectServiceValue('');
                                                                  deleteSelectedParams([serviceNameFA, serviceNameEn, serviceId]);
                                                                }
                                                              }}
                                                              onSelectMethod={(value) => {
                                                                selectServicesController.abort();
                                                                chartController.abort();

                                                                setSelectedService({
                                                                  [serviceId]: value.id,
                                                                  [serviceNameFA]: value.fa_name,
                                                                  [serviceNameEn]: value.en_name,
                                                                });

                                                                saveSelectedParams({
                                                                  uname_fa: value.fa_name,
                                                                  uname_fa_key: serviceNameFA,
                                                                  uname_en: value.en_name,
                                                                  uname_en_key: serviceNameEn,
                                                                  uid: value.id,
                                                                  uid_key: serviceId,
                                                                });

                                                                if (giveDir() === 'rtl') {
                                                                  setSearchedSelectServiceValue(value.fa_name);
                                                                } else {
                                                                  setSearchedSelectServiceValue(value.en_name);
                                                                }
                                                              }} />

              <FloatingLabelSelect name={'months'}
                                   options={monthsOptions}
                                   w={'90px'}
                                   autoFocus
                                   label={giveText(405)}
                                   value={selectedMonth}
                                   onChange={(event) => {
                                     setSelectedMonth(event.value);
                                     saveSelectedParams({
                                       uname_fa: event.value,
                                       uname_fa_key: monthName,
                                     });
                                   }} />
            </HStack>
          </GridItem>
        </Grid>

        {isFetching ? (
          <Center h={barHeight} my={'auto'}>
            <Spinner size={'lg'} color={'green'} borderWidth={'4px'} />
          </Center>
        ) : (
          <>
            <Tabs.Content value="request_base">
              <BaseLineChart height={barHeight}
                             bgColors={'#0fa1a1'}
                             datasetLabels={giveText(409)}
                             labelsValues={usersOrganizationsData?.[0]}
                             dataValues={usersOrganizationsData?.[1]} />
            </Tabs.Content>
            <Tabs.Content value="amount_base">
              <BaseLineChart height={barHeight}
                             bgColors={'#9e2626'}
                             datasetLabels={giveText(410)}
                             labelsValues={usersOrganizationsData?.[0]}
                             dataValues={usersOrganizationsData?.[2]} />
            </Tabs.Content>
          </>
        )}
      </Tabs.Root>
    </motion.div>
  );
});
