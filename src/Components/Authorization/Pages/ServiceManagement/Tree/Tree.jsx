import {
  showToast,
  promiseToast,
  handleErrors,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../Base/BaseFunction.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  PUT_FUNCTIONALITIES,
  POST_FUNCTIONALITIES,
  DELETE_FUNCTIONALITIES,
} from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { setIsFetchingApis } from '../../../../../store/features/isLoadingSlice.jsx';
import { CheckBoxName } from '../../../../Base/TableAttributes.jsx';
import { useCheckboxTable } from '../../../../Base/CustomHook/useCheckboxTable.jsx';
import { useTableBaseActions } from '../../../../Base/CustomHook/useTableBaseActions.jsx';
import { prouseTableBaseActions } from '../../../../Base/CustomHook/prouseTableBaseActions.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../../ui/dialog.jsx';
// import { ProBaseHeaderPage3 } from '../../ProBaseHeaderPage3.jsx';
import ProBaseHeaderPage3 from '../../ProBaseHeaderPage3.jsx';
import { ActionBarTables } from '../../../../Base/ActionBar/ActionBarTables.jsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import TreeTable from './TreeTable.jsx';
import { Box, Select, HStack } from '@chakra-ui/react';

const AddEditTree = lazy(() => import('./AddEdit/AddEditTree.jsx'));
const Remove = lazy(() => import('../../../../Base/IconsFeatures/Remove.jsx'));

export default function Tree() {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // string | ''

  const [formField, setFormField] = useState({});
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [open, setOpen] = useState([]);
  const [isOpenAddTree, setIsOpenAddTree] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenRemove, setIsOpenRemove] = useState(false);
  const [totalCountLabel, setTotalCountLabel] = useState(0);

  const reactQueryItemName = useMemo(() => 'all_Tree_react_query', []);

  // ─── گرفتن لیست دسته‌بندی‌ها ────────────────────────────────────────
  const fetchCategories = async () => {
    const res = await fetchWithAxios.get(`/category/all?page=1&page_size=40&search=`);
    return res.data.categories || [];
  };

  // const { data: categories = [] } = useQuery({
  //   queryKey: ['categories-filter'],
  //   queryFn: fetchCategories,
  //   staleTime: 10 * 60 * 1000,
  // });

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(224) },
      { type: 'text', text: giveText(459) },
    ]));
  }, [dispatch]);

  const handleFields = (form) => {
    return !form.prof_id?.value || !form.tittle?.value;
  };

  const editFunctionalitiesAxios = (props = {} || null) => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_FUNCTIONALITIES)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (handleFields(props.TreeForm)) {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(props.TreeForm, props.setPermissionForm, [
        'prof_id',
        'tittle',
      ]);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingApis(true));

      fetchWithAxios.put(`/tree`,
        {
          'id': props.TreeForm.id,
          'prof_id': props.TreeForm.prof_id.value,
          'tittle': props.TreeForm.tittle.value,
          'node_count': parseInt(props.TreeForm.node_count.value.toString()),
          'level_count': parseInt(props.TreeForm.level_count.value.toString()),
          'event_count': parseInt(props.TreeForm.event_count.value.toString()),
          'price': parseInt(props.TreeForm.price.value.toString()),
        },
      ).then((response) => {
        updated();
        props.onCloseModal && props.onCloseModal();
        updatePromiseToastSuccessWarningInfo({ toastId, response });
      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setIsFetchingApis(false));
      });
    }
  };

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] });
  }, [queryClient, reactQueryItemName]);

  const openEditModal = useCallback((value) => {
    setFormField(value);
    setIsOpenEdit(true);
  }, []);

  const openRemoveModal = useCallback((value) => {
    setFormField(value);
    setIsOpenRemove(true);
  }, []);

  const headCellsValues = useMemo(() => [
    CheckBoxName,
    { id: 'prof_id', label: giveText(461) },
    { id: 'tittle', label: giveText(336) },
    { id: 'node_count', label: giveText(462) },
    { id: 'level_count', label: giveText(463) },
    { id: 'event_count', label: giveText(464) },
    { id: 'price', label: giveText(196) },
  ], []);

  // پارامترهای فیلتر
  const queryParameter = useMemo(() => {
    const params = [];
    if (selectedMethod)   params.push(`method=${selectedMethod}`);
    if (selectedCategory) params.push(`project_id=${selectedCategory}`); // یا category_id=...
    return params.length ? '&' + params.join('&') : '';
  }, [selectedMethod, selectedCategory]);

  const {
    listValue: functionalitiesList,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    removeAxios,
    lastElementRef,
    controller,
  } = useTableBaseActions({
    getAllURL: '/tree/all',
    onShiftN: () => setIsOpenAddTree(true),
    checkAccess: true,
    headCellsValues,
    update: updated,
    removeURL: '/tree',
    removeId: 'id',
    removeIdRequest: 'tree_id',
    responseKey: 'tree',
    searchValue,
    reactQueryItemName,
    queryParameter,
  });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_FUNCTIONALITIES);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
    onDeleteRow,
  } = useCheckboxTable({
    listValue: functionalitiesList,
    hasAccessCheckbox,
  });

  useEffect(() => {
    setOpen(Array(functionalitiesList.length).fill(false));
  }, [functionalitiesList.length]);

  const sortedListValue = useMemo(() => {
    return stableSort(functionalitiesList, getComparator(order, orderBy));
  }, [functionalitiesList, order, orderBy, stableSort, getComparator]);
 
  const onOpenAdd = useCallback(() => setIsOpenAddTree(true), []);
  const onOpenEdit = useCallback((e) => setIsOpenEdit(e.open), []);
  const onOpenAddTree = useCallback((e) => setIsOpenAddTree(e.open), []);
  const onOpenRemove = useCallback((e) => setIsOpenRemove(e.open), []);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
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

  return (
    <>
      <ProBaseHeaderPage3
        // hasAddButton={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_FUNCTIONALITIES)}
        hasAddButton={false}
        titleText={giveText(459)}
        titleBadge={
          <Box
            as="span"
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
        }
        description={giveText(460)}
        onOpenAdd={onOpenAdd}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        controller={controller}
        // extension={
        //   <HStack spacing={2} align="flex-end">
        //     <Box
        //       as="select"
        //       value={selectedMethod ?? ''}
        //       onChange={(e) => setSelectedMethod(e.target.value || null)}
        //       w="140px"
        //       h="40px"
        //       px="8px"
        //       borderRadius="4px"
        //       border="1px solid"
        //       backgroundColor="transparent"
        //       borderColor="gray.300"
        //       _dark={{ bg: 'gray.100', borderColor: 'gray.100' }}
        //       _focus={{
        //         outline: 'none',
        //         // borderColor: 'blue.400',
        //         // boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
        //       }}
        //     >
        //       <option value="">{giveText(456)}</option>
        //       <option value="get">GET</option>
        //       <option value="post">POST</option>
        //       <option value="put">PUT</option>
        //       <option value="delete">DELETE</option>
        //       <option value="patch">PATCH</option>
        //     </Box>

        //     <Box
        //       as="select"
        //       value={selectedCategory ?? ''}
        //       onChange={(e) => setSelectedCategory(e.target.value || null)}
        //       w="220px"
        //       h="40px"
        //       px="8px"
        //       borderRadius="6px"
        //       border="1px solid"
        //       backgroundColor="transparent"
        //       // borderColor="transparent"
        //       borderColor="gray.300"
        //       _dark={{ bg: 'gray.700', borderColor: 'gray.600' }}
        //       _focus={{
        //         outline: 'none',
        //         // borderColor: 'blue.400',
        //         // boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
        //       }}
        //     >
        //       <option value="">همه دسته‌بندی‌ها</option>
        //       {categories.map((cat) => (
        //         <option key={cat.id} value={cat.id}>
        //           {cat.category_name}
        //         </option>
        //       ))}
        //     </Box>
        //   </HStack>
        // }

      />

      <BaseTablePage
        isLoadingListAllUsers={isFetching}
        headCells={headCells}
        order={order}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        setOrder={setOrder}
        // hasAddButton={false}
        hasCheckboxAccess={hasAccessCheckbox}
        isAllCheckedCheckbox={isAllChecked}
        isSomeCheckedCheckbox={isAnyChecked}
        lastElementRef={lastElementRef}
        onChangeCheckboxAll={() => onChangeCheckboxAll(sortedListValue)}

        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        showPageNavigator={true}
        hasPagination={false}

        body={sortedListValue?.map((row, index) => (
          <TreeTable
            key={row?.id}
            row={row}
            ids={ids}
            index={index}
            open={open}
            setOpen={setOpen}
            hasAccessCheckbox={hasAccessCheckbox}
            onChangeCheckbox={onChangeCheckbox}
            openEditModal={openEditModal}
            openRemoveModal={openRemoveModal}
          />
        ))}
      />

      <DialogRoot lazyMount placement={'center'} size={'lg'} open={isOpenEdit} onOpenChange={onOpenEdit}>
        <DialogContent>
          <DialogBody>
            <Suspense fallback={'loading...'}>
              <AddEditTree editing={true}
                                    onCloseModal={() => {
                                      setIsOpenEdit(false);
                                      updated();
                                    }}
                                    formField={formField}
                                    editApisAxios={editFunctionalitiesAxios} />
            </Suspense>
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      {/* <DialogRoot lazyMount
                  placement={'center'}
                  size={'lg'}
                  open={isOpenAddTree}
                  onOpenChange={onOpenAddTree}>
        <DialogContent>
          <DialogBody>
            <Suspense fallback={'loading...'}>
              <AddEditTree editApisAxios={editFunctionalitiesAxios}
                                    onCloseModal={() => {
                                      setIsOpenAddTree(false);
                                      updated();
                                    }}
                                    editing={false} />
            </Suspense>
          </DialogBody>
        </DialogContent>
      </DialogRoot> */}

      <DialogRoot lazyMount placement={'center'} size={'sm'} open={isOpenRemove} onOpenChange={onOpenRemove}>
        <DialogContent>
          <DialogBody p={2}>
            <Suspense fallback={'loading...'}>
              <Remove removeAxios={removeAxios}
                      data={formField}
                      onClose={() => setIsOpenRemove(false)} />
            </Suspense>
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      <ActionBarTables
        selectedCount={ids.size}
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
        }]}
      />
    </>
  );
}
