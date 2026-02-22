import {
  promiseToast,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../../Base/BaseFunction.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { giveDir, giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
import {
  GET_USER,
  PUT_USER,
  POST_USER,
  DELETE_USER,
  PUT_PASSWORD,
  GET_ALL_USER,
  GET_USER_ROLE,
  POST_ACTIVE_USER,
} from '../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../Base/axios/FetchAxios.jsx';
import { CheckBoxName } from '../../../Base/TableAttributes.jsx';
import { useCheckboxTable } from '../../../Base/CustomHook/useCheckboxTable.jsx';
import { useruseTableBaseActions } from '../../../Base/CustomHook/useruseTableBaseActions.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { setIsDeleting } from '../../../../store/features/isLoadingSlice.jsx';
import qs from 'qs';
import { DialogBody, DialogContent, DialogRoot } from '../../../ui/dialog.jsx';
import { BaseTablePage } from '../BaseTablePage.jsx';
import { ActionBarTables } from '../../../Base/ActionBar/ActionBarTables.jsx';
import { ProBaseHeaderPage } from '../ProBaseHeaderPage.jsx';
import { setBreadcrumbAddress } from '../../../../store/features/baseSlice.jsx';
import UsersTable from './UsersTable.jsx';
import { toaster } from '../../../ui/toaster.jsx';
import { Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { EditIcon , RemoveIcon, SettingsIcon, UserActiveIcon, UserAdminIcon, UserDaemonIcon } from '../../../Base/IconsFeatures/Icons.jsx';

const Register = lazy(() => import('../../../Authentication/Register/Register'));
const UserRole = lazy(() => import('./Role/UserRole'));
const UserInfo = lazy(() => import('../../UserInfo/UserInfo'));
const Remove = lazy(() => import('../../../Base/IconsFeatures/Remove'));

export default function UserManagement() {
  const [isLoadingActiveSwitches, setIsLoadingActiveSwitches] = useState([]);
  const [isLoadingAdminSwitches, setIsLoadingAdminSwitches] = useState([]);
  const [isLoadingDaemonSwitches, setIsLoadingDaemonSwitches] = useState([]);
  const accessSlice = useSelector(state => state.accessSlice);
  const [userList, setUserList] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [openUserRole, setOpenUserRole] = useState(false);
  const dispatch = useDispatch();
  const removeId = useMemo(() => 'id', []);
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_users_list_react_query', []);
  const activeUserURL = useMemo(() => '/active_user', []);

  const [totalCountLabel, setTotalCountLabel] = useState(0);
  
  const [activeBtn, setActiveBtn] = useState(null);
  const [adminBtn, setAdminBtn] = useState(null);
  const [daemonBtn, setDaemonBtn] = useState(null);



  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(13) },
      { type: 'text', text: giveText(51) },
  ]));
  }, []);

  const checkAccess = useMemo(() => {
    return (accessSlice.isAdmin
      || accessSlice.userAccess?.includes(GET_USER_ROLE)
      || accessSlice.userAccess?.includes(GET_USER)
      || accessSlice.userAccess?.includes(PUT_USER)
      || accessSlice.userAccess?.includes(DELETE_USER));
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  const update = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const patchUserFlag = useCallback(
    ({ url, active, user_ids, accessName, index, setLoading }) => {

      if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(accessName)) {
        toaster.create({
          type: 'error',
          title: giveText(30),
          description: giveText(97),
          dir: giveDir(),
          duration: 3000,
        });
        return;
      }

      const toastId = promiseToast();

      fetchWithAxios.patch(url, {
        user_ids,
        active,
      })
        .then((response) => {
          update();
        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        })
        .finally(() => {
          if (setLoading && index !== undefined) {
            setLoading(prev => prev.filter(i => i !== index));
          }
        });

    },
    [accessSlice.isAdmin, accessSlice.userAccess, update]
  );


  const activeInactiveAxios = useCallback(({ active = false, users_ids }) => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(`${activeUserURL}_post`)) {
      toaster.create({
        type: 'error',
        title: giveText(30),
        description: giveText(97),
        dir: giveDir(),
        duration: 3000,
      });

    } else {
      const toastId = promiseToast();

      fetchWithAxios.post(activeUserURL, {}, {
          params: {
            users_ids: [...users_ids],
            active,
          },
          paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
        },
      ).then((response) => {
        update();
      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setIsDeleting(false));
      });
    }
  }, [accessSlice.isAdmin, accessSlice.userAccess, activeUserURL, update]);

  const onCloseEscape = useCallback(() => {
    setOpenAddUser(false);
    setOpenEdit(false);
    setOpenRemove(false);
    setOpenUserRole(false);
  }, []);

  const onShiftN = useCallback(() => {
    setOpenAddUser(true);
  }, []);

