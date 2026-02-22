import { Box, Center, createListCollection, HStack, Select } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../BaseTablePage.jsx';
import { TableText } from '../../../Base/Extensions.jsx';
import { giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useTableBaseActions } from '../../../Base/CustomHook/useTableBaseActions.jsx';
import { fetchWithAxios } from '../../../Base/axios/FetchAxios.jsx';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { BaseHeaderPage } from '../BaseHeaderPage.jsx';
import { setBreadcrumbAddress } from '../../../../store/features/baseSlice.jsx';
import { ChevronDownOutlineIcon } from '../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import { CircularCrossFillIcon } from '../../../Base/CustomIcons/CircularCrossFillIcon.jsx';

export default function UserInfo() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [totalCountLabel, setTotalCountLabel] = useState(0);

  const [selectedUser, setSelectedUser] = useState({
    username: searchParams.get('uname') || '',
    id: searchParams.get('uid') || '',
  });
  const [searchedUserValue, setSearchedUserValue] = useState(searchParams.get('uname') || '');

  const [selectedOrg, setSelectedOrg] = useState({
    name: searchParams.get('org_name') || '',
    id: searchParams.get('org_id') || '',
  });
  const [searchedOrgValue, setSearchedOrgValue] = useState(searchParams.get('org_name') || '');

  const accessSlice = useSelector(state => state.accessSlice);
  const observer = useRef(null);
  const selectUserController = new AbortController();
  const selectOrgController = new AbortController();

  // breadcrumb
  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(13) },
      { type: 'text', text: giveText(427) },
    ]));
  }, [dispatch]);

  const update = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['login_history_list'] }).then(() => null);
  }, []);
  const formatCount = (count) => {
    if (count > 99900) return '99k+';
    if (count >= 1000) return Math.round(count / 1000) + 'k';
    return count;
  };


  const headCellsValues = useMemo(() => [
    {
      id: 'username',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(0)}
          {/* <Box 
            minW="31px"
            h="30px"
            bg="blue.500"
            color="white"
            borderRadius="50%"
            fontSize="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {formatCount(totalCountLabel)}
          </Box> */}
          
        </Box>
      )
    },// { id: 'username', label: giveText(14) },
    { id: 'platform', label: giveText(430) },
    { id: 'organization', label: giveText(131) },
    { id: 'ip', label: giveText(176) },
    { id: 'country', label: giveText(398) },
    { id: 'os', label: giveText(394) },
    { id: 'time', label: giveText(399) },
    { id: 'browser', label: giveText(400) },
  ], [totalCountLabel]);


    const [selectedPlatform, setSelectedPlatform] = useState({
      platform_name: searchParams.get('platform_name') || '',
      id: searchParams.get('platform_id') || '',
    });

    const [searchedPlatformValue, setSearchedPlatformValue] = useState(
      searchParams.get('platform_name') || ''
    );

    // Fetch platforms
    const allPlatforms = async ({ pageParam = null }) => {
      try {
        const res = await fetchWithAxios.get(
          `/platform/all?page=${pageParam}&page_size=20&search=${searchedPlatformValue}`,
          { signal: selectUserController.signal } // می‌تونی controller جدا بسازی اگر خواستی
        );
        return { platforms: res.data.platforms || [], next_page: res.data.next_page };
      } catch (e) {
        throw e;
      }
    };

    const {
      data: platformsData,
      fetchNextPage: fetchNextPlatforms,
      hasNextPage: hasNextPlatformPage,
      isFetchingNextPage: isFetchingPlatforms,
      isLoading: isLoadingPlatforms,
    } = useInfiniteQuery({
      queryKey: ['all_platforms_list', searchedPlatformValue],
      queryFn: allPlatforms,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage?.next_page,
    });

    const lastPlatformRef = useCallback(
      (node) => {
        if (isLoadingPlatforms) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasNextPlatformPage && !isFetchingPlatforms) {
            fetchNextPlatforms();
          }
        });

        if (node) observer.current.observe(node);
      },
      [fetchNextPlatforms, hasNextPlatformPage, isFetchingPlatforms, isLoadingPlatforms]
    );

    const platformsList = useMemo(
      () => platformsData?.pages.flatMap((p) => p.platforms) || [],
      [platformsData]
    );

    // ذخیره و حذف پارامترهای platform در URL
    const saveSelectedPlatformParams = useCallback(
      ({ platform_name, platform_id }) => {
        const params = Object.fromEntries(searchParams);
        if (platform_name) params.platform_name = platform_name;
        if (platform_id) params.platform_id = platform_id;
        setSearchParams(params);
      },
      [setSearchParams, searchParams]
    );

    const deleteSelectedPlatformParams = useCallback(() => {
      const params = Object.fromEntries(searchParams);
      delete params.platform_name;
      delete params.platform_id;
      setSearchParams(params);
    }, [setSearchParams, searchParams]);

    const platformSelect = () => (
      <Box w="200px">
        <FloatingLabelSearchSelectScrollPaginationInput
          label={giveText(430)}
          placeholder=""
          dir="ltr"
          list={platformsList}
          usernameKey="platform_name"
          picKey=""                         
          lastElementUserRef={lastPlatformRef}
          loading={isFetchingPlatforms}
          hasInputLeftElement={true}
          hasInputRightElement={true}
          InputLeftElementIcon={<ChevronDownOutlineIcon width="1rem" />}
          onClear={() => {
            // selectUserController.abort();   ← اینجا بهتره controller جدا داشته باشی
            setSearchedPlatformValue('');
            setSelectedPlatform({ id: '', platform_name: '' });
            deleteSelectedPlatformParams();
          }}
          value={searchedPlatformValue}
          onChange={(e) => {
            // selectUserController.abort();
            setSearchedPlatformValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              // selectUserController.abort();
              setSelectedPlatform({ id: '', platform_name: '' });
              setSearchedPlatformValue('');
              deleteSelectedPlatformParams();
            }
          }}
          onSelectMethod={(v) => {
            // selectUserController.abort();
            setSelectedPlatform(v);
            setSearchedPlatformValue(v.platform_name);
            saveSelectedPlatformParams({ platform_name: v.platform_name, platform_id: v.id });
          }}
        />
      </Box>
    );

    const queryParameter = useMemo(() => {
      let q = '';
      if (selectedUser?.id)    q += `&user_id=${selectedUser.id}`;
      if (selectedOrg?.id)     q += `&org_id=${selectedOrg.id}`;
      if (selectedPlatform?.id) q += `&project=${selectedPlatform.id}`;
      return q;
    }, [selectedUser?.id, selectedOrg?.id, selectedPlatform?.id]);


  // const queryParameter = useMemo(() => {
  //   let q = '';
  //   if (selectedUser?.id) q += `&user_id=${selectedUser.id}`;
  //   if (selectedOrg?.id) q += `&org_id=${selectedOrg.id}`;
  //   return q;
  // }, [selectedUser?.id, selectedOrg?.id]);

  // fetch login history
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
    getAllURL: '/login_history/all',
    queryParameter,
    headCellsValues,
    update,
    hasAccessToRemove: false,
    responseKey: 'res',
    searchValue,
    reactQueryItemName: 'login_history_list',
    loadWhenIsTrue: true,
    useQueryDependsUpdate: [selectedUser.id, selectedOrg.id],
  });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  // Fetch users for select
  const allUsers = async ({ pageParam = 1 }) => {
    try {
      const res = await fetchWithAxios.get(
        `/user/all?page=${pageParam}&page_size=20&search=${searchedUserValue}`,
        { signal: selectUserController.signal },
      );
      return { users: res.data.users, next_page: res.data.next_page };
    } catch (e) { throw e; }
  };

  const {
    data: usersData,
    fetchNextPage: fetchNextUsers,
    hasNextPage: hasNextUserPage,
    isFetchingNextPage: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useInfiniteQuery({
    queryKey: ['all_users_list', searchedUserValue],
    queryFn: allUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastUserRef = useCallback((node) => {
    if (isLoadingUsers) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextUserPage && !isFetchingUsers) {
        fetchNextUsers();
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextUsers, hasNextUserPage, isFetchingUsers, isLoadingUsers]);

  const usersList = useMemo(
    () => usersData?.pages.flatMap(p => p.users) || [],
    [usersData],
  );

  // Fetch orgs
  const allOrgs = async ({ pageParam = 1 }) => {
    try {
      const res = await fetchWithAxios.get(
        `/organization/all?page=${pageParam}&page_size=20&search=${searchedOrgValue}`,
        { signal: selectOrgController.signal },
      );
      return { orgs: res.data.organizations, next_page: res.data.next_page };
    } catch (e) { throw e; }
  };

  const {
    data: orgsData,
    fetchNextPage: fetchNextOrgs,
    hasNextPage: hasNextOrgPage,
    isFetchingNextPage: isFetchingOrgs,
    isLoading: isLoadingOrgs,
  } = useInfiniteQuery({
    queryKey: ['all_orgs_list', searchedOrgValue],
    queryFn: allOrgs,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastOrgRef = useCallback((node) => {
    if (isLoadingOrgs) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextOrgPage && !isFetchingOrgs) {
        fetchNextOrgs();
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextOrgs, hasNextOrgPage, isFetchingOrgs, isLoadingOrgs]);

  const orgsList = useMemo(
    () => {
      console.log("orgsData",orgsData);

      return orgsData?.pages.flatMap(p => p.orgs) || []
    },
    [orgsData],
  );
  
  const saveSelectedUserParams = useCallback(({ uname, uid }) => {
    const params = Object.fromEntries(searchParams);
    if (uname) params.uname = uname;
    if (uid) params.uid = uid;
    setSearchParams(params);
  }, [setSearchParams, searchParams]);

  const deleteSelectedUserParams = useCallback(() => {
    const params = Object.fromEntries(searchParams);
    delete params.uname;
    delete params.uid;
    setSearchParams(params);
  }, [setSearchParams, searchParams]);

  const saveSelectedOrgParams = useCallback(({ org_name, org_id }) => {
    const params = Object.fromEntries(searchParams);
    if (org_name) params.org_name = org_name;
    if (org_id) params.org_id = org_id;
    setSearchParams(params);
  }, [setSearchParams, searchParams]);

  const deleteSelectedOrgParams = useCallback(() => {
    const params = Object.fromEntries(searchParams);
    delete params.org_name;
    delete params.org_id;
    setSearchParams(params);
  }, [setSearchParams, searchParams]);

  const userSelect = () => (
    <Box w="200px">
      <FloatingLabelSearchSelectScrollPaginationInput
        label={giveText(14)}
        placeholder=""
        dir="ltr"
        picKey={''}
        list={usersList}
        lastElementUserRef={lastUserRef}
        loading={isFetchingUsers}
        hasInputLeftElement={true}
        hasInputRightElement={true}
        InputLeftElementIcon={<ChevronDownOutlineIcon width="1rem" />}
        onClear={() => {
                        selectUserController.abort();         
                        setSearchedUserValue('');
                        setSelectedUser({ id: '', username: '' }); 
                        deleteSelectedUserParams();
                      }}
        value={searchedUserValue}
        onChange={(e) => {
          selectUserController.abort();
          setSearchedUserValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace') {
            selectUserController.abort();
            setSelectedUser({ id: '', username: '' });
            setSearchedUserValue('');
            deleteSelectedUserParams();
          }
        }}
        onSelectMethod={(v) => {
          selectUserController.abort();
          setSelectedUser(v);
          setSearchedUserValue(v.username);
          saveSelectedUserParams({ uname: v.username, uid: v.id });
        }}
      />
    </Box>
  );


  const orgSelect = () => (
    <Box w="200px">
      <FloatingLabelSearchSelectScrollPaginationInput
        label={giveText(131)}
        placeholder=""
        dir="ltr"
        list={orgsList}
        usernameKey="name"
        picKey="image"
        lastElementUserRef={lastOrgRef}
        loading={isFetchingOrgs}
        hasInputLeftElement={true}
        hasInputRightElement={true}
        InputLeftElementIcon={<ChevronDownOutlineIcon width="1rem" />}
        onClear={() => {
                        selectUserController.abort();         
                        setSearchedOrgValue('');
                        setSelectedOrg({ id: '', username: '' }); 
                        deleteSelectedOrgParams();
                      }}
        value={searchedOrgValue}
        onChange={(e) => {
          selectOrgController.abort();
          setSearchedOrgValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace') {
            selectOrgController.abort();
            setSelectedOrg({ id: '', name: '' });
            setSearchedOrgValue('');
            deleteSelectedOrgParams();
          }
        }}
        onSelectMethod={(v) => {
          selectOrgController.abort();
          setSelectedOrg(v);
          setSearchedOrgValue(v.name);
          saveSelectedOrgParams({ org_name: v.name, org_id: v.id });
        }}
      />
    </Box>
  );


  const sortedListValue = useMemo(
    () => stableSort(listValue, getComparator(order, orderBy)),
  
  // const saveSelectedUsator(order, orderBy)),
    [order, orderBy, stableSort, listValue],
  );

  return (
    <>
      <BaseHeaderPage
        hasAddButton={false}
        title={<Box display="flex" alignItems="center" gap="8px">
          {giveText(401)}
          <Box 
            minW="31px"
            h="30px"
            bg="blue.500"
            color="white"
            borderRadius="50%"
            fontSize="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {formatCount(totalCountLabel)}
          </Box>
          
        </Box>}
        description={giveText(402)}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        controller={controller}
        extension={<HStack>{userSelect()}{orgSelect()}{platformSelect()} </HStack>}
      />

      <BaseTablePage
        isLoadingListAllUsers={isFetching}
        headCells={headCells}
        order={order}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        setOrder={setOrder}
        lastElementRef={lastElementRef}
        body={sortedListValue?.map((row, index) => (
          <TableRow hover tabIndex={-1} key={index}>
            <TableCell align="center">
              <TableText cursor="default" text={row.username || '-'} maxLength={20} />
            </TableCell>
            <TableCell align="center">
              <TableText cursor="default" text={row.platform || '-'} maxLength={20} />
            </TableCell>
            <TableCell align="center">
              <TableText cursor="default" text={row.organization || '-'} maxLength={20} />
            </TableCell>
            <TableCell align="center">
              <TableText cursor="default" text={row.ip} maxLength={20} />
            </TableCell>
            <TableCell align="center">
              <TableText cursor="default" text={row.country} maxLength={10} />
            </TableCell>
            <TableCell align="center">
              <TableText cursor="default" text={row.os} maxLength={10} />
            </TableCell>
            <TableCell align="center">
              <TableText cursor="default" text={row.time} maxLength={40} />
            </TableCell>
            <TableCell align="center">
              <TableText cursor="default" text={row.browser} maxLength={40} />
            </TableCell>
          </TableRow>
        ))}
      />
    </>
  );
}