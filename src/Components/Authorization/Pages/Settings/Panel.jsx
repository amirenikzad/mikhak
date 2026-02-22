
import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../BaseTablePage.jsx';
import { giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { DELETE_PANEL, POST_PANEL, PUT_PANEL } from '../../../Base/UserAccessNames.jsx';
import { CheckBoxName } from '../../../Base/TableAttributes.jsx';
import { useCheckboxTable } from '../../../Base/CustomHook/useCheckboxTable.jsx';
import { useTableBaseActions } from '../../../Base/CustomHook/useTableBaseActions.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../ui/dialog.jsx';
import { BaseHeaderPage } from '../BaseHeaderPage.jsx';
import { ActionBarTables } from '../../../Base/ActionBar/ActionBarTables.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { setBreadcrumbAddress } from '../../../../store/features/baseSlice.jsx';
import PanelTable from './PanelTable.jsx';
import { Box, Center, Grid, GridItem, Separator, Text } from '@chakra-ui/react';

// const AddEditPanel = lazy(() => import('./AddEdit/AddEditPanel'));
// const Remove = lazy(() => import('../../../Base/IconsFeatures/Remove'));

export default function Panel() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [panel, setPanel] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isOpenAddPanel, setIsOpenAddPanel] = useState(false);
  const [isOpenEditPanel, setIsOpenEditPanel] = useState(false);
  const [isOpenRemove, setIsOpenRemove] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_panel_list_react_query', []);
  const removeId = useMemo(() => 'id', []);

  const [totalCountLabel, setTotalCountLabel] = useState(0);

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(182) },
      { type: 'text', text: giveText(457) },
    ]));
  }, []);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);


  const headCellsValues = useMemo(() => [
    CheckBoxName,
    {
      id: 'panel_obj_key',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(458)}
          
        </Box>
      )
    },
    // { id: 'panel_name', label: giveText(43) },
  ], [totalCountLabel]);

  const onShiftN = useCallback(() => {
    setIsOpenAddPanel(true);
  }, []);

  const checkAccessTable = useMemo(() => accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PANEL) || accessSlice.userAccess?.includes(DELETE_PANEL), [accessSlice]);

  const {
    listValue: panelList,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    removeAxios,
    lastElementRef,
    controller,
  } = useTableBaseActions({
    getAllURL: '/panel_settings',
    onShiftN: onShiftN,
    checkAccess: checkAccessTable,
    headCellsValues: headCellsValues,
    update: updated,
    removeURL: '/panel',
    removeId: removeId,
    removeIdRequest: 'panel_id',
    responseKey: 'panels',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
  });

//   useEffect(() => {
//     setTotalCountLabel(totalCount ?? 0);
//   }, [totalCount]);
    useEffect(() => {
        setTotalCountLabel(totalCount ?? panelList.length);
        }, [totalCount, panelList]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_PANEL);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
    onDeleteRow,
  } = useCheckboxTable({
    listValue: panelList,
  });

  const sortedListValue = useMemo(() => {
    if (!orderBy) return panelList;
    return stableSort(panelList, getComparator(order, orderBy));
    }, [order, orderBy, stableSort, panelList]);


  const onOpenAdd = useCallback(() => setIsOpenAddPanel(true), []);
  const onOpenEditPanel = useCallback((e) => setIsOpenEditPanel(e.open), []);
  const onOpenRemove = useCallback((e) => setIsOpenRemove(e.open), []);
  const onOpenAddPanel = useCallback((e) => setIsOpenAddPanel(e.open), []);


  return <>
    <BaseHeaderPage hasAddButton={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_PANEL)}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(457)}
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
                    description={giveText(182)}
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
                //    body={sortedListValue?.map((row) => (
                //      <PanelTable key={row?.id}
                //                 ids={ids}
                //                 row={row}
                //                 setPanel={setPanel}
                //                 onChangeCheckbox={onChangeCheckbox}
                //                 setIsOpenRemove={setIsOpenRemove}
                //                 setIsOpenEditPanel={setIsOpenEditPanel}
                //                 hasAccessCheckbox={hasAccessCheckbox} />
                //    ))} 
                    body={sortedListValue?.map((row) => (
                        <PanelTable key={row?.id}
                                    ids={ids}
                                    row={row}
                                    setPanel={setPanel}
                                    onChangeCheckbox={onChangeCheckbox}
                                    setIsOpenRemove={setIsOpenRemove}
                                    setIsOpenEditPanel={setIsOpenEditPanel}
                                    hasAccessCheckbox={hasAccessCheckbox} />
                    ))} 
                   />

    {/* <DialogRoot lazyMount placement={'center'} size={'md'} open={isOpenEditPanel} onOpenChange={onOpenEditPanel}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditPanel editing={true}
                         onCloseModal={() => {
                           setIsOpenEditPanel(false);
                           updated();
                         }}
                         panel={panel} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'sm'} open={isOpenRemove} onOpenChange={onOpenRemove}>
      <DialogContent>
        <DialogBody p={3}>
          <Suspense fallback={'loading...'}>
            <Remove removeAxios={removeAxios}
                    data={panel}
                    onClose={() => {
                      setIsOpenRemove(false);
                      updated();
                    }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot> */}

    {/* <DialogRoot lazyMount placement={'center'} size={'md'} open={isOpenAddPanel} onOpenChange={onOpenAddPanel}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditPanel onCloseModal={() => {
              setIsOpenAddPanel(false);
              updated();
            }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot> */}

    <ActionBarTables selectedCount={ids.size}
                     buttons={[{
                       title: giveText(129),
                       color: ['white', 'black'],
                       backgroundColor: ['red.600', 'red.200'],
                       hoverBackgroundColor: ['red.800', 'red.300'],
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_PANEL)),
                       onClickFunc: () => {
                         removeAxios({ data: { id: ids } });
                         onDeleteRow(ids);
                       },
                     }]} />
  </>;
}