import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
  GET_ROLE_PERMISSIONS,
  DELETE_ALL_ROLES_PERMISSIONS,
} from '../../../../Base/UserAccessNames.jsx';
import { CheckBoxName, ChevronTableName } from '../../../../Base/TableAttributes.jsx';
import { useTableBaseActions } from '../../../../Base/CustomHook/useTableBaseActions.jsx';
import { useCheckboxTable } from '../../../../Base/CustomHook/useCheckboxTable.jsx';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { DialogBody, DialogContent, DialogRoot } from '../../../../ui/dialog.jsx';
import { BaseHeaderPage } from '../../BaseHeaderPage.jsx';
import { ActionBarTables } from '../../../../Base/ActionBar/ActionBarTables.jsx';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import RolePermissionTable from './RolePermissionTable.jsx';
import { Box, HStack } from '@chakra-ui/react';
import FloatingLabelSearchSelectScrollPaginationInput from '../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { ChevronDownOutlineIcon } from '../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';

const EditRolePermission = lazy(() => import('./Edit/EditRolePermission'));

export default function RolePermission() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isOpenRolePermission, setIsOpenRolePermission] = useState(false);
  const [open, setOpen] = useState([]);
  const [selectedRole, setSelectedRole] = useState({
    role_name: null,
    role_id: null,
  });
  const dispatch = useDispatch();
  const removeId = useMemo(() => 'role_ids', []);
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'get_role_permission_list', []);

  const [totalCountLabel, setTotalCountLabel] = useState(0);

  const [selectedRoleFilter, setSelectedRoleFilter] = useState({
    id: '',
    name: '',
  });

  const [searchedRoleValue, setSearchedRoleValue] = useState('');
  const roleSelectController = new AbortController();
  const observer = useRef(null);




  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(78) },
      { type: 'text', text: giveText(68) },
    ]));
  }, []);

  const hasAccess = useMemo(() => {
    return (accessSlice.isAdmin || (accessSlice.userAccess?.includes(GET_ROLE_PERMISSIONS)));
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const openEditModal = useCallback((value) => {
    setSelectedRole({
      role_name: value.role_name,
      role_id: value.role_id,
    });
  }, []);

  const headCellsValues = useMemo(() => [
    CheckBoxName,
    ChevronTableName,
    {
      id: 'role_name',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(46)}
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
    // { id: 'role_name', label: giveText(46) },
    { id: 'actions', label: giveText(12) },
  ], [totalCountLabel]);

  const queryParameter = useMemo(() => {
    let q = '';
    if (selectedRoleFilter.name) {
      q += `&role_name=${encodeURIComponent(selectedRoleFilter.name)}`;
    }
    return q;
  }, [selectedRoleFilter.name]);


  const {
    listValue: rolePermissionList,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    lastElementRef,
    removeAxios,
    controller,
  } = useTableBaseActions({
    getAllURL: '/role_permission/all',
    update: updated,
    checkAccess: hasAccess,
    headCellsValues: headCellsValues,
    // responseKey: 'role_permissions',
    responseKey: 'roles',
    searchValue: searchValue,
    removeURL: '/role_permissions/all',
    removeId: removeId,
    removeIdRequest: 'role_ids',
    reactQueryItemName: reactQueryItemName,

    queryParameter,
  });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ALL_ROLES_PERMISSIONS);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
  } = useCheckboxTable({
    listValue: rolePermissionList,
    listId: 'role_id',
    hasAccessCheckbox,
  });

  useEffect(() => {
    setOpen(Array(rolePermissionList.length).fill(false));
  }, [rolePermissionList.length]);

  const sortedListValue = useMemo(() => {
    return stableSort(rolePermissionList, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, rolePermissionList]);

  const onOpenRolePermission = useCallback((e) => {
    if (!e.open) updated();
    setIsOpenRolePermission(e.open);
  }, []);


  const allRoles = async ({ pageParam = 1 }) => {
    const res = await fetchWithAxios.get(
      `/role/all?page=${pageParam}&page_size=20&search=${searchedRoleValue}`,
      { signal: roleSelectController.signal }
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
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastRoleRef = useCallback(
    (node) => {
      if (isLoadingRoles) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextRolePage && !isFetchingRoles) {
          fetchNextRoles();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextRoles, hasNextRolePage, isFetchingRoles, isLoadingRoles]
  );

  const rolesList = useMemo(
    () => rolesData?.pages.flatMap(p => p.roles) || [],
    [rolesData]
  );

  const roleSelect = () => (
    <Box w="200px">
      <FloatingLabelSearchSelectScrollPaginationInput
        label={giveText(46)} // Role
        placeholder=""
        dir="ltr"
        list={rolesList}
        usernameKey="role_name"
        picKey=""
        lastElementUserRef={lastRoleRef}
        loading={isFetchingRoles}
        hasInputLeftElement
        hasInputRightElement
        InputLeftElementIcon={<ChevronDownOutlineIcon width="1rem" />}
        value={searchedRoleValue}
        onChange={(e) => {
          roleSelectController.abort();
          setSearchedRoleValue(e.target.value);
        }}
        onClear={() => {
          roleSelectController.abort();
          setSearchedRoleValue('');
          setSelectedRoleFilter({ id: '', name: '' });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace') {
            setSelectedRoleFilter({ id: '', name: '' });
            setSearchedRoleValue('');
          }
        }}
        onSelectMethod={(v) => {
          setSelectedRoleFilter({
            id: v.role_id,
            name: v.role_name,
          });
          setSearchedRoleValue(v.role_name);
        }}
      />
    </Box>
  );

  






  return <>
    <BaseHeaderPage hasAddButton={false}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(47)}
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
                    description={giveText(48)}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    controller={controller}
                    extension={
                      <HStack>
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
                   lastElementRef={lastElementRef}
                   onChangeCheckboxAll={() => onChangeCheckboxAll(sortedListValue)}
                   body={sortedListValue?.map((row, index) => (
                     <RolePermissionTable key={row?.role_id}
                                          row={row}
                                          ids={ids}
                                          index={index}
                                          open={open}
                                          setOpen={setOpen}
                                          hasAccessCheckbox={hasAccessCheckbox}
                                          onChangeCheckbox={onChangeCheckbox}
                                          hasAccess={hasAccess}
                                          openEditModal={openEditModal}
                                          setIsOpenRolePermission={setIsOpenRolePermission} />
                   ))} />

    <DialogRoot lazyMount
                placement={'center'}
                size={'lg'}
                open={isOpenRolePermission}
                onOpenChange={onOpenRolePermission}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <EditRolePermission selectedRole={selectedRole} />
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
                       hasAccess: hasAccessCheckbox,
                       onClickFunc: () => removeAxios({ data: { role_ids: ids } }),
                     }]} />
  </>;
}
