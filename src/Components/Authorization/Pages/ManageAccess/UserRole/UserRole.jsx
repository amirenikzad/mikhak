import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
  GET_ALL_ROLES,
  GET_USER_ROLE,
  GET_USERS_ROLE,
  DELETE_ALL_USER_ROLE,
} from '../../../../Base/UserAccessNames.jsx';
import { CheckBoxName, ChevronTableName } from '../../../../Base/TableAttributes.jsx';
import { useTableBaseActions } from '../../../../Base/CustomHook/useTableBaseActions.jsx';
import { prouseTableBaseActions } from '../../../../Base/CustomHook/prouseTableBaseActions.jsx';
import { useCheckboxTable } from '../../../../Base/CustomHook/useCheckboxTable.jsx';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { DialogBody, DialogContent, DialogRoot } from '../../../../ui/dialog.jsx';
import { BaseHeaderPage } from '../../BaseHeaderPage.jsx';
import { ActionBarTables } from '../../../../Base/ActionBar/ActionBarTables.jsx';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import UserRoleTable from './UserRoleTable.jsx';
import { Box, HStack } from '@chakra-ui/react';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import FloatingLabelSearchSelectScrollPaginationInput from '../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';

const AdvancedUserRole = lazy(() => import('./Advanced/AdvancedUserRole.jsx'));
const EditUserRole = lazy(() => import('./Edit/EditUserRole.jsx'));

export default function UserRole() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [open, setOpen] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);
  const [isOpenAdvanced, setIsOpenAdvanced] = useState(false);
  const dispatch = useDispatch();
  const removeId = useMemo(() => 'user_ids', []);
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'get_users_roles_list', []);
  const [totalCountLabel, setTotalCountLabel] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedUserFilter, setSelectedUserFilter] = useState({
    id: '',
    name: '',
  });

  const [selectedRoleFilter, setSelectedRoleFilter] = useState({
    id: '',
    name: '',
  });

  const [searchedUserValue, setSearchedUserValue] = useState('');
  const [searchedRoleValue, setSearchedRoleValue] = useState('');

  const userController = new AbortController();
  const roleController = new AbortController();

  const observerUser = useRef(null);
  const observerRole = useRef(null);

  const allUsers = async ({ pageParam = 1 }) => {
    const res = await fetchWithAxios.get(
      `/user/all?page=${pageParam}&page_size=20&search=${searchedUserValue}`,
      { signal: userController.signal }
    );

    return {
      users: res.data.users || [],
      next_page: res.data.next_page,
    };
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
    getNextPageParam: lastPage => lastPage?.next_page,
  });

  const usersList = useMemo(
    () => usersData?.pages.flatMap(p => p.users) || [],
    [usersData]
  );

  const allRoles = async ({ pageParam = 1 }) => {
    const res = await fetchWithAxios.get(
      `/role/all?page=${pageParam}&page_size=20&search=${searchedRoleValue}`,
      { signal: roleController.signal }
    );

    return {
      roles: res.data.roles || [],
      next_page: res.data.next_page,
    };
  };

  const {
    data: rolesData,
    fetchNextPage: fetchNextRoles,
    hasNextPage: hasNextRolePage,
    isFetchingNextPage: isFetchingRoles,
    isLoading: isLoadingRoles,
  } = useInfiniteQuery({
    queryKey: ['all_roles_list', searchedRoleValue],
    queryFn: allRoles,
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage?.next_page,
  });

  const rolesList = useMemo(
    () => rolesData?.pages.flatMap(p => p.roles) || [],
    [rolesData]
  );

  const userSelect = () => (
    <Box w="200px">
      <FloatingLabelSearchSelectScrollPaginationInput
        label={giveText(0)} // User
        list={usersList}
        usernameKey="username"
        lastElementUserRef={observerUser}
        loading={isFetchingUsers}
        value={searchedUserValue}
        onChange={(e) => {
          userController.abort();
          setSearchedUserValue(e.target.value);
        }}
        onClear={() => {
          setSearchedUserValue('');
          setSelectedUserFilter({ id: '', name: '' });
        }}
        onSelectMethod={(v) => {
          setSelectedUserFilter({
            id: v.id,
            name: v.username,
          });
          setSearchedUserValue(v.username);
        }}
      />
    </Box>
  );

  const roleSelect = () => (
    <Box w="200px">
      <FloatingLabelSearchSelectScrollPaginationInput
        label={giveText(46)} // Role
        list={rolesList}
        usernameKey="role_name"
        lastElementUserRef={observerRole}
        loading={isFetchingRoles}
        value={searchedRoleValue}
        onChange={(e) => {
          roleController.abort();
          setSearchedRoleValue(e.target.value);
        }}
        onClear={() => {
          setSearchedRoleValue('');
          setSelectedRoleFilter({ id: '', name: '' });
        }}
        onSelectMethod={(v) => {
          setSelectedRoleFilter({
            id: v.id,
            name: v.role_name,
          });
          setSearchedRoleValue(v.role_name);
        }}
      />
    </Box>
  );

  const queryParameter = useMemo(() => {
    let q = '';

    if (selectedUserFilter.id) {
      q += `&user_id=${selectedUserFilter.id}`;
    }

    if (selectedRoleFilter.id) {
      q += `&role_id=${selectedRoleFilter.id}`;
    }

    return q;
  }, [
    selectedUserFilter.id,
    selectedRoleFilter.id,
  ]);



  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(78) },
      { type: 'text', text: giveText(49) },
    ]));
  }, []);

  const hasAccessMore = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_USER_ROLE);
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  const hasAccessAdvance = useMemo(() => {
    return accessSlice.isAdmin || (accessSlice.userAccess?.includes(GET_USERS_ROLE) && accessSlice.userAccess?.includes(GET_ALL_ROLES));
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const openEditModal = (userRole) => {
    setSelectedUser({
      user_name: userRole.username,
      user_id: userRole.user_id,
    });
    setIsOpenRemoveModal(true);
  };

  const headCellsValues = useMemo(() => [
    CheckBoxName,
    ChevronTableName,
    {
      id: 'username',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(0)}
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
    // { id: 'username', label: giveText(0) },
    { id: 'roles', label: giveText(44) },
  ], [totalCountLabel]);

  const onShiftN = useCallback(() => {
    setIsOpenAdvanced(true);
  }, []);

  const {
    listValue: userRoleList,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    removeAxios,
    lastElementRef,
    controller,
  } = prouseTableBaseActions({
    getAllURL: '/user_role/all',
    update: updated,
    onShiftA: onShiftN,
    checkAccess: hasAccessMore,
    headCellsValues: headCellsValues,
    responseKey: 'users',
    searchValue: searchValue,
    removeURL: '/user_roles/all',
    removeId: removeId,
    removeIdRequest: 'user_ids',
    reactQueryItemName: reactQueryItemName,

    pageSize,
    additionalParams: useMemo(() => ({
      page: currentPage,
      page_size: pageSize,
    }), [currentPage, pageSize]),

    queryParameter,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, selectedUserFilter.id, selectedRoleFilter.id]);


  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ALL_USER_ROLE);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
  } = useCheckboxTable({
    listValue: userRoleList,
    listId: 'user_id',
    hasAccessCheckbox,
  });

  useEffect(() => {
    setOpen(Array(userRoleList.length).fill(false));
  }, [userRoleList.length]);

  const sortedListValue = useMemo(() => {
    return stableSort(userRoleList, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, userRoleList]);

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


  const onOpenAdd = useCallback(() => setIsOpenAdvanced(true), []);
  const onOpenRemoveModal = useCallback((e) => {
    if (!e.open) updated();
    setIsOpenRemoveModal(e.open);
  }, []);
  const onOpenAdvanced = useCallback((e) => {
    if (!e.open) updated();
    setIsOpenAdvanced(e.open);
  }, []);

  return <>
    <BaseHeaderPage hasAddButton={hasAccessAdvance}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(49)}
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
                    description={giveText(50)}
                    addTitle={giveText(102)}
                    onOpenAdd={onOpenAdd}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    controller={controller} 
                    extension={
                      <HStack>
                        {userSelect()}
                        {roleSelect()}
                      </HStack>
                    }
                    />

    <BaseTablePage isLoadingListAllUsers={isFetching}
                   headCells={headCells}
                   order={order}
                   orderBy={orderBy}
                   setOrderBy={setOrderBy}
                   setOrder={setOrder}
                   hasCheckboxAccess={hasAccessCheckbox}
                   isAllCheckedCheckbox={isAllChecked}
                   isSomeCheckedCheckbox={isAnyChecked}
                   currentPage={currentPage}
                   totalPages={totalPages}
                   onNextPage={onNextPage}
                   onPreviousPage={onPreviousPage}
                   showPageNavigator={true}
                   hasPagination={false}
                   lastElementRef={undefined} 
                   onChangeCheckboxAll={() => onChangeCheckboxAll(sortedListValue)}
                   body={sortedListValue?.map((row, index) => (
                     <UserRoleTable key={row.user_id}
                                    ids={ids}
                                    row={row}
                                    index={index}
                                    open={open}
                                    setOpen={setOpen}
                                    openEditModal={openEditModal}
                                    hasAccessCheckbox={hasAccessCheckbox}
                                    onChangeCheckbox={onChangeCheckbox}
                                    hasAccessMore={hasAccessMore} />
                   ))} />

    <DialogRoot lazyMount placement={'center'} size={'lg'} open={isOpenRemoveModal} onOpenChange={onOpenRemoveModal}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <EditUserRole selectedUser={selectedUser} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'lg'} open={isOpenAdvanced} onOpenChange={onOpenAdvanced}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AdvancedUserRole />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <ActionBarTables selectedCount={ids.size}
                     buttons={[{
                       title: giveText(129),
                       color: ['white', 'black'],
                       backgroundColor: ['red.600', 'red.200'],
                       hoverBackgroundColor: ['red.800', 'red.300'],
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ALL_USER_ROLE)),
                       onClickFunc: () => removeAxios({ data: { user_ids: ids } }),
                     }]} />
  </>;
}
