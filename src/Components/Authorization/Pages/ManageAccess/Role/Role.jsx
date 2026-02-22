import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { DELETE_ROLE, POST_ROLE, PUT_ROLE } from '../../../../Base/UserAccessNames.jsx';
import { CheckBoxName } from '../../../../Base/TableAttributes.jsx';
import { useCheckboxTable } from '../../../../Base/CustomHook/useCheckboxTable.jsx';
import { useTableBaseActions } from '../../../../Base/CustomHook/useTableBaseActions.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../../ui/dialog.jsx';
import { BaseHeaderPage } from '../../BaseHeaderPage.jsx';
import { ActionBarTables } from '../../../../Base/ActionBar/ActionBarTables.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import RoleTable from './RoleTable.jsx';
import { Box } from '@chakra-ui/react';

const AddEditRole = lazy(() => import('./AddEdit/AddEditRole'));
const Remove = lazy(() => import('../../../../Base/IconsFeatures/Remove'));

export default function Role() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [role, setRole] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isOpenAddRole, setIsOpenAddRole] = useState(false);
  const [isOpenEditRole, setIsOpenEditRole] = useState(false);
  const [isOpenRemove, setIsOpenRemove] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_users_list_react_query', []);
  const removeId = useMemo(() => 'id', []);

  const [totalCountLabel, setTotalCountLabel] = useState(0);

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(78) },
      { type: 'text', text: giveText(46) },
    ]));
  }, []);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const headCellsValues = useMemo(() => [
    CheckBoxName,
    {
      id: 'role_name',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(43)}
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
    // { id: 'role_name', label: giveText(43) },
  ], [totalCountLabel]);

  const onShiftN = useCallback(() => {
    setIsOpenAddRole(true);
  }, []);

  const checkAccessTable = useMemo(() => accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_ROLE) || accessSlice.userAccess?.includes(DELETE_ROLE), [accessSlice]);

  const {
    listValue: rolesList,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    removeAxios,
    lastElementRef,
    controller,
  } = useTableBaseActions({
    getAllURL: '/role/all',
    onShiftN: onShiftN,
    checkAccess: checkAccessTable,
    headCellsValues: headCellsValues,
    update: updated,
    removeURL: '/role',
    removeId: removeId,
    removeIdRequest: 'role_id',
    responseKey: 'roles',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
  });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ROLE);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
    onDeleteRow,
  } = useCheckboxTable({
    listValue: rolesList,
  });

  const sortedListValue = useMemo(() => {
    return stableSort(rolesList, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, rolesList]);

  const onOpenAdd = useCallback(() => setIsOpenAddRole(true), []);
  const onOpenEditRole = useCallback((e) => setIsOpenEditRole(e.open), []);
  const onOpenRemove = useCallback((e) => setIsOpenRemove(e.open), []);
  const onOpenAddRole = useCallback((e) => setIsOpenAddRole(e.open), []);

  return <>
    <BaseHeaderPage hasAddButton={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ROLE)}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(44)}
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
                    description={giveText(45)}
                    onOpenAdd={onOpenAdd}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    controller={controller} />

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
                   body={sortedListValue?.map((row) => (
                     <RoleTable key={row?.id}
                                ids={ids}
                                row={row}
                                setRole={setRole}
                                onChangeCheckbox={onChangeCheckbox}
                                setIsOpenRemove={setIsOpenRemove}
                                setIsOpenEditRole={setIsOpenEditRole}
                                hasAccessCheckbox={hasAccessCheckbox} />
                   ))} />

    <DialogRoot lazyMount placement={'center'} size={'md'} open={isOpenEditRole} onOpenChange={onOpenEditRole}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditRole editing={true}
                         onCloseModal={() => {
                           setIsOpenEditRole(false);
                           updated();
                         }}
                         role={role} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'sm'} open={isOpenRemove} onOpenChange={onOpenRemove}>
      <DialogContent>
        <DialogBody p={3}>
          <Suspense fallback={'loading...'}>
            <Remove removeAxios={removeAxios}
                    data={role}
                    onClose={() => {
                      setIsOpenRemove(false);
                      updated();
                    }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'md'} open={isOpenAddRole} onOpenChange={onOpenAddRole}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditRole onCloseModal={() => {
              setIsOpenAddRole(false);
              updated();
            }} />
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
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ROLE)),
                       onClickFunc: () => {
                         removeAxios({ data: { id: ids } });
                         onDeleteRow(ids);
                       },
                     }]} />
  </>;
}