const headCellsValues = useMemo(() => {
  return [
    CheckBoxName,
    {
      id: 'username',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(0)}
        </Box>
      )
    },
    { id: 'name', label: giveText(151) },
    { id: 'family', label: giveText(152) },
    { id: 'disabled', label: giveText(2) },
    { id: 'admin', label: giveText(3) },
    { id: 'daemon', label: giveText(414) },
    { id: 'creator', label: giveText(416) },
  ];
}, []);

  const {
    listValue: usersList,
    totalCount,
    error,
    isFetching,
    stableSort,
    getComparator,
    headCells,
    removeAxios,
    lastElementRef,
    controller,
  } = useruseTableBaseActions({
    getAllURL: '/user/all',
    useQueryDependsUpdate: null,
    onCloseEscape: onCloseEscape,
    onShiftN: onShiftN,
    checkAccess: checkAccess,
    headCellsValues: headCellsValues,
    update: update,
    removeURL: '/user',
    removeId: removeId,
    removeIdRequest: 'user_id',
    responseKey: 'users',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
    additionalParams: useMemo(() => {
      const params = {};
      if (activeBtn !== null) params.active = activeBtn;
      if (adminBtn !== null) params.admin = adminBtn;
      if (daemonBtn !== null) params.daemon = daemonBtn;
      return params;
    }, [activeBtn, adminBtn, daemonBtn]),
  });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_USER) || accessSlice.userAccess?.includes(POST_ACTIVE_USER);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
    onDeleteRow,
  } = useCheckboxTable({
    listValue: usersList,
  });

  const sortedListValue = useMemo(() => {
    return stableSort(usersList, getComparator(order, orderBy));
    
  }, [order, orderBy, stableSort, usersList]);
  

  const onOpenAdd = useCallback(() => setOpenAddUser(true), []);
  const onOpenUserRole = useCallback((e) => setOpenUserRole(e.open), []);
  const onOpenEdit = useCallback((e) => setOpenEdit(e.open), []);
  const onOpenRemove = useCallback((e) => setOpenRemove(e.open), []);
  const onOpenAddUser = useCallback((e) => setOpenAddUser(e.open), []);

  
  const toggleFlag = useCallback((flagName) => {
    let newActive = activeBtn;
    let newAdmin = adminBtn;
    let newDaemon = daemonBtn;

    if (flagName === 'active') {
      if (activeBtn === null) newActive = true;
      else if (activeBtn === true) newActive = false;
      else newActive = null;
    }
    if (flagName === 'admin') {
      if (adminBtn === null) newAdmin = true;
      else if (adminBtn === true) newAdmin = false;
      else newAdmin = null;
    }
    if (flagName === 'daemon') {
      if (daemonBtn === null) newDaemon = true;
      else if (daemonBtn === true) newDaemon = false;
      else newDaemon = null;
    }

    setActiveBtn(newActive);
    setAdminBtn(newAdmin);
    setDaemonBtn(newDaemon);

    update();

  }, [activeBtn, adminBtn, daemonBtn, update]);





  return <>
    <ProBaseHeaderPage hasAddButton={true}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(13)}
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
                    description={giveText(23)}
                    onOpenAdd={onOpenAdd}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    controller={controller}
                    hasUserFlagButtons={true}
                    activeBtn={activeBtn}
                    adminBtn={adminBtn}
                    daemonBtn={daemonBtn}
                    toggleFlag={toggleFlag} />

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
                     <UsersTable key={row?.id}
                                 row={row}
                                 ids={ids}
                                 index={index}
                                 onChangeCheckbox={onChangeCheckbox}
                                 setOpenEdit={setOpenEdit}
                                 setUserList={setUserList}
                                 checkAccess={checkAccess}
                                 hasAccessCheckbox={hasAccessCheckbox}
                                 setOpenUserRole={setOpenUserRole}
                                 setOpenRemove={setOpenRemove}
                                 setIsLoadingAdminSwitches={setIsLoadingAdminSwitches}
                                 setIsLoadingActiveSwitches={setIsLoadingActiveSwitches}
                                 setIsLoadingDaemonSwitches={setIsLoadingDaemonSwitches}
                                patchUserFlag={patchUserFlag}

                                 isLoadingActiveSwitches={isLoadingActiveSwitches}
                                 isLoadingDaemonSwitches={isLoadingDaemonSwitches}
                                 isLoadingAdminSwitches={isLoadingAdminSwitches} />
                   ))} 
                   />

    <DialogRoot lazyMount placement={'center'} size={'lg'} open={openUserRole} onOpenChange={onOpenUserRole}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <UserRole usersList={userList} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'xl'} open={openEdit} onOpenChange={onOpenEdit}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <UserInfo usersList={userList}
                      backNone={true}
                      showActive={false}
                      showIsAdmin={false}
                      errorGetAllUsers={error}
                      isLoadingListAllUsers={isFetching}
                      closeModal={() => {
                        setOpenEdit(false);
                        update();
                      }}
                      general_url={'/user'}
                      password_url={'/password_admin'}
                      update={update}
                      UserAccessNameGET={GET_ALL_USER}
                      UserAccessNamePUT={PUT_USER}
                      UserAccessNamePassword={PUT_PASSWORD}
                      showable_current_password={false} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'sm'} open={openRemove} onOpenChange={onOpenRemove}>
      <DialogContent>
        <DialogBody p={2}>
          <Suspense fallback={'loading...'}>
            <Remove removeAxios={removeAxios}
                    data={userList}
                    onClose={() => {
                      setOpenRemove(false);
                      update();
                    }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} open={openAddUser} onOpenChange={onOpenAddUser}>
      <DialogContent maxW={'35rem'}>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <Register showIsAdmin={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_USER)}
                      showIsActive={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_USER)}
                      showExtra={false}
                      onCloseModal={() => {
                        setOpenAddUser(false);
                        update();
                      }}
                      hasLogo={false}
                      showCancel={true}
                      w={'35rem'}
                      hasAccessToAddAdminUser={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_USER)}
                      do_after={() => {
                        setOpenAddUser(false);
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
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_USER)),
                       onClickFunc: () => {
                         removeAxios({ data: { id: ids } });
                         onDeleteRow(ids);
                       },
                     }, {
                       title: giveText(160),
                       color: ['white', 'black'],
                       backgroundColor: ['orange.600', 'orange.200'],
                       hoverBackgroundColor: ['orange.800', 'orange.300'],
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ACTIVE_USER)),
                       onClickFunc: () => activeInactiveAxios({ active: false, users_ids: ids }),
                     }, {
                       title: giveText(161),
                       color: ['white', 'black'],
                       backgroundColor: ['green.600', 'green.200'],
                       hoverBackgroundColor: ['green.800', 'green.300'],
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ACTIVE_USER)),
                       onClickFunc: () => activeInactiveAxios({ active: true, users_ids: ids }),
                     }]} />
  </>;
}

// import {
//   promiseToast,
//   updatePromiseToastError,
//   updatePromiseToastSuccessWarningInfo,
// } from '../../../Base/BaseFunction.jsx';
// import { useDispatch, useSelector } from 'react-redux';
// import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
// import { giveDir, giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
// import {
//   GET_USER,
//   PUT_USER,
//   POST_USER,
//   DELETE_USER,
//   PUT_PASSWORD,
//   GET_ALL_USER,
//   GET_USER_ROLE,
//   POST_ACTIVE_USER,
// } from '../../../Base/UserAccessNames.jsx';
// import { fetchWithAxios } from '../../../Base/axios/FetchAxios.jsx';
// import { CheckBoxName } from '../../../Base/TableAttributes.jsx';
// import { useCheckboxTable } from '../../../Base/CustomHook/useCheckboxTable.jsx';
// import { useTableBaseActions } from '../../../Base/CustomHook/useTableBaseActions.jsx';
// import { useQueryClient } from '@tanstack/react-query';
// import { setIsDeleting } from '../../../../store/features/isLoadingSlice.jsx';
// import qs from 'qs';
// import { DialogBody, DialogContent, DialogRoot } from '../../../ui/dialog.jsx';
// import { BaseTablePage } from '../BaseTablePage.jsx';
// import { ActionBarTables } from '../../../Base/ActionBar/ActionBarTables.jsx';
// import { ProBaseHeaderPage } from '../ProBaseHeaderPage.jsx';
// import { setBreadcrumbAddress } from '../../../../store/features/baseSlice.jsx';
// import UsersTable from './UsersTable.jsx';
// import { toaster } from '../../../ui/toaster.jsx';
// import { Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
// import { EditIcon , RemoveIcon, SettingsIcon, UserActiveIcon, UserAdminIcon, UserDaemonIcon } from '../../../Base/IconsFeatures/Icons.jsx';

// const Register = lazy(() => import('../../../Authentication/Register/Register'));
// const UserRole = lazy(() => import('./Role/UserRole'));
// const UserInfo = lazy(() => import('../../UserInfo/UserInfo'));
// const Remove = lazy(() => import('../../../Base/IconsFeatures/Remove'));

// export default function UserManagement() {
//   const [isLoadingActiveSwitches, setIsLoadingActiveSwitches] = useState([]);
//   const [isLoadingAdminSwitches, setIsLoadingAdminSwitches] = useState([]);
//   const [isLoadingDaemonSwitches, setIsLoadingDaemonSwitches] = useState([]);
//   const accessSlice = useSelector(state => state.accessSlice);
//   const [userList, setUserList] = useState({});
//   const [searchValue, setSearchValue] = useState('');
//   const [order, setOrder] = useState('asc');
//   const [orderBy, setOrderBy] = useState('');
//   const [openAddUser, setOpenAddUser] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openRemove, setOpenRemove] = useState(false);
//   const [openUserRole, setOpenUserRole] = useState(false);
//   const dispatch = useDispatch();
//   const removeId = useMemo(() => 'id', []);
//   const queryClient = useQueryClient();
//   const reactQueryItemName = useMemo(() => 'all_users_list_react_query', []);
//   const activeUserURL = useMemo(() => '/active_user', []);

//   const [totalCountLabel, setTotalCountLabel] = useState(0);

//   const onOpenAdd = useCallback(() => setOpenAddUser(true), []);
//   const onOpenUserRole = useCallback((e) => setOpenUserRole(e.open), []);
//   const onOpenEdit = useCallback((e) => setOpenEdit(e.open), []);
//   const onOpenRemove = useCallback((e) => setOpenRemove(e.open), []);
//   const onOpenAddUser = useCallback((e) => setOpenAddUser(e.open), []);

//   const [activeBtn, setActiveBtn] = useState(false);
//   const [adminBtn, setAdminBtn] = useState(false);
//   const [daemonBtn, setDaemonBtn] = useState(false);

//   useEffect(() => {
//     dispatch(setBreadcrumbAddress([
//       { type: 'text', text: giveText(13) },
//       { type: 'text', text: giveText(51) },
//   ]));
//   }, []);

//   const checkAccess = useMemo(() => {
//     return (accessSlice.isAdmin
//       || accessSlice.userAccess?.includes(GET_USER_ROLE)
//       || accessSlice.userAccess?.includes(GET_USER)
//       || accessSlice.userAccess?.includes(PUT_USER)
//       || accessSlice.userAccess?.includes(DELETE_USER));
//   }, [accessSlice.isAdmin, accessSlice.userAccess]);

//   const update = useCallback(() => {
//     queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
//   }, [reactQueryItemName]);

//   const patchUserFlag = useCallback(
//     ({ url, active, user_ids, accessName, index, setLoading }) => {

//       if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(accessName)) {
//         toaster.create({
//           type: 'error',
//           title: giveText(30),
//           description: giveText(97),
//           dir: giveDir(),
//           duration: 3000,
//         });
//         return;
//       }

//       const toastId = promiseToast();

//       fetchWithAxios.patch(url, {
//         user_ids,
//         active,
//       })
//         .then((response) => {
//           update();
//         })
//         .catch((error) => {
//           updatePromiseToastError({ toastId, error });
//         })
//         .finally(() => {
//           if (setLoading && index !== undefined) {
//             setLoading(prev => prev.filter(i => i !== index));
//           }
//         });

//     },
//     [accessSlice.isAdmin, accessSlice.userAccess, update]
//   );


//   const activeInactiveAxios = useCallback(({ active = false, users_ids }) => {
//     if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(`${activeUserURL}_post`)) {
//       toaster.create({
//         type: 'error',
//         title: giveText(30),
//         description: giveText(97),
//         dir: giveDir(),
//         duration: 3000,
//       });

//     } else {
//       const toastId = promiseToast();

//       fetchWithAxios.post(activeUserURL, {}, {
//           params: {
//             users_ids: [...users_ids],
//             active,
//           },
//           paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
//         },
//       ).then((response) => {
//         update();
//       }).catch((error) => {
//         updatePromiseToastError({ toastId, error });
//       }).finally(() => {
//         dispatch(setIsDeleting(false));
//       });
//     }
//   }, [accessSlice.isAdmin, accessSlice.userAccess, activeUserURL, update]);

//   const onCloseEscape = useCallback(() => {
//     setOpenAddUser(false);
//     setOpenEdit(false);
//     setOpenRemove(false);
//     setOpenUserRole(false);
//   }, []);

//   const onShiftN = useCallback(() => {
//     setOpenAddUser(true);
//   }, []);

// const headCellsValues = useMemo(() => {
//   return [
//     CheckBoxName,
//     {
//       id: 'username',
//       label: (
//         <Box display="flex" alignItems="center" gap="8px">
//           {giveText(0)}
//         </Box>
//       )
//     },
//     { id: 'name', label: giveText(151) },
//     { id: 'family', label: giveText(152) },
//     { id: 'disabled', label: giveText(2) },
//     { id: 'admin', label: giveText(3) },
//     { id: 'daemon', label: giveText(414) },
//     { id: 'creator', label: giveText(416) },
//   ];
// }, []);

//   const {
//     listValue: usersList,
//     totalCount,
//     error,
//     isFetching,
//     stableSort,
//     getComparator,
//     headCells,
//     removeAxios,
//     lastElementRef,
//     controller,
//   } = useTableBaseActions({
//     getAllURL: '/user/all',
//     useQueryDependsUpdate: null,
//     onCloseEscape: onCloseEscape,
//     onShiftN: onShiftN,
//     checkAccess: checkAccess,
//     headCellsValues: headCellsValues,
//     update: update,
//     removeURL: '/user',
//     removeId: removeId,
//     removeIdRequest: 'user_id',
//     responseKey: 'users',
//     searchValue: searchValue,
//     reactQueryItemName: reactQueryItemName,
//     additionalParams: useMemo(() => {
//       const params = {};
//       if (activeBtn) params.active = true;
//       if (adminBtn) params.admin = true;
//       if (daemonBtn) params.daemon = true;
//       return params;
//     }, [activeBtn, adminBtn, daemonBtn]),
//   });

//   useEffect(() => {
//     setTotalCountLabel(totalCount ?? 0);
//   }, [totalCount]);

//   const hasAccessCheckbox = useMemo(() => {
//     return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_USER) || accessSlice.userAccess?.includes(POST_ACTIVE_USER);
//   }, [accessSlice]);

//   const {
//     ids,
//     isAnyChecked,
//     isAllChecked,
//     onChangeCheckboxAll,
//     onChangeCheckbox,
//     onDeleteRow,
//   } = useCheckboxTable({
//     listValue: usersList,
//   });

//   const sortedListValue = useMemo(() => {
//     return stableSort(usersList, getComparator(order, orderBy));
    
//   }, [order, orderBy, stableSort, usersList]);
  

//   // const onOpenAdd = useCallback(() => setOpenAddUser(true), []);
//   // const onOpenUserRole = useCallback((e) => setOpenUserRole(e.open), []);
//   // const onOpenEdit = useCallback((e) => setOpenEdit(e.open), []);
//   // const onOpenRemove = useCallback((e) => setOpenRemove(e.open), []);
//   // const onOpenAddUser = useCallback((e) => setOpenAddUser(e.open), []);

//   // const [activeBtn, setActiveBtn] = useState(false);
//   // const [adminBtn, setAdminBtn] = useState(false);
//   // const [daemonBtn, setDaemonBtn] = useState(false);

//   const toggleFlag = useCallback((flagName) => {
//     let newActive = activeBtn;
//     let newAdmin = adminBtn;
//     let newDaemon = daemonBtn;

//     if (flagName === 'active') newActive = !activeBtn;
//     if (flagName === 'admin') newAdmin = !adminBtn;
//     if (flagName === 'daemon') newDaemon = !daemonBtn;

//     setActiveBtn(newActive);
//     setAdminBtn(newAdmin);
//     setDaemonBtn(newDaemon);

//     update();

//   }, [activeBtn, adminBtn, daemonBtn, update]);





//   return <>
//     <ProBaseHeaderPage hasAddButton={true}
//                     title={<Box display="flex" alignItems="center" gap="8px">
//                     {giveText(13)}
//                     <Box 
//                       minW="25px"
//                       h="25px"
//                       bg="blue.500"
//                       color="white"
//                       borderRadius="50%"
//                       fontSize="12px"
//                       display="flex"
//                       alignItems="center"
//                       justifyContent="center"
//                     >
//                       {totalCountLabel}
//                     </Box>
                    
//                   </Box>}
//                     description={giveText(23)}
//                     onOpenAdd={onOpenAdd}
//                     searchValue={searchValue}
//                     setSearchValue={setSearchValue}
//                     controller={controller}
//                     hasUserFlagButtons={true}
//                     activeBtn={activeBtn}
//                     adminBtn={adminBtn}
//                     daemonBtn={daemonBtn}
//                     toggleFlag={toggleFlag} />

//     <BaseTablePage isLoadingListAllUsers={isFetching}
//                    headCells={headCells}
//                    order={order}
//                    orderBy={orderBy}
//                    setOrderBy={setOrderBy}
//                    setOrder={setOrder}
//                    hasCheckboxAccess={hasAccessCheckbox}
//                    isAllCheckedCheckbox={isAllChecked}
//                    isSomeCheckedCheckbox={isAnyChecked}
//                    lastElementRef={lastElementRef}
//                    onChangeCheckboxAll={() => onChangeCheckboxAll(sortedListValue)}
//                    body={sortedListValue?.map((row, index) => (
//                      <UsersTable key={row?.id}
//                                  row={row}
//                                  ids={ids}
//                                  index={index}
//                                  onChangeCheckbox={onChangeCheckbox}
//                                  setOpenEdit={setOpenEdit}
//                                  setUserList={setUserList}
//                                  checkAccess={checkAccess}
//                                  hasAccessCheckbox={hasAccessCheckbox}
//                                  setOpenUserRole={setOpenUserRole}
//                                  setOpenRemove={setOpenRemove}
//                                  setIsLoadingAdminSwitches={setIsLoadingAdminSwitches}
//                                  setIsLoadingActiveSwitches={setIsLoadingActiveSwitches}
//                                  setIsLoadingDaemonSwitches={setIsLoadingDaemonSwitches}
//                                 patchUserFlag={patchUserFlag}

//                                  isLoadingActiveSwitches={isLoadingActiveSwitches}
//                                  isLoadingDaemonSwitches={isLoadingDaemonSwitches}
//                                  isLoadingAdminSwitches={isLoadingAdminSwitches} />
//                    ))} 
//                    />

//     <DialogRoot lazyMount placement={'center'} size={'lg'} open={openUserRole} onOpenChange={onOpenUserRole}>
//       <DialogContent>
//         <DialogBody>
//           <Suspense fallback={'loading...'}>
//             <UserRole usersList={userList} />
//           </Suspense>
//         </DialogBody>
//       </DialogContent>
//     </DialogRoot>

//     <DialogRoot lazyMount placement={'center'} size={'xl'} open={openEdit} onOpenChange={onOpenEdit}>
//       <DialogContent>
//         <DialogBody>
//           <Suspense fallback={'loading...'}>
//             <UserInfo usersList={userList}
//                       backNone={true}
//                       showActive={false}
//                       showIsAdmin={false}
//                       errorGetAllUsers={error}
//                       isLoadingListAllUsers={isFetching}
//                       closeModal={() => {
//                         setOpenEdit(false);
//                         update();
//                       }}
//                       general_url={'/user'}
//                       password_url={'/password_admin'}
//                       update={update}
//                       UserAccessNameGET={GET_ALL_USER}
//                       UserAccessNamePUT={PUT_USER}
//                       UserAccessNamePassword={PUT_PASSWORD}
//                       showable_current_password={false} />
//           </Suspense>
//         </DialogBody>
//       </DialogContent>
//     </DialogRoot>

//     <DialogRoot lazyMount placement={'center'} size={'sm'} open={openRemove} onOpenChange={onOpenRemove}>
//       <DialogContent>
//         <DialogBody p={2}>
//           <Suspense fallback={'loading...'}>
//             <Remove removeAxios={removeAxios}
//                     data={userList}
//                     onClose={() => {
//                       setOpenRemove(false);
//                       update();
//                     }} />
//           </Suspense>
//         </DialogBody>
//       </DialogContent>
//     </DialogRoot>

//     <DialogRoot lazyMount placement={'center'} open={openAddUser} onOpenChange={onOpenAddUser}>
//       <DialogContent maxW={'35rem'}>
//         <DialogBody>
//           <Suspense fallback={'loading...'}>
//             <Register showIsAdmin={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_USER)}
//                       showIsActive={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_USER)}
//                       showExtra={false}
//                       onCloseModal={() => {
//                         setOpenAddUser(false);
//                         update();
//                       }}
//                       hasLogo={false}
//                       showCancel={true}
//                       w={'35rem'}
//                       hasAccessToAddAdminUser={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_USER)}
//                       do_after={() => {
//                         setOpenAddUser(false);
//                       }} />
//           </Suspense>
//         </DialogBody>
//       </DialogContent>
//     </DialogRoot>

//     <ActionBarTables selectedCount={ids.size}
//                      buttons={[{
//                        title: giveText(129),
//                        color: ['white', 'black'],
//                        backgroundColor: ['red.600', 'red.200'],
//                        hoverBackgroundColor: ['red.800', 'red.300'],
//                        hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_USER)),
//                        onClickFunc: () => {
//                          removeAxios({ data: { id: ids } });
//                          onDeleteRow(ids);
//                        },
//                      }, {
//                        title: giveText(160),
//                        color: ['white', 'black'],
//                        backgroundColor: ['orange.600', 'orange.200'],
//                        hoverBackgroundColor: ['orange.800', 'orange.300'],
//                        hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ACTIVE_USER)),
//                        onClickFunc: () => activeInactiveAxios({ active: false, users_ids: ids }),
//                      }, {
//                        title: giveText(161),
//                        color: ['white', 'black'],
//                        backgroundColor: ['green.600', 'green.200'],
//                        hoverBackgroundColor: ['green.800', 'green.300'],
//                        hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ACTIVE_USER)),
//                        onClickFunc: () => activeInactiveAxios({ active: true, users_ids: ids }),
//                      }]} />
//   </>;
// }
// // import {
// //   promiseToast,
// //   updatePromiseToastError,
// //   updatePromiseToastSuccessWarningInfo,
// // } from '../../../Base/BaseFunction.jsx';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
// // import { giveDir, giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
// // import {
// //   GET_USER,
// //   PUT_USER,
// //   POST_USER,
// //   DELETE_USER,
// //   PUT_PASSWORD,
// //   GET_ALL_USER,
// //   GET_USER_ROLE,
// //   POST_ACTIVE_USER,
// // } from '../../../Base/UserAccessNames.jsx';
// // import { fetchWithAxios } from '../../../Base/axios/FetchAxios.jsx';
// // import { CheckBoxName } from '../../../Base/TableAttributes.jsx';
// // import { useCheckboxTable } from '../../../Base/CustomHook/useCheckboxTable.jsx';
// // import { useTableBaseActions } from '../../../Base/CustomHook/useTableBaseActions.jsx';
// // import { useQueryClient } from '@tanstack/react-query';
// // import { setIsDeleting } from '../../../../store/features/isLoadingSlice.jsx';
// // import qs from 'qs';
// // import { DialogBody, DialogContent, DialogRoot } from '../../../ui/dialog.jsx';
// // import { BaseTablePage } from '../BaseTablePage.jsx';
// // import { ActionBarTables } from '../../../Base/ActionBar/ActionBarTables.jsx';
// // import { ProBaseHeaderPage } from '../ProBaseHeaderPage.jsx';
// // import { setBreadcrumbAddress } from '../../../../store/features/baseSlice.jsx';
// // import UsersTable from './UsersTable.jsx';
// // import { toaster } from '../../../ui/toaster.jsx';
// // import { Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
// // import { EditIcon , RemoveIcon, SettingsIcon, UserActiveIcon, UserAdminIcon, UserDaemonIcon } from '../../../Base/IconsFeatures/Icons.jsx';

// // const Register = lazy(() => import('../../../Authentication/Register/Register'));
// // const UserRole = lazy(() => import('./Role/UserRole'));
// // const UserInfo = lazy(() => import('../../UserInfo/UserInfo'));
// // const Remove = lazy(() => import('../../../Base/IconsFeatures/Remove'));

// // export default function UserManagement() {
// //   const [isLoadingActiveSwitches, setIsLoadingActiveSwitches] = useState([]);
// //   const [isLoadingAdminSwitches, setIsLoadingAdminSwitches] = useState([]);
// //   const [isLoadingDaemonSwitches, setIsLoadingDaemonSwitches] = useState([]);
// //   const accessSlice = useSelector(state => state.accessSlice);
// //   const [userList, setUserList] = useState({});
// //   const [searchValue, setSearchValue] = useState('');
// //   const [order, setOrder] = useState('asc');
// //   const [orderBy, setOrderBy] = useState('');
// //   const [openAddUser, setOpenAddUser] = useState(false);
// //   const [openEdit, setOpenEdit] = useState(false);
// //   const [openRemove, setOpenRemove] = useState(false);
// //   const [openUserRole, setOpenUserRole] = useState(false);
// //   const dispatch = useDispatch();
// //   const removeId = useMemo(() => 'id', []);
// //   const queryClient = useQueryClient();
// //   const reactQueryItemName = useMemo(() => 'all_users_list_react_query', []);
// //   const activeUserURL = useMemo(() => '/active_user', []);

// //   const [totalCountLabel, setTotalCountLabel] = useState(0);



// //   useEffect(() => {
// //     dispatch(setBreadcrumbAddress([
// //       { type: 'text', text: giveText(13) },
// //       { type: 'text', text: giveText(51) },
// //   ]));
// //   }, []);

// //   const checkAccess = useMemo(() => {
// //     return (accessSlice.isAdmin
// //       || accessSlice.userAccess?.includes(GET_USER_ROLE)
// //       || accessSlice.userAccess?.includes(GET_USER)
// //       || accessSlice.userAccess?.includes(PUT_USER)
// //       || accessSlice.userAccess?.includes(DELETE_USER));
// //   }, [accessSlice.isAdmin, accessSlice.userAccess]);

// //   const update = useCallback(() => {
// //     queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
// //   }, [reactQueryItemName]);

// //   // const updateOnTable = useCallback(({ disabled=null, admin=null, daemon=null, usersListValue, index}) => {
// //   //   if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_USER)) {
// //   //     toaster.create({
// //   //       type: 'error',
// //   //       title: giveText(30),
// //   //       description: giveText(97),
// //   //       dir: giveDir(),
// //   //       duration: 3000,
// //   //     });

// //   //   } else {
// //   //     const toastId = promiseToast();

// //   //     fetchWithAxios.put('/user', {
// //   //       'user_id': usersListValue.id,
// //   //       'username': usersListValue.username,
// //   //       'email': usersListValue.email,
// //   //       'name': usersListValue.name,
// //   //       'family': usersListValue.family,
// //   //       // 'description': usersListValue.description,
// //   //       // 'disabled': disabled !== null ? disabled : !!usersListValue.disabled,
// //   //       // 'admin': admin !== null ? admin : usersListValue.admin,
// //   //       // 'daemon': daemon !== null ? daemon : usersListValue.daemon,

// //   //       'profile_pic': usersListValue.profile_pic,
// //   //       'creator': usersListValue.creator.username,
// //   //     }).then((response) => {
// //   //       update();
// //   //       updatePromiseToastSuccessWarningInfo({ toastId, response });

// //   //     }).catch((error) => {
// //   //       updatePromiseToastError({ toastId, error });
// //   //     }).finally(() => {
// //   //       setTimeout(() => {
// //   //         setIsLoadingAdminSwitches((prevState) => prevState.filter(num => num !== index));
// //   //         setIsLoadingActiveSwitches((prevState) => prevState.filter(num => num !== index));
// //   //         setIsLoadingDaemonSwitches((prevState) => prevState.filter(num => num !== index));
// //   //       }, 1000);
// //   //     })
// //   //   }
// //   // }, [accessSlice.isAdmin, accessSlice.userAccess, update]);

// //   const patchUserFlag = useCallback(
// //     ({ url, active, user_ids, accessName, index, setLoading }) => {

// //       if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(accessName)) {
// //         toaster.create({
// //           type: 'error',
// //           title: giveText(30),
// //           description: giveText(97),
// //           dir: giveDir(),
// //           duration: 3000,
// //         });
// //         return;
// //       }

// //       const toastId = promiseToast();

// //       // fetchWithAxios.patch(
// //       //   url,
// //       //   { user_ids },   
// //       //   {
// //       //     params: { active }
// //       //   }
// //       // )
// //       fetchWithAxios.patch(url, {
// //         user_ids,
// //         active,
// //       })
// //         .then((response) => {
// //           update();
// //           // updatePromiseToastSuccessWarningInfo({ toastId, response });
// //         })
// //         .catch((error) => {
// //           updatePromiseToastError({ toastId, error });
// //         })
// //         .finally(() => {
// //           if (setLoading && index !== undefined) {
// //             setLoading(prev => prev.filter(i => i !== index));
// //           }
// //         });

// //     },
// //     [accessSlice.isAdmin, accessSlice.userAccess, update]
// //   );


// //   const activeInactiveAxios = useCallback(({ active = false, users_ids }) => {
// //     if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(`${activeUserURL}_post`)) {
// //       toaster.create({
// //         type: 'error',
// //         title: giveText(30),
// //         description: giveText(97),
// //         dir: giveDir(),
// //         duration: 3000,
// //       });

// //     } else {
// //       const toastId = promiseToast();

// //       fetchWithAxios.post(activeUserURL, {}, {
// //           params: {
// //             users_ids: [...users_ids],
// //             active,
// //           },
// //           paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
// //         },
// //       ).then((response) => {
// //         update();
// //         // updatePromiseToastSuccessWarningInfo({ toastId, response });
// //       }).catch((error) => {
// //         updatePromiseToastError({ toastId, error });
// //       }).finally(() => {
// //         dispatch(setIsDeleting(false));
// //       });
// //     }
// //   }, [accessSlice.isAdmin, accessSlice.userAccess, activeUserURL, update]);

// //   const onCloseEscape = useCallback(() => {
// //     setOpenAddUser(false);
// //     setOpenEdit(false);
// //     setOpenRemove(false);
// //     setOpenUserRole(false);
// //   }, []);

// //   const onShiftN = useCallback(() => {
// //     setOpenAddUser(true);
// //   }, []);

// // const headCellsValues = useMemo(() => {
// //   return [
// //     CheckBoxName,
// //     {
// //       id: 'username',
// //       label: (
// //         <Box display="flex" alignItems="center" gap="8px">
// //           {giveText(0)}
// //           {/* <Box 
// //             minW="25px"
// //             h="25px"
// //             bg="blue.500"
// //             color="white"
// //             borderRadius="50%"
// //             fontSize="12px"
// //             display="flex"
// //             alignItems="center"
// //             justifyContent="center"
// //           >
// //             {totalCountLabel}
// //           </Box> */}
          
// //         </Box>
// //       )
// //     },
// //     { id: 'name', label: giveText(151) },
// //     { id: 'family', label: giveText(152) },
// //     { id: 'disabled', label: giveText(2) },
// //     { id: 'admin', label: giveText(3) },
// //     { id: 'daemon', label: giveText(414) },
// //     { id: 'creator', label: giveText(416) },
// //   ];
// // }, [totalCountLabel]);

// //   const {
// //     listValue: usersList,
// //     totalCount,
// //     error,
// //     isFetching,
// //     stableSort,
// //     getComparator,
// //     headCells,
// //     removeAxios,
// //     lastElementRef,
// //     controller,
// //   } = useTableBaseActions({
// //     getAllURL: '/user/all',
// //     useQueryDependsUpdate: null,
// //     onCloseEscape: onCloseEscape,
// //     onShiftN: onShiftN,
// //     checkAccess: checkAccess,
// //     headCellsValues: headCellsValues,
// //     update: update,
// //     removeURL: '/user',
// //     removeId: removeId,
// //     removeIdRequest: 'user_id',
// //     responseKey: 'users',
// //     searchValue: searchValue,
// //     reactQueryItemName: reactQueryItemName,
// //   });

// //   console.log('userList0', userList);

// //   useEffect(() => {
// //     setTotalCountLabel(totalCount ?? 0);
// //   }, [totalCount]);

// //   const hasAccessCheckbox = useMemo(() => {
// //     return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_USER) || accessSlice.userAccess?.includes(POST_ACTIVE_USER);
// //   }, [accessSlice]);

// //   const {
// //     ids,
// //     isAnyChecked,
// //     isAllChecked,
// //     onChangeCheckboxAll,
// //     onChangeCheckbox,
// //     onDeleteRow,
// //   } = useCheckboxTable({
// //     listValue: usersList,
// //   });
// //   console.log('userList1', userList);

// //   const sortedListValue = useMemo(() => {
// //     console.log('userList', userList);
// //     return stableSort(usersList, getComparator(order, orderBy));
    
// //   }, [order, orderBy, stableSort, usersList]);
  

// //   const onOpenAdd = useCallback(() => setOpenAddUser(true), []);
// //   const onOpenUserRole = useCallback((e) => setOpenUserRole(e.open), []);
// //   const onOpenEdit = useCallback((e) => setOpenEdit(e.open), []);
// //   const onOpenRemove = useCallback((e) => setOpenRemove(e.open), []);
// //   const onOpenAddUser = useCallback((e) => setOpenAddUser(e.open), []);

// //   const [activeBtn, setActiveBtn] = useState(false);
// //   const [adminBtn, setAdminBtn] = useState(false);
// //   const [daemonBtn, setDaemonBtn] = useState(false);

// //   // useEffect(() => {
// //   //   if (usersList.length > 0) {
// //   //     setActiveBtn(usersList.some(u => u.active));
// //   //     setAdminBtn(usersList.some(u => u.admin));
// //   //     setDaemonBtn(usersList.some(u => u.daemon));
// //   //   }
// //   // }, [usersList]);

// //   const toggleFlag = useCallback((flagName) => {
// //     let newActive = activeBtn;
// //     let newAdmin = adminBtn;
// //     let newDaemon = daemonBtn;

// //     if (flagName === 'active') newActive = !activeBtn;
// //     if (flagName === 'admin') newAdmin = !adminBtn;
// //     if (flagName === 'daemon') newDaemon = !daemonBtn;

// //     // const toastId = promiseToast({ type: 'loading' });

// //     fetchWithAxios.get('/user/all', {
// //       params: {
// //         active: newActive,
// //         admin: newAdmin,
// //         daemon: newDaemon,
// //         page: 1,
// //         page_size: 20,
// //         search: searchValue
// //       }
// //     }).then((response) => {
// //       if (response.data?.users) setUserList(response.data.users);
// //       console.log('response', response);


// //       setActiveBtn(newActive);
// //       setAdminBtn(newAdmin);
// //       setDaemonBtn(newDaemon);

// //       // update();
// //     }).catch((error) => {
// //       updatePromiseToastError({ toastId, error, type: 'error' });
// //     });

// //   }, [activeBtn, adminBtn, daemonBtn, searchValue, update]);





// //   return <>
// //     <ProBaseHeaderPage hasAddButton={true}
// //                     title={<Box display="flex" alignItems="center" gap="8px">
// //                     {giveText(13)}
// //                     <Box 
// //                       minW="25px"
// //                       h="25px"
// //                       bg="blue.500"
// //                       color="white"
// //                       borderRadius="50%"
// //                       fontSize="12px"
// //                       display="flex"
// //                       alignItems="center"
// //                       justifyContent="center"
// //                     >
// //                       {totalCountLabel}
// //                     </Box>
                    
// //                   </Box>}
// //                     description={giveText(23)}
// //                     InputRightElement={(
// //                       <Box
// //                         textAlign="center"
// //                         display="inline-block"
// //                       >
// //                             <HStack marginLeft={'400px'}>
// //                               <Button
// //                                 bg={activeBtn ? 'yellow.400' : 'transparent'}
// //                                 onClick={() => toggleFlag('active')}
// //                               >
// //                                 <UserActiveIcon width="2rem" />
// //                               </Button>

// //                               <Button
// //                                 bg={adminBtn ? 'yellow.400' : 'transparent'}
// //                                 onClick={() => toggleFlag('admin')}
// //                               >
// //                                 <UserAdminIcon width="2rem" />
// //                               </Button>

// //                               <Button
// //                                 bg={daemonBtn ? 'yellow.400' : 'transparent'}
// //                                 onClick={() => toggleFlag('daemon')}
// //                               >
// //                                 <UserDaemonIcon width="2rem" />
// //                               </Button>

// //                             </HStack>

// //                       </Box>
// //                     )}
                    
// //                     onOpenAdd={onOpenAdd}
// //                     searchValue={searchValue}
// //                     setSearchValue={setSearchValue}
// //                     controller={controller} />

// //     <BaseTablePage isLoadingListAllUsers={isFetching}
// //                    headCells={headCells}
// //                    order={order}
// //                    orderBy={orderBy}
// //                    setOrderBy={setOrderBy}
// //                    setOrder={setOrder}
// //                    hasCheckboxAccess={hasAccessCheckbox}
// //                    isAllCheckedCheckbox={isAllChecked}
// //                    isSomeCheckedCheckbox={isAnyChecked}
// //                    lastElementRef={lastElementRef}
// //                    onChangeCheckboxAll={() => onChangeCheckboxAll(sortedListValue)}
// //                    body={sortedListValue?.map((row, index) => (
// //                      <UsersTable key={row?.id}
// //                                  row={row}
// //                                  ids={ids}
// //                                  index={index}
// //                                  onChangeCheckbox={onChangeCheckbox}
// //                                  setOpenEdit={setOpenEdit}
// //                                  setUserList={setUserList}
// //                                  checkAccess={checkAccess}
// //                                  hasAccessCheckbox={hasAccessCheckbox}
// //                                  setOpenUserRole={setOpenUserRole}
// //                                  setOpenRemove={setOpenRemove}
// //                                  setIsLoadingAdminSwitches={setIsLoadingAdminSwitches}
// //                                  setIsLoadingActiveSwitches={setIsLoadingActiveSwitches}
// //                                  setIsLoadingDaemonSwitches={setIsLoadingDaemonSwitches}
// //                                 //  updateOnTable={updateOnTable}
// //                                 patchUserFlag={patchUserFlag}

// //                                  isLoadingActiveSwitches={isLoadingActiveSwitches}
// //                                  isLoadingDaemonSwitches={isLoadingDaemonSwitches}
// //                                  isLoadingAdminSwitches={isLoadingAdminSwitches} />
// //                    ))} 
// //                    />

// //     <DialogRoot lazyMount placement={'center'} size={'lg'} open={openUserRole} onOpenChange={onOpenUserRole}>
// //       <DialogContent>
// //         <DialogBody>
// //           <Suspense fallback={'loading...'}>
// //             <UserRole usersList={userList} />
// //           </Suspense>
// //         </DialogBody>
// //       </DialogContent>
// //     </DialogRoot>

// //     <DialogRoot lazyMount placement={'center'} size={'xl'} open={openEdit} onOpenChange={onOpenEdit}>
// //       <DialogContent>
// //         <DialogBody>
// //           <Suspense fallback={'loading...'}>
// //             <UserInfo usersList={userList}
// //                       backNone={true}
// //                       showActive={false}
// //                       showIsAdmin={false}
// //                       errorGetAllUsers={error}
// //                       isLoadingListAllUsers={isFetching}
// //                       closeModal={() => {
// //                         setOpenEdit(false);
// //                         update();
// //                       }}
// //                       general_url={'/user'}
// //                       password_url={'/password_admin'}
// //                       update={update}
// //                       UserAccessNameGET={GET_ALL_USER}
// //                       UserAccessNamePUT={PUT_USER}
// //                       UserAccessNamePassword={PUT_PASSWORD}
// //                       showable_current_password={false} />
// //           </Suspense>
// //         </DialogBody>
// //       </DialogContent>
// //     </DialogRoot>

// //     <DialogRoot lazyMount placement={'center'} size={'sm'} open={openRemove} onOpenChange={onOpenRemove}>
// //       <DialogContent>
// //         <DialogBody p={2}>
// //           <Suspense fallback={'loading...'}>
// //             <Remove removeAxios={removeAxios}
// //                     data={userList}
// //                     onClose={() => {
// //                       setOpenRemove(false);
// //                       update();
// //                     }} />
// //           </Suspense>
// //         </DialogBody>
// //       </DialogContent>
// //     </DialogRoot>

// //     <DialogRoot lazyMount placement={'center'} open={openAddUser} onOpenChange={onOpenAddUser}>
// //       <DialogContent maxW={'35rem'}>
// //         <DialogBody>
// //           <Suspense fallback={'loading...'}>
// //             <Register showIsAdmin={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_USER)}
// //                       showIsActive={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_USER)}
// //                       showExtra={false}
// //                       onCloseModal={() => {
// //                         setOpenAddUser(false);
// //                         update();
// //                       }}
// //                       hasLogo={false}
// //                       showCancel={true}
// //                       w={'35rem'}
// //                       hasAccessToAddAdminUser={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_USER)}
// //                       do_after={() => {
// //                         setOpenAddUser(false);
// //                       }} />
// //           </Suspense>
// //         </DialogBody>
// //       </DialogContent>
// //     </DialogRoot>

// //     <ActionBarTables selectedCount={ids.size}
// //                      buttons={[{
// //                        title: giveText(129),
// //                        color: ['white', 'black'],
// //                        backgroundColor: ['red.600', 'red.200'],
// //                        hoverBackgroundColor: ['red.800', 'red.300'],
// //                        hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_USER)),
// //                        onClickFunc: () => {
// //                          removeAxios({ data: { id: ids } });
// //                          onDeleteRow(ids);
// //                        },
// //                      }, {
// //                        title: giveText(160),
// //                        color: ['white', 'black'],
// //                        backgroundColor: ['orange.600', 'orange.200'],
// //                        hoverBackgroundColor: ['orange.800', 'orange.300'],
// //                        hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ACTIVE_USER)),
// //                        onClickFunc: () => activeInactiveAxios({ active: false, users_ids: ids }),
// //                      }, {
// //                        title: giveText(161),
// //                        color: ['white', 'black'],
// //                        backgroundColor: ['green.600', 'green.200'],
// //                        hoverBackgroundColor: ['green.800', 'green.300'],
// //                        hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ACTIVE_USER)),
// //                        onClickFunc: () => activeInactiveAxios({ active: true, users_ids: ids }),
// //                      }]} />
// //   </>;
// // }
