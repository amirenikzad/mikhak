import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { PUT_AMOUNT, PUT_SUSPEND } from '../../../../Base/UserAccessNames.jsx';
import { CheckBoxName } from '../../../../Base/TableAttributes.jsx';
import { useCheckboxTable } from '../../../../Base/CustomHook/useCheckboxTable.jsx';
import { useTableBaseActions } from '../../../../Base/CustomHook/useTableBaseActions.jsx';
import { prouseTableBaseActions } from '../../../../Base/CustomHook/prouseTableBaseActions.jsx';
import {
  showToast,
  promiseToast,
  numberToLetterMethods,
  updatePromiseToastError,
  checkStatus,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../Base/BaseFunction.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import qs from 'qs';
import { useQueryClient } from '@tanstack/react-query';
import { DialogBody, DialogContent, DialogRoot } from '../../../../ui/dialog.jsx';
import { BaseHeaderPage } from '../../BaseHeaderPage.jsx';
import { ActionBarTables } from '../../../../Base/ActionBar/ActionBarTables.jsx';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import UserWalletTable from './UserWalletTable.jsx';
import { useSearchParams } from 'react-router';
import { Box } from '@chakra-ui/react';

const IncreaseBalance = lazy(() => import('../../../../Base/Navbar/Wallet/IncreaseBalance'));

export default function UserWallet() {
  const [isLoadingSuspendSwitches, setIsLoadingSuspendSwitches] = useState([]);
  const accessSlice = useSelector(state => state.accessSlice);
  const [formField, setFormField] = useState({});
  const [walletsSelected, setWalletsSelected] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isOpenAddPrice, setIsOpenAddPrice] = useState(false);
  const [isOpenAddPriceMultiple, setIsOpenAddPriceMultiple] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_users_wallet_list_react_query', []);
  const [totalCountLabel, setTotalCountLabel] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  }, [searchValue]);

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(254) },
      { type: 'text', text: giveText(192) },
    ]));
  }, []);

  const checkAccess = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_AMOUNT);
  }, [accessSlice.isAdmin, accessSlice.userAccess]);

  const updated = () => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  };

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
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_AMOUNT)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (numberToLetterMethods(value)) {
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

  const headCellsValues = useMemo(() => [
    CheckBoxName,
    {
      id: 'user',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(0)}
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
    // { id: 'user', label: giveText(0) },
    { id: 'wallet_number', label: giveText(193) },
    { id: 'balance', label: giveText(187) },
    { id: 'suspend', label: giveText(194) },
  ], [totalCountLabel]);

  const queryParameter = useMemo(() => {
    return `&page=${currentPage}&page_size=${pageSize}`;
  }, [currentPage, pageSize]);

  const {
    listValue,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    lastElementRef,
    controller,
  } = useTableBaseActions({
    getAllURL: '/users_wallet/all',
    checkAccess: checkAccess,
    headCellsValues: headCellsValues,
    update: updated,
    hasAccessToRemove: false,
    responseKey: 'users_wallet',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
    useQueryDependsUpdate: null,
    queryParameter,

  });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_AMOUNT) || accessSlice.userAccess?.includes(PUT_SUSPEND);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
  } = useCheckboxTable({
    listValue,
    listId: 'user_id',
    hasAccessCheckbox,
  });

  useEffect(() => {
    let temp = [];

    listValue && listValue.map((value) => {
      if (ids.has(value['user_id'])) {
        temp.push(value);
      }
    });

    setWalletsSelected(temp);
  }, [ids, listValue]);

  const sortedListValue = useMemo(() => {
    return stableSort(listValue, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, listValue]);

  const onOpenAddPrice = useCallback((e) => setIsOpenAddPrice(e.open), []);
  const onOpenAddPriceMultiple = useCallback((e) => setIsOpenAddPriceMultiple(e.open), []);
  
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

  return <>
    <BaseHeaderPage hasAddButton={false}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(192)}
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
                    description={giveText(204)}
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

                   currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={onNextPage}
                    onPreviousPage={onPreviousPage}
                    showPageNavigator={true}
                    hasPagination={false}

                   body={sortedListValue?.map((row, index) => (
                     <UserWalletTable key={row?.user_id}
                                      ids={ids}
                                      onChangeCheckbox={onChangeCheckbox}
                                      index={index}
                                      setFormField={setFormField}
                                      row={row}
                                      checkAccess={checkAccess}
                                      isLoadingSuspendSwitches={isLoadingSuspendSwitches}
                                      hasAccessCheckbox={hasAccessCheckbox}
                                      suspendAxios={suspendAxios}
                                      setIsLoadingSuspendSwitches={setIsLoadingSuspendSwitches}
                                      setIsOpenAddPrice={setIsOpenAddPrice} />
                   ))} />

    <DialogRoot lazyMount placement={'center'} size={'sm'} open={isOpenAddPrice} onOpenChange={onOpenAddPrice}>
      <DialogContent>
        <DialogBody py={3} px={5}>
          <Suspense fallback={'loading...'}>
            <IncreaseBalance ids={[formField?.user_id]}
                             chargeWalletAxios={chargeWalletAxios}
                             data={[{
                               wallet_number: formField?.wallet_number?.toString().split('-'),
                               amount: formField?.amount,
                               user_id: formField?.user_id,
                               wallet_id: formField?.wallet_id,
                               name: formField?.name + ' ' + formField?.family,
                             }]}
                             onCloseModal={() => setIsOpenAddPrice(false)}
                              />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                placement={'center'}
                size={'sm'}
                open={isOpenAddPriceMultiple}
                onOpenChange={onOpenAddPriceMultiple}>
      <DialogContent>
        <DialogBody py={3} px={5}>
          <Suspense fallback={'loading...'}>
            {/* <IncreaseBalance ids={ids}
                             chargeWalletAxios={chargeWalletAxios}
                             data={walletsSelected.map((value) => {
                               return {
                                 wallet_number: value?.wallet_number?.toString().split('-'),
                                 amount: value?.amount,
                                 user_id: value?.user_id,
                                 wallet_id: value?.wallet_id,
                                 name: value?.name + ' ' + value?.family,
                               };
                             })} /> */}
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <ActionBarTables selectedCount={ids.size}
                     buttons={[{
                       title: giveText(194),
                       color: ['white', 'black'],
                       backgroundColor: ['red.600', 'red.200'],
                       hoverBackgroundColor: ['red.800', 'red.300'],
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SUSPEND)),
                       onClickFunc: () => suspendAxios({ suspend_user_ids: ids, status: true }),
                     }, {
                       title: giveText(195),
                       color: ['white', 'black'],
                       backgroundColor: ['green.600', 'green.200'],
                       hoverBackgroundColor: ['green.800', 'green.300'],
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SUSPEND)),
                       onClickFunc: () => suspendAxios({ suspend_user_ids: ids, status: false }),
                     }, {
                       title: giveText(186),
                       color: ['white', 'black'],
                       backgroundColor: ['cyan.600', 'cyan.200'],
                       hoverBackgroundColor: ['cyan.800', 'cyan.300'],
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_AMOUNT)),
                       onClickFunc: () => {
                         setFormField({});
                         setIsOpenAddPriceMultiple(true);
                       },
                     }]} />
  </>;
}
