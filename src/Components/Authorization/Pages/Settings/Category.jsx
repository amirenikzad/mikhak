import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../BaseTablePage.jsx';
import { giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { DELETE_PLATFORM, POST_PLATFORM, PUT_PLATFORM } from '../../../Base/UserAccessNames.jsx';
import { CheckBoxName } from '../../../Base/TableAttributes.jsx';
import { useCheckboxTable } from '../../../Base/CustomHook/useCheckboxTable.jsx';
import { useTableBaseActions } from '../../../Base/CustomHook/useTableBaseActions.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../ui/dialog.jsx';
import { BaseHeaderPage } from '../BaseHeaderPage.jsx';
import { ActionBarTables } from '../../../Base/ActionBar/ActionBarTables.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { setBreadcrumbAddress } from '../../../../store/features/baseSlice.jsx';
import CategoryTable from './CategoryTable.jsx';
import { Box, Center, Grid, GridItem, Separator, Text } from '@chakra-ui/react';

const AddEditCategory = lazy(() => import('./AddEdit/AddEditCategory'));
const Remove = lazy(() => import('../../../Base/IconsFeatures/Remove'));

export default function Category() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [category, setCategory] = useState('');
  console.log('category.jsx',category);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isOpenAddCategory, setIsOpenAddCategory] = useState(false);
  const [isOpenEditCategory, setIsOpenEditCategory] = useState(false);
  const [isOpenRemove, setIsOpenRemove] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_category_list_react_query', []);
  const removeId = useMemo(() => 'id', []);

  const [totalCountLabel, setTotalCountLabel] = useState(0);

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(182) },
      { type: 'text', text: giveText(220) },
    ]));
  }, []);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const headCellsValues = useMemo(() => [
    CheckBoxName,
    {
      id: 'category_name',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(222)}
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
    // { id: 'Category_name', label: giveText(43) },
  ], [totalCountLabel]);

  const onShiftN = useCallback(() => {
    setIsOpenAddCategory(true);
  }, []);

  const checkAccessTable = useMemo(() => accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PLATFORM) || accessSlice.userAccess?.includes(DELETE_PLATFORM), [accessSlice]);

  const {
    listValue: CategoryList,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    removeAxios,
    lastElementRef,
    controller,
  } = useTableBaseActions({
    getAllURL: '/category/all',
    onShiftN: onShiftN,
    checkAccess: checkAccessTable,
    headCellsValues: headCellsValues,
    update: updated,
    removeURL: '/category',
    removeId: removeId,
    removeIdRequest: 'cat_id',
    responseKey: 'categories',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
  });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_PLATFORM);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
    onDeleteRow,
  } = useCheckboxTable({
    listValue: CategoryList,
  });

  const sortedListValue = useMemo(() => {
    return stableSort(CategoryList, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, CategoryList]);

  const onOpenAdd = useCallback(() => setIsOpenAddCategory(true), []);
  const onOpenEditCategory = useCallback((e) => setIsOpenEditCategory(e.open), []);
  const onOpenRemove = useCallback((e) => setIsOpenRemove(e.open), []);
  const onOpenAddCategory = useCallback((e) => setIsOpenAddCategory(e.open), []);

  return <>
    <BaseHeaderPage hasAddButton={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_PLATFORM)}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(220)}
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
                        <CategoryTable key={row?.id}
                                    ids={ids}
                                    row={row}
                                    setCategory={setCategory}
                                    onChangeCheckbox={onChangeCheckbox}
                                    setIsOpenRemove={setIsOpenRemove}
                                    setIsOpenEditCategory={setIsOpenEditCategory}
                                    hasAccessCheckbox={hasAccessCheckbox} />
                    ))} 
                   />

    <DialogRoot lazyMount placement={'center'} size={'md'} open={isOpenEditCategory} onOpenChange={onOpenEditCategory}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditCategory editing={true}
                         onCloseModal={() => {
                           setIsOpenEditCategory(false);
                           updated();
                         }}
                         category={category} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'sm'} open={isOpenRemove} onOpenChange={onOpenRemove}>
      <DialogContent>
        <DialogBody p={3}>
          <Suspense fallback={'loading...'}>
            <Remove removeAxios={removeAxios}
                    data={category}
                    onClose={() => {
                      setIsOpenRemove(false);
                      updated();
                    }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'md'} open={isOpenAddCategory} onOpenChange={onOpenAddCategory}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditCategory onCloseModal={() => {
              setIsOpenAddCategory(false);
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
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_PLATFORM)),
                       onClickFunc: () => {
                         removeAxios({ data: { id: ids } });
                         onDeleteRow(ids);
                       },
                     }]} />
  </>;
}