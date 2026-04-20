import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  POST_ORGANIZATION,
  DELETE_ORGANIZATION,
  GET_ALL_ORGANIZATION,
  POST_ALL_QAMUS_ENTITY,
} from '../../../../Base/UserAccessNames.jsx';
import { CheckBoxName } from '../../../../Base/TableAttributes.jsx';
import { useCheckboxTable } from '../../../../Base/CustomHook/useCheckboxTable.jsx';
import { useTableBaseActions } from '../../../../Base/CustomHook/useTableBaseActions.jsx';
import { prouseTableBaseActions } from '../../../../Base/CustomHook/prouseTableBaseActions.jsx';
import { setHasExpandedMapTrue } from '../../../../../store/features/mapOrganizationSlice.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../../ui/dialog.jsx';
import { BaseHeaderPage } from '../../BaseHeaderPage.jsx';
import { ActionBarTables } from '../../../../Base/ActionBar/ActionBarTables.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import OrganizationTable from './OrganizationTable.jsx';
import { Box } from '@chakra-ui/react';

const OrganizationHierarchy = lazy(() => import('./OrganizationHierarchy/OrganizationHierarchy'));
const AddEditOrganization = lazy(() => import('./AddEdit/AddEditOrganization'));
const Remove = lazy(() => import('../../../../Base/IconsFeatures/Remove'));

export default function Organization() {
  const mapOrganizationSlice = useSelector(state => state.mapOrganizationSlice);
  const accessSlice = useSelector(state => state.accessSlice);
  const [organization, setOrganization] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isOpenAddOrganization, setIsOpenAddOrganization] = useState(false);
  const [isOpenEditOrganization, setIsOpenEditOrganization] = useState(false);
  const [isOpenRemoveOrganization, setIsOpenRemoveOrganization] = useState(false);
  const [isOpenHierarchyNodeModal, setIsOpenHierarchyNodeModal] = useState(false);
  const dispatch = useDispatch();
  const removeId = useMemo(() => 'id', []);
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_organization_list_react_query', []);
  const [totalCountLabel, setTotalCountLabel] = useState(0);

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(183) },
      { type: 'text', text: giveText(131) },
    ]));
  }, []);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const openAddModal = useCallback(() => {
    dispatch(setHasExpandedMapTrue());
    setIsOpenAddOrganization(true);
  }, []);

  const headCellsValues = useMemo(() => [
    CheckBoxName,
    {
      id: 'name',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(1)}
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
    // { id: 'name', label: giveText(1) },
    { id: 'location', label: giveText(181) },
    { id: 'address', label: giveText(35) },
    { id: 'number', label: giveText(282) },
    { id: 'phone_number', label: giveText(284) },
  ], [totalCountLabel]);

  const onShiftN = useCallback(() => {
    setIsOpenAddOrganization(true);
  }, []);

  const {
    listValue: organizationList,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    removeAxios,
    lastElementRef,
    controller,
  } = useTableBaseActions({
    getAllURL: '/organization/all',
    onShiftN: onShiftN,
    checkAccess: true,
    headCellsValues: headCellsValues,
    update: () => updated(),
    removeURL: '/organization',
    removeId: removeId,
    removeIdRequest: 'organization_id',
    responseKey: 'organizations',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
  });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ORGANIZATION);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
    onDeleteRow,
  } = useCheckboxTable({
    listValue: organizationList,
    hasAccessCheckbox,
  });

  const sortedListValue = useMemo(() => {
    return stableSort(organizationList, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, organizationList]);

  const hasAccessToAddEdit = useCallback((access) => {
    return accessSlice.isAdmin ||
      (accessSlice.userAccess?.includes(access)
        && accessSlice.userAccess?.includes(GET_ALL_ORGANIZATION)
        && accessSlice.userAccess?.includes(POST_ALL_QAMUS_ENTITY)
      );
  }, [accessSlice]);

  const onOpenAdd = useCallback(() => openAddModal(), []);
  const onOpenHierarchyNodeModal = useCallback((e) => setIsOpenHierarchyNodeModal(e.open), []);
  const onOpenEditOrganization = useCallback((e) => setIsOpenEditOrganization(e.open), []);
  const onOpenRemoveOrganization = useCallback((e) => setIsOpenRemoveOrganization(e.open), []);
  const onOpenAddOrganization = useCallback((e) => setIsOpenAddOrganization(e.open), []);

  return <>
    <BaseHeaderPage hasAddButton={hasAccessToAddEdit(POST_ORGANIZATION)}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(131)}
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
                    description={giveText(132)}
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
                     <OrganizationTable key={row?.id}
                                        ids={ids}
                                        row={row}
                                        hasAccessCheckbox={hasAccessCheckbox}
                                        setOrganization={setOrganization}
                                        onChangeCheckbox={onChangeCheckbox}
                                        hasAccessToAddEdit={hasAccessToAddEdit}
                                        setIsOpenEditOrganization={setIsOpenEditOrganization}
                                        setIsOpenHierarchyNodeModal={setIsOpenHierarchyNodeModal}
                                        setIsOpenRemoveOrganization={setIsOpenRemoveOrganization} />
                   ))} />

    <DialogRoot lazyMount
                size={'full'}
                motionPreset={null}
                placement={'center'}
                open={isOpenHierarchyNodeModal}
                onOpenChange={onOpenHierarchyNodeModal}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <OrganizationHierarchy onClose={() => setIsOpenHierarchyNodeModal(false)}
                                   organization_id={organization?.id} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                placement={'center'}
                open={isOpenEditOrganization}
                onOpenChange={onOpenEditOrganization}>
      <DialogContent maxW={mapOrganizationSlice.hasExpandedMap ? '80rem' : '600px'}>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditOrganization editing={true}
                                 onCloseModal={() => {
                                   setIsOpenEditOrganization(false);
                                   updated();
                                 }}
                                 organization={organization} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                placement={'center'}
                size={'sm'}
                open={isOpenRemoveOrganization}
                onOpenChange={onOpenRemoveOrganization}>
      <DialogContent>
        <DialogBody p={2}>
          <Suspense fallback={'loading...'}>
            <Remove removeAxios={removeAxios}
                    data={organization}
                    onClose={() => {
                      setIsOpenRemoveOrganization(false);
                      updated();
                    }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                placement={'center'}
                open={isOpenAddOrganization}
                onOpenChange={onOpenAddOrganization}>
      <DialogContent maxW={mapOrganizationSlice.hasExpandedMap ? '80rem' : '600px'}>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditOrganization editing={false}
                                 onCloseModal={() => {
                                   setIsOpenAddOrganization(false);
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
                       hasAccess: hasAccessCheckbox,
                       onClickFunc: () => {
                         removeAxios({ data: { id: ids } });
                         onDeleteRow(ids);
                       },
                     }]} />
  </>;
}
