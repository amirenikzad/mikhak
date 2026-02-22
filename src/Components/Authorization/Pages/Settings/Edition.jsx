
import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../BaseTablePage.jsx';
import { giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { DELETE_EDITION, POST_EDITION, PUT_EDITION } from '../../../Base/UserAccessNames.jsx';
import { CheckBoxName } from '../../../Base/TableAttributes.jsx';
import { useCheckboxTable } from '../../../Base/CustomHook/useCheckboxTable.jsx';
import { useTableBaseActions } from '../../../Base/CustomHook/useTableBaseActions.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../ui/dialog.jsx';
import { BaseHeaderPage } from '../BaseHeaderPage.jsx';
import { ActionBarTables } from '../../../Base/ActionBar/ActionBarTables.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { setBreadcrumbAddress } from '../../../../store/features/baseSlice.jsx';
import EditionTable from './EditionTable.jsx';
import { Box, Center, Grid, GridItem, Separator, Text } from '@chakra-ui/react';

const AddEditEdition = lazy(() => import('./AddEdit/AddEditEdition'));
const Remove = lazy(() => import('../../../Base/IconsFeatures/Remove'));

export default function Edition() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [edition, setEdition] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isOpenAddEdition, setIsOpenAddEdition] = useState(false);
  const [isOpenEditEdition, setIsOpenEditEdition] = useState(false);
  const [isOpenRemove, setIsOpenRemove] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_edition_list_react_query', []);
  const removeId = useMemo(() => 'id', []);

  const [totalCountLabel, setTotalCountLabel] = useState(0);

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(182) },
      { type: 'text', text: giveText(430) },
    ]));
  }, []);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const headCellsValues = useMemo(() => [
    CheckBoxName,
    {
      id: 'name',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(442)}
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
    // { id: 'edition_name', label: giveText(43) },
  ], [totalCountLabel]);

  const onShiftN = useCallback(() => {
    setIsOpenAddEdition(true);
  }, []);

  const checkAccessTable = useMemo(() => accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_EDITION) || accessSlice.userAccess?.includes(DELETE_EDITION), [accessSlice]);

  const {
    listValue: editionList,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    removeAxios,
    lastElementRef,
    controller,
  } = useTableBaseActions({
    getAllURL: '/edition/all',
    onShiftN: onShiftN,
    checkAccess: checkAccessTable,
    headCellsValues: headCellsValues,
    update: updated,
    removeURL: '/edition',
    removeId: removeId,
    removeIdRequest: 'edition_id',
    responseKey: 'editions',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
  });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_EDITION);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
    onDeleteRow,
  } = useCheckboxTable({
    listValue: editionList,
  });

  const sortedListValue = useMemo(() => {
    return stableSort(editionList, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, editionList]);

  const onOpenAdd = useCallback(() => setIsOpenAddEdition(true), []);
  const onOpenEditEdition = useCallback((e) => setIsOpenEditEdition(e.open), []);
  const onOpenRemove = useCallback((e) => setIsOpenRemove(e.open), []);
  const onOpenAddEdition = useCallback((e) => setIsOpenAddEdition(e.open), []);

  return <>
    <BaseHeaderPage hasAddButton={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_EDITION)}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(442)}
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
                    body={sortedListValue?.map((row) => (
                        <EditionTable key={row?.id}
                                    ids={ids}
                                    row={row}
                                    setEdition={setEdition}
                                    onChangeCheckbox={onChangeCheckbox}
                                    setIsOpenRemove={setIsOpenRemove}
                                    setIsOpenEditEdition={setIsOpenEditEdition}
                                    hasAccessCheckbox={hasAccessCheckbox} />
                    ))} 
                   />

    <DialogRoot lazyMount placement={'center'} size={'md'} open={isOpenEditEdition} onOpenChange={onOpenEditEdition}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditEdition editing={true}
                         onCloseModal={() => {
                           setIsOpenEditEdition(false);
                           updated();
                         }}
                         edition={edition} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'sm'} open={isOpenRemove} onOpenChange={onOpenRemove}>
      <DialogContent>
        <DialogBody p={3}>
          <Suspense fallback={'loading...'}>
            <Remove removeAxios={removeAxios}
                    data={edition}
                    onClose={() => {
                      setIsOpenRemove(false);
                      updated();
                    }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'md'} open={isOpenAddEdition} onOpenChange={onOpenAddEdition}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditEdition onCloseModal={() => {
              setIsOpenAddEdition(false);
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
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_EDITION)),
                       onClickFunc: () => {
                         removeAxios({ data: { id: ids } });
                         onDeleteRow(ids);
                       },
                     }]} />
  </>;
}