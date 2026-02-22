import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  GET_USER_NO_ADMIN,
  GET_ORGANIZATION_USER,
  GET_ORGANIZATIONS_USER,
  DELETE_ALL_ORGANIZATION_USER,
} from '../../../../Base/UserAccessNames.jsx';
import { CheckBoxName, ChevronTableName } from '../../../../Base/TableAttributes.jsx';
import { useTableBaseActions } from '../../../../Base/CustomHook/useTableBaseActions.jsx';
import { useCheckboxTable } from '../../../../Base/CustomHook/useCheckboxTable.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { DialogBody, DialogContent, DialogRoot } from '../../../../ui/dialog.jsx';
import { BaseHeaderPage } from '../../BaseHeaderPage.jsx';
import { ActionBarTables } from '../../../../Base/ActionBar/ActionBarTables.jsx';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import OrganizationUserTable from './OrganizationUserTable.jsx';
import { Box } from '@chakra-ui/react';

const AdvancedOrganizationUser = lazy(() => import('./Advance/AdvancedOrganizationUser.jsx'));
const EditOrganizationUser = lazy(() => import('./Edit/EditOrganizationUser.jsx'));

export default function OrganizationUser() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [open, setOpen] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState({
    organization_name: null,
    organization_id: null,
  });
  const [isOpenAdvanced, setIsOpenAdvanced] = useState(false);
  const [isOpenConfig, setIsOpenConfig] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'get_organization_user_list', []);
  const [totalCountLabel, setTotalCountLabel] = useState(0);

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(183) },
      { type: 'text', text: giveText(147) },
    ]));
  }, []);

  const hasAccessMore = useMemo(() => {
    return (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ORGANIZATION_USER));
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  const hasAccessAdvance = useMemo(() => {
    return accessSlice.isAdmin || (accessSlice.userAccess?.includes(GET_ORGANIZATIONS_USER) && accessSlice.userAccess?.includes(GET_USER_NO_ADMIN));
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const headCellsValues = useMemo(() => [
    CheckBoxName,
    ChevronTableName,
    {
      id: 'user',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(148)}
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
    // { id: 'name', label: giveText(148) },
    { id: 'user', label: giveText(51) },
  ], [totalCountLabel]);

  const onShiftN = useCallback(() => {
    setIsOpenAdvanced(true);
  }, []);

  const {
    listValue: organizationUserList,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    lastElementRef,
    removeAxios,
    controller,
  } = useTableBaseActions({
    getAllURL: '/organization_user/all',
    update: updated,
    onShiftA: onShiftN,
    checkAccess: hasAccessMore,
    headCellsValues: headCellsValues,
    responseKey: 'organizations',
    searchValue: searchValue,
    removeURL: '/organization_users/all',
    removeId: 'organization_id',
    removeIdRequest: 'org_ids',
    reactQueryItemName: reactQueryItemName,
  });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ALL_ORGANIZATION_USER);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
  } = useCheckboxTable({
    listValue: organizationUserList,
    listId: 'organization_id',
    hasAccessCheckbox,
  });

  useEffect(() => {
    setOpen(Array(organizationUserList.length).fill(false));
  }, [organizationUserList.length]);

  const sortedListValue = useMemo(() => {
    return stableSort(organizationUserList, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, organizationUserList]);

  const onOpenAdd = useCallback(() => setIsOpenAdvanced(true), []);
  const onOpenAdvanced = useCallback((e) => {
    if (!e.open) updated();
    setIsOpenAdvanced(e.open);
  }, []);
  const onOpenConfig = useCallback((e) => {
    if (!e.open) updated();
    setIsOpenConfig(e.open);
  }, []);

  return <>
    <BaseHeaderPage hasAddButton={hasAccessAdvance}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(147)}
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
                    description={giveText(149)}
                    addTitle={giveText(102)}
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
                   body={sortedListValue?.map((row, index) => (
                     <OrganizationUserTable key={row?.id}
                                            index={index}
                                            ids={ids}
                                            row={row}
                                            open={open}
                                            setOpen={setOpen}
                                            onChangeCheckbox={onChangeCheckbox}
                                            hasAccessCheckbox={hasAccessCheckbox}
                                            setSelectedOrganization={setSelectedOrganization}
                                            setIsOpenConfig={setIsOpenConfig} />
                   ))} />

    <DialogRoot lazyMount placement={'center'} size={'lg'} open={isOpenAdvanced} onOpenChange={onOpenAdvanced}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AdvancedOrganizationUser />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'lg'} open={isOpenConfig} onOpenChange={onOpenConfig}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <EditOrganizationUser selectedOrganization={selectedOrganization} />
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
                       hasAccess: (hasAccessCheckbox),
                       onClickFunc: () => removeAxios({ data: { organization_id: ids } }),
                     }]} />
  </>;
}
