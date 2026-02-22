import { Box, Center, HStack } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../BaseTablePage.jsx';
import { TableText, User } from '../../../Base/Extensions.jsx';
import { setHasUpdatedWalletManagementTable } from '../../../../store/features/updatedSlice.jsx';
import { giveDir, giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { PUT_AMOUNT, PUT_CHARGE_WALLET, PUT_SUSPEND } from '../../../Base/UserAccessNames.jsx';
import { SettingsIcon, WalletSuspendIcon } from '../../../Base/IconsFeatures/Icons.jsx';
import { CheckBoxName } from '../../../Base/TableAttributes.jsx';
import { useCheckboxTable } from '../../../Base/CustomHook/useCheckboxTable.jsx';
import { useTableBaseActions } from '../../../Base/CustomHook/useTableBaseActions.jsx';
import { CustomCircularProgress } from '../../../Base/CustomComponets/CustomCircularProgress.jsx';
import {
  showToast,
  promiseToast,
  giveTableRef,
  commaForEvery3Digit,
  updatePromiseToastError,
  checkStatus,
  updatePromiseToastSuccessWarningInfo,
} from '../../../Base/BaseFunction.jsx';
import { fetchWithAxios } from '../../../Base/axios/FetchAxios.jsx';
import qs from 'qs';
import { useQueryClient } from '@tanstack/react-query';
import { useButtonsCheckboxTable } from '../../../Base/CustomHook/useButtonsCheckboxTable.jsx';
import { Tooltip } from '../../../ui/tooltip.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../ui/dialog.jsx';
import { SolidLockIcon } from '../../../Base/CustomIcons/SolidLockIcon.jsx';
import { SolidLockOpenIcon } from '../../../Base/CustomIcons/SolidLockOpenIcon.jsx';
import { MoneyBagIcon } from '../../../Base/CustomIcons/MoneyBagIcon.jsx';
import { CheckBoxTable } from '../../../Base/CustomHook/CheckBoxTable.jsx';

const IncreaseBalance = lazy(() => import('../../../Base/Navbar/Wallet/IncreaseBalance'));

export default function WalletManager() {
  const [isLoadingSuspendSwitches, setIsLoadingSuspendSwitches] = useState([]);
  const updatedSlice = useSelector(state => state.updatedSlice);
  const accessSlice = useSelector(state => state.accessSlice);
  const [formField, setFormField] = useState({});
  const [walletsSelected, setWalletsSelected] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isOpenAddPrice, setIsOpenAddPrice] = useState(false);
  const [isOpenAddPriceMultiple, setIsOpenAddPriceMultiple] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_users_wallet_list_react_query', []);

  const checkAccess = useCallback(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_AMOUNT);
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  const updated = useCallback(() => {
    dispatch(setHasUpdatedWalletManagementTable(!updatedSlice.hasUpdatedWalletManagementTable));
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName, updatedSlice.hasUpdatedWalletManagementTable]);

  const openAddPriceModal = useCallback((value) => {
    setFormField(value);
    setIsOpenAddPrice(true);
  }, []);

  const openAddPriceMultipleModal = useCallback(() => {
    setFormField({});
    setIsOpenAddPriceMultiple(true);
  }, []);

  const suspendAxios = ({ status = false, suspend_user_ids = [], index }) => {
    const toastId = promiseToast();

    fetchWithAxios.put(`/suspend`, {}, {
        params: {
          suspend_user_ids,
          status,
        },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
      },
    ).then((response) => {
      updated();
      setTimeout(() => {
        setIsLoadingSuspendSwitches((prevState) => prevState.filter(num => num !== index));
      }, 1000);
      updatePromiseToastSuccessWarningInfo({ toastId, response });

    }).catch((error) => {
      updatePromiseToastError({ toastId, error });
    });
  };

  const chargeWalletAxios = ({ value, user_ids }) => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_CHARGE_WALLET)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (value < 1 || value > 1000000000) {
      showToast({
        title: giveText(30),
        description: giveText(188),
        status: 2,
      });
    } else {
      const toastId = promiseToast();

      fetchWithAxios.put('/amount', {}, {
        params: {
          amount: value,
          user_ids,
        },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
      }).then((response) => {
        if (checkStatus({ status: response.data.status })) {
          setIsOpenAddPrice(false);
          setIsOpenAddPriceMultiple(false);
          updated();
        }
        updatePromiseToastSuccessWarningInfo({ toastId, response });

      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      });
    }
  };

  const {
    listValue,
    error,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    lastElementRef,
  } = useTableBaseActions({
    getAllURL: '/users_wallet/all',
    useQueryDependsUpdate: updatedSlice.hasUpdatedWalletManagementTable,
    checkAccess: checkAccess(),
    headCellsValues: [
      CheckBoxName,
      { id: 'user', label: giveText(0) },
      { id: 'wallet_number', label: giveText(193) },
      { id: 'balance', label: giveText(187) },
      { id: 'suspend', label: giveText(194) },
    ],
    update: () => updated(),
    hasAccessToRemove: false,
    responseKey: 'users_wallet',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
  });

  const {
    onChangeCheckbox,
    onChangeCheckboxAll,
    setCheckBoxStatus,
    isAnyChecked,
    isAllChecked,
    checkBoxStatus,
    ids,
  } = useCheckboxTable({
    listValue,
    listIdToRemove: 'user_id',
  });

  useEffect(() => {
    let temp = [];

    listValue && listValue.map((value, index) => {
      if (checkBoxStatus[index]) {
        temp.push(value);
      }
    });

    setWalletsSelected(temp);
  }, [checkBoxStatus, listValue]);

  const { ButtonComponent: SuspendButtonComponent } = useButtonsCheckboxTable({
    isAnyChecked,
    title: giveText(194),
    color: ['white', 'black'],
    backgroundColor: ['red.600', 'red.200'],
    hoverBackgroundColor: ['red.800', 'red.300'],
    hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SUSPEND)),
    checkBoxStatus: checkBoxStatus,
    onClickFunc: () => suspendAxios({ suspend_user_ids: ids, status: true }),
    icon: <SolidLockIcon width={'1rem'} />,
  });

  const { ButtonComponent: UnSuspendButtonComponent } = useButtonsCheckboxTable({
    isAnyChecked,
    title: giveText(195),
    color: ['white', 'black'],
    backgroundColor: ['green.600', 'green.200'],
    hoverBackgroundColor: ['green.800', 'green.300'],
    hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SUSPEND)),
    checkBoxStatus: checkBoxStatus,
    onClickFunc: () => suspendAxios({ user_ids: ids, status: false }),
    icon: <SolidLockOpenIcon width={'1rem'} />,
  });

  const { ButtonComponent: AddPriceMultipleButtonComponent } = useButtonsCheckboxTable({
    isAnyChecked,
    title: giveText(186),
    color: ['white', 'black'],
    backgroundColor: ['cyan.600', 'cyan.200'],
    hoverBackgroundColor: ['cyan.800', 'cyan.300'],
    hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SUSPEND)),
    checkBoxStatus: checkBoxStatus,
    onClickFunc: () => openAddPriceMultipleModal({ ids, status: false }),
    icon: <MoneyBagIcon width={'1rem'} />,
  });

  const rows = useMemo(() => {
    setCheckBoxStatus(Array.from({ length: listValue.length }, () => false));

    return listValue
      .map((wallet) => ({
        user_id: wallet?.user_id,
        username: wallet?.username,
        name: wallet?.name,
        family: wallet?.family,
        email: wallet?.email,
        profile_pic: wallet?.profile_pic,
        wallet_number: wallet?.wallet_number,
        amount: wallet?.amount,
        suspend: wallet?.suspend,
      }));
  }, [listValue, setCheckBoxStatus]);

  return <>
    <BaseTablePage title={giveText(192)}
                   isLoadingListAllUsers={isFetching}
                   description={giveText(204)}
                   headCells={headCells}
                   order={order}
                   errorGetAllUsers={error}
                   orderBy={orderBy}
                   setOrderBy={setOrderBy}
                   setOrder={setOrder}
                   hasAddButton={false}
                   searchValue={searchValue}
                   setSearchValue={setSearchValue}
                   tableSX={{ 'td, th': { borderBottomWidth: 0 } }}
                   isAllCheckedCheckbox={isAllChecked}
                   isSomeCheckedCheckbox={isAnyChecked}
                   onChangeCheckboxAll={() => onChangeCheckboxAll(listValue.length)}
                   extension={(
                     <HStack>
                       {UnSuspendButtonComponent}
                       {SuspendButtonComponent}
                       {AddPriceMultipleButtonComponent}
                     </HStack>
                   )}
                   body={
                     rows && stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
                       <>
                         <TableRow hover role="checkbox" tabIndex={-1} key={index}
                                   ref={giveTableRef({
                                     listValue: stableSort(rows, getComparator(order, orderBy)),
                                     value: row,
                                     index: index,
                                     ref: lastElementRef,
                                   })}>
                           <TableCell component="th" scope="row">
                             <Center>
                               <CheckBoxTable row={row}
                                              listId="id"
                                              ids={ids}
                                              onChangeCheckbox={onChangeCheckbox}
                                              hasAccessCheckbox={hasAccessCheckbox} />
                             </Center>
                           </TableCell>

                           <TableCell align={'center'} component="th" scope="row">
                             <User cursor={''}
                                   userInfo={{
                                     username: row.username,
                                     profile_pic: row.profile_pic,
                                     email: row.email,
                                   }} />
                           </TableCell>

                           <TableCell align={'center'} component="th" scope="row">
                             <TableText cursor={'default'} text={row.wallet_number} maxLength={20} />
                           </TableCell>

                           <TableCell align={'center'} component="th" scope="row">
                             <TableText cursor={'default'}
                                        text={`${commaForEvery3Digit(row?.amount)} ` + (giveDir() === 'rtl' ? 'ریال' : 'Rial')}
                                        maxLength={30} />
                           </TableCell>

                           <TableCell align={'center'} component="th" scope="row">
                             <Center>
                               <HStack spacing={2}>
                                 <Tooltip showArrow content={giveText(5)} bg={'black'} color={'white'}
                                          fontWeight={'bold'}>
                                   <Box display={'inline-block'}
                                        cursor={(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SUSPEND)) && !isLoadingSuspendSwitches.includes(index) ? 'pointer' : 'default'}
                                        onClick={() => {
                                          if (accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SUSPEND)) {
                                            setIsLoadingSuspendSwitches((prevState) => [...prevState, index]);

                                            if (row.suspend) {
                                              suspendAxios({
                                                status: false,
                                                suspend_user_ids: [row.user_id],
                                                index: index,
                                              });
                                            } else {
                                              suspendAxios({
                                                status: true,
                                                suspend_user_ids: [row.user_id],
                                                index: index,
                                              });
                                            }
                                          }
                                        }}>
                                     <WalletSuspendIcon isSuspend={row.suspend} />
                                   </Box>
                                 </Tooltip>
                                 <Box my={'auto'} hidden={!isLoadingSuspendSwitches.includes(index)} p={0}>
                                   <CustomCircularProgress />
                                 </Box>
                               </HStack>
                             </Center>
                           </TableCell>

                           {checkAccess() &&
                             <TableCell align={'center'} component="th" scope="row">
                               <Center>
                                 <HStack spacing={2}>
                                   {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_AMOUNT)) &&
                                     <SettingsIcon Icon={MoneyBagIcon}
                                                   tooltipTitle={giveText(186)}
                                                   onClick={() => openAddPriceModal(row)} />
                                   }
                                 </HStack>
                               </Center>
                             </TableCell>
                           }
                         </TableRow>
                       </>
                     ))
                   } />

    <DialogRoot lazyMount
                placement={'center'}
                size={'lg'}
                open={isOpenAddPrice}
                onOpenChange={(e) => setIsOpenAddPrice(e.open)}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <IncreaseBalance chargeWalletAxios={chargeWalletAxios}
                             ids={[formField?.user_id]}
                             data={[{
                               wallet_number: formField?.wallet_number?.toString().split('-'),
                               amount: formField?.amount,
                               user_id: formField?.user_id,
                               wallet_id: formField?.wallet_id,
                               name: formField?.name + ' ' + formField?.family,
                             }]} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                placement={'center'}
                size={'lg'}
                open={isOpenAddPriceMultiple}
                onOpenChange={(e) => setIsOpenAddPriceMultiple(e.open)}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <IncreaseBalance ids={ids}
                             chargeWalletAxios={chargeWalletAxios}
                             data={walletsSelected.map((value) => {
                               return {
                                 wallet_number: value?.wallet_number?.toString().split('-'),
                                 amount: value?.amount,
                                 user_id: value?.user_id,
                                 wallet_id: value?.wallet_id,
                                 name: value?.name + ' ' + value?.family,
                               };
                             })} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  </>;
}
