import {
  showToast,
  handleErrors,
  promiseToast,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../Base/BaseFunction.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  PUT_PERMISSIONS,
  POST_PERMISSIONS,
  DELETE_PERMISSIONS,
  DELETE_DEFAULT_PERMISSIONS,
} from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { setIsDeleting, setIsFetchingPermission } from '../../../../../store/features/isLoadingSlice.jsx';
import { CheckBoxName } from '../../../../Base/TableAttributes.jsx';
import { useCheckboxTable } from '../../../../Base/CustomHook/useCheckboxTable.jsx';
import { useTableBaseActions } from '../../../../Base/CustomHook/useTableBaseActions.jsx';
import { prouseTableBaseActions } from '../../../../Base/CustomHook/prouseTableBaseActions.jsx';
import { useQueryClient } from '@tanstack/react-query';
import qs from 'qs';
import { DialogBody, DialogContent, DialogRoot } from '../../../../ui/dialog.jsx';
import { ProBaseHeaderPage2 } from '../../ProBaseHeaderPage2.jsx';
import { ActionBarTables } from '../../../../Base/ActionBar/ActionBarTables.jsx';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import PermissionTable from './PermissionTable.jsx';
import { Box } from '@chakra-ui/react';

import { UserAdminIcon, UserDaemonIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { Select, HStack, Button } from '@chakra-ui/react';

const AddEditPermission = lazy(() => import('./AddEdit/AddEditPermission'));
const Remove = lazy(() => import('../../../../Base/IconsFeatures/Remove'));

export default function Permission() {
  const [isLoadingIsDefault, setIsLoadingIsDefault] = useState([]);
  const accessSlice = useSelector(state => state.accessSlice);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);
  const [isOpenAddPermission, setIsOpenAddPermission] = useState(false);
  const [formField, setFormField] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_permissions_list_react_query', []);

  const [totalCountLabel, setTotalCountLabel] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [methodBtn, setMethodBtn] = useState(null);
  const [isDefaultBtn, setIsDefaultBtn] = useState(null);

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(78) },
      { type: 'text', text: giveText(12) },
    ]));
  }, []);

  const editPermissionAxios = (props = {}) => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_PERMISSIONS)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });
    } else if (!props.permissionForm?.action.value || props.permissionForm.method.value === '' || props.permissionForm.path.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(props.permissionForm, props.setPermissionForm, ['action', 'method', 'path']);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingPermission(true));

      fetchWithAxios.put(`/permission?permission_id=${props.permissionForm.id}&action=${props.permissionForm.action.value}&method=${props.permissionForm.method.value}&path=${props.permissionForm.path.value}&is_default=${props.permissionForm.is_default.value}&description=${props.permissionForm.description.value}`,
        {}).then((response) => {
        props.onCloseModal && props.onCloseModal();
        props.update && updated();

        setTimeout(() => {
          setIsLoadingIsDefault((prevState) => prevState.filter(num => num !== props.index));
        }, 1000);
        updatePromiseToastSuccessWarningInfo({ toastId, response });

      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setIsFetchingPermission(false));
      });
    }
  };

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const setCatchDefaultAxios = ({ active = false, permission_ids = [] }) => {
    const toastId = promiseToast();

    fetchWithAxios.post(`/default_permission`, {}, {
        params: {
          permission_ids: [...permission_ids],
          active,
        },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
      },
    ).then((response) => {
      updated();
      updatePromiseToastSuccessWarningInfo({ toastId, response });
    }).catch((error) => {
      updatePromiseToastError({ toastId, error });
    }).finally(() => {
      dispatch(setIsDeleting(false));
    });
  };

  const headCellsValues = useMemo(() => [
    CheckBoxName,
    {
      id: 'action',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(40)}
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
    // { id: 'action', label: giveText(40) },
    { id: 'method', label: giveText(36) },
    { id: 'path', label: giveText(41) },
    { id: 'is_default', label: giveText(92) },
    { id: 'description', label: giveText(38) },
  ], [totalCountLabel]);

  const checkAccessTable = useMemo(() => accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PERMISSIONS) || accessSlice.userAccess?.includes(DELETE_PERMISSIONS), [accessSlice]);

  const onShiftN = useCallback(() => {
    setIsOpenAddPermission(true);
  }, []);

  const {
    listValue: permissionList,
    totalCount,
    getComparatorByValue,
    isFetching,
    stableSort,
    headCells,
    removeAxios,
    lastElementRef,
    controller,

    fetchNextPage,
    hasNextPage,
  } = prouseTableBaseActions({
    getAllURL: '/permission/all',
    onShiftN: onShiftN,
    checkAccess: checkAccessTable,
    headCellsValues: headCellsValues,
    update: updated,
    removeURL: '/permission',
    removeId: 'id',
    removeIdRequest: 'permission_id',
    responseKey: 'permissions',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,

    pageSize,

    additionalParams: useMemo(() => {
      const params = {};
      if (methodBtn !== null) params.method = methodBtn;
      if (isDefaultBtn !== null) params.default = isDefaultBtn;

      params.page = currentPage;  
      params.page_size = pageSize;

      return params;
    // }, [methodBtn, isDefaultBtn]),
    }, [methodBtn, isDefaultBtn, currentPage, pageSize]),

    });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const rows = useMemo(() => {
    return permissionList
      .map((permission) => ({
        id: permission?.id,
        action: { value: permission?.action },
        method: { value: permission?.method },
        path: { value: permission?.path },
        is_default: { value: permission?.is_default },
        description: { value: permission?.description },
      }));
  }, [permissionList]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_PERMISSIONS) || accessSlice.userAccess?.includes(DELETE_DEFAULT_PERMISSIONS);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
    onDeleteRow,
  } = useCheckboxTable({
    listValue: rows,
    hasAccessCheckbox,
  });

  const sortedListValue = useMemo(() => {
    return stableSort(rows, getComparatorByValue(order, orderBy));
  }, [rows, order, orderBy, stableSort]);

  const onOpenAdd = useCallback(() => setIsOpenAddPermission(true), []);
  const onOpenEditModal = useCallback((e) => setIsOpenEditModal(e.open), []);
  const onOpenRemoveModal = useCallback((e) => setIsOpenRemoveModal(e.open), []);
  const onOpenAddPermission = useCallback((e) => setIsOpenAddPermission(e.open), []);

  // const toggleFlag = useCallback((flagName) => {
  //   let newMethod = methodBtn;
  //   let newDefault = isDefaultBtn;

  //   if (flagName === 'method') {
  //     const cycle = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];
  //     const currentIndex = cycle.indexOf(methodBtn);
  //     newMethod = methodBtn === null ? 'GET' : (currentIndex === cycle.length - 1 ? null : cycle[currentIndex + 1]);
  //   }
  //   if (flagName === 'default') {
  //     newDefault = isDefaultBtn === null ? true : (isDefaultBtn === true ? false : null);
  //   }

  //   setMethodBtn(newMethod);
  //   setIsDefaultBtn(newDefault);
  //   updated();
  // }, [methodBtn, isDefaultBtn, updated]);

  // const cycleMethod = useCallback(() => {
  //   const cycle = [null, 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];
  //   const next = cycle[(cycle.indexOf(methodBtn) + 1) % cycle.length];
  //   setMethodBtn(next);
  // }, [methodBtn]);

  // const cycleDefault = useCallback(() => {
  //   const next = isDefaultBtn === null ? true : isDefaultBtn === true ? false : null;
  //   setIsDefaultBtn(next);
  // }, [isDefaultBtn]);

  // const permissionFlagButtons = useMemo(() => [
  //   {
  //     key: 'method',
  //     value: methodBtn,
  //     icon: <UserAdminIcon width="2rem" />,
  //     onClick: cycleMethod,
  //     tooltip: methodBtn ? `Method: ${methodBtn}` : 'All Methods',
  //   },
  //   {
  //     key: 'default',
  //     value: isDefaultBtn,
  //     icon: <UserDaemonIcon width="2rem" />,
  //     onClick: cycleDefault,
  //     tooltip:
  //       isDefaultBtn === null
  //         ? 'All Permissions'
  //         : isDefaultBtn
  //         ? 'Only Default'
  //         : 'Only Non-Default',
  //   },
  // ], [methodBtn, isDefaultBtn, cycleMethod, cycleDefault]);


  const MethodDropdown = ({ value, onChange }) => {
    return (
      <Box
        as="select"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        w="140px"
        h="32px"
        px="8px"
        borderRadius="6px"
        border="1px solid"
        borderColor="gray.300"
        _dark={{ bg: 'gray.700', borderColor: 'gray.600' }}
      >
        <option value="">{giveText(456)}</option>
        <option value="get">GET</option>
        <option value="post">POST</option>
        <option value="put">PUT</option>
        <option value="delete">DELETE</option>
        <option value="patch">PATCH</option>
      </Box>
    );
  };

  const DefaultToggleButton = ({ value, onChange }) => {
    const handleClick = () => {
      const next =
        value === null ? true :
        value === true ? false :
        null;

      onChange(next);
    };

    const label =
      value === null ? 'ALL' :
      value === true ? 'DEFAULT' :
      'NON DEFAULT';

    const bg =
      value === null ? 'gray.200' :
      value === true ? 'green.400' :
      'orange.400';

    return (
      <Button size="sm" bg={bg} onClick={handleClick} minW="120px">
        {label}
      </Button>
    );
  };

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [searchValue]);

  const totalPages = useMemo(() => {
    const count = totalCount ?? 0;
    return Math.max(1, Math.ceil(count / pageSize));
  }, [totalCount, pageSize]);

  // useEffect(() => {
  //   if (currentPage > totalPages) {
  //     setCurrentPage(totalPages);
  //   }
  // }, [currentPage, totalPages]);
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





  return <>
    {/* <ProBaseHeaderPage2 hasAddButton={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_PERMISSIONS)}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(12)}
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
                    description={giveText(39)}
                    onOpenAdd={onOpenAdd}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    controller={controller}
                    hasUserFlagButtons={true}
                    activeBtn={null}
                    adminBtn={methodBtn}
                    daemonBtn={isDefaultBtn}
                    toggleFlag={toggleFlag} /> */}

    <ProBaseHeaderPage2
                        hasAddButton={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_PERMISSIONS)}
                        title={<Box display="flex" alignItems="center" gap="8px">
                          {giveText(12)}
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
                        description={giveText(39)}
                        onOpenAdd={onOpenAdd}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        controller={controller}
                        // flagButtons={permissionFlagButtons}
                        extension={
                          <HStack>
                            <MethodDropdown
                              value={methodBtn}
                              onChange={setMethodBtn}
                            />

                            <DefaultToggleButton
                              value={isDefaultBtn}
                              onChange={setIsDefaultBtn}
                            />
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
                  //  lastElementRef={lastElementRef}
                   onChangeCheckboxAll={() => onChangeCheckboxAll(sortedListValue)}
                   currentPage={currentPage}
                   totalPages={totalPages}
                   onNextPage={onNextPage}
                   onPreviousPage={onPreviousPage}
                   showPageNavigator={true}

                  hasPagination={false}
                  lastElementRef={undefined}

                   body={sortedListValue?.map((row) => (
                     <PermissionTable key={row?.id}
                                      ids={ids}
                                      row={row}
                                      onChangeCheckbox={onChangeCheckbox}
                                      hasAccessCheckbox={hasAccessCheckbox}
                                      editPermissionAxios={editPermissionAxios}
                                      setFormField={setFormField}
                                      isLoadingIsDefault={isLoadingIsDefault}
                                      setIsLoadingIsDefault={setIsLoadingIsDefault}
                                      setIsOpenEditModal={setIsOpenEditModal}
                                      setIsOpenRemoveModal={setIsOpenRemoveModal} />
                   ))} />

    <DialogRoot lazyMount placement={'center'} size={'lg'} open={isOpenEditModal} onOpenChange={onOpenEditModal}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditPermission formField={formField}
                               editPermissionAxios={editPermissionAxios}
                               editing={true}
                               onCloseModal={() => {
                                 setIsOpenEditModal(false);
                                 updated();
                               }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'sm'} open={isOpenRemoveModal} onOpenChange={onOpenRemoveModal}>
      <DialogContent>
        <DialogBody p={2}>
          <Suspense fallback={'loading...'}>
            <Remove removeAxios={removeAxios}
                    data={formField}
                    onClose={() => {
                      setIsOpenRemoveModal(false);
                      updated();
                    }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                placement={'center'}
                size={'lg'}
                open={isOpenAddPermission}
                onOpenChange={onOpenAddPermission}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditPermission editPermissionAxios={editPermissionAxios}
                               onCloseModal={() => {
                                 setIsOpenAddPermission(false);
                                 updated();
                               }}
                               editing={false} />
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
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_PERMISSIONS)),
                       onClickFunc: () => {
                         removeAxios({ data: { id: ids } });
                         onDeleteRow(ids);
                       },
                     }, {
                       title: giveText(166),
                       color: ['white', 'black'],
                       backgroundColor: ['green.600', 'green.200'],
                       hoverBackgroundColor: ['green.800', 'green.300'],
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_DEFAULT_PERMISSIONS)),
                       onClickFunc: () => setCatchDefaultAxios({ permission_ids: ids, active: true }),
                     }, {
                       title: giveText(167),
                       color: ['white', 'black'],
                       backgroundColor: ['orange.600', 'orange.200'],
                       hoverBackgroundColor: ['orange.800', 'orange.300'],
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_DEFAULT_PERMISSIONS)),
                       onClickFunc: () => setCatchDefaultAxios({ permission_ids: ids, active: false }),
                     }]} />
  </>;
}