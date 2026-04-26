import { Box, Center, createListCollection, HStack, Select } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { TableText, User } from '../../../../Base/Extensions.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { GET_ALL_USER } from '../../../../Base/UserAccessNames.jsx';
import { useTableBaseActions } from '../../../../Base/CustomHook/useTableBaseActions.jsx';
import { prouseTableBaseActions } from '../../../../Base/CustomHook/prouseTableBaseActions.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { commaForEvery3Digit } from '../../../../Base/BaseFunction.jsx';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { BaseHeaderPage } from '../../BaseHeaderPage.jsx';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import { ChevronDownOutlineIcon } from '../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import { CircularCheckIcon } from '../../../../Base/CustomIcons/CircularCheckIcon.jsx';
import { CircularCrossIcon } from '../../../../Base/CustomIcons/CircularCrossIcon.jsx';
import { CircularCrossFillIcon } from '../../../../Base/CustomIcons/CircularCrossFillIcon.jsx';
import { giveDir } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';

export default function UsersTransactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const accessSlice = useSelector(state => state.accessSlice);
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    username: searchParams.get('uname') || '',
    id: searchParams.get('uid') || '',
  });
  const [searchedSelectValue, setSearchedSelectValue] = useState(searchParams.get('uname') || '');
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const observer = useRef(null);
  const [selectedOption, setSelectedOption] = useState('');
  const reactQueryItemName = useMemo(() => 'all_users_transactions_list_react_query', []);
  const selectUserController = new AbortController();
  const [totalCountLabel, setTotalCountLabel] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(254) },
      { type: 'text', text: giveText(197) },
    ]));
  }, []);

  const update = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const headCellsValues = useMemo(() => [
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
    { id: 'gateway', label: giveText(198) },
    { id: 'tracking_code', label: giveText(199) },
    { id: 'transaction_price', label: giveText(344) },
    { id: 'transaction_date', label: giveText(201) },
    { id: 'status', label: giveText(202) },
    { id: 'balance', label: giveText(345) },
  ], [totalCountLabel]);

  // const queryParameter = useMemo(() => {
  //   const params = [];

  //   if (selectedOption) {
  //     params.push(`tr_type=${selectedOption}`);
  //   }

  //   if (selectedUser?.id) {
  //     params.push(`user_id=${selectedUser.id}`);
  //   }

  //   // params.push(`page=${currentPage}`);
  //   // params.push(`page_size=${pageSize}`);

  //   return params.length ? `&${params.join('&')}` : '';
  // }, [selectedOption, selectedUser?.id]);

  const queryParameter = useMemo(() => {
    const params = new URLSearchParams();

    if (selectedOption) {
      params.append('tr_type', selectedOption);
    }else{
      params.append('tr_type', '');
    }

    if (selectedUser?.id) {
      params.append('user_id', selectedUser.id);
    }
  
    params.append('page', currentPage);
    params.append('page_size', pageSize);

    const query = params.toString();

    return query ? `&${query}` : '';
  }, [selectedOption, selectedUser?.id, currentPage, pageSize]);

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
    getAllURL: '/transaction_users',
    // queryParameter: `&tr_type=${selectedOption}${selectedUser?.id && `&user_id=${selectedUser?.id}`}`,
    headCellsValues: headCellsValues,
    update: update,
    hasAccessToRemove: false,
    responseKey: 'transactions',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
    loadWhenIsTrue: true,
    useQueryDependsUpdate: null,
    queryParameter,
  });
  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const allUsers = async ({ pageParam = 1 }) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_USER)) {
      try {
        const response = await fetchWithAxios.get(
          `/user/all?page=${pageParam}&page_size=20&search=${searchedSelectValue}`,
          // `/user/all?search=${searchedSelectValue}`,
          {
            signal: selectUserController.signal,
          },
        );

        return {
          users: response.data.users,
          next_page: response.data.next_page,
        };
      } catch (error) {
        throw error;
      }
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage: isFetchingUsers,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['all_users_list', searchedSelectValue],
    queryFn: allUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementUserRef = useCallback((node) => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetching && !isRefetching) {
        fetchNextPage().then(() => null);
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextPage, hasNextPage, isFetching, isLoading, isRefetching]);

  useEffect(() => {
    if (data) {
      setUsersList(data?.pages.flatMap((page) => page?.users));
    }
  }, [data]);

  const saveSelectedUserParams = useCallback(({ uname, uid }) => {
    const params = {};
    if (uname) params.uname = uname;
    if (uid) params.uid = uid;
    setSearchParams(params);
  }, [setSearchParams]);

  const deleteSelectedUserParams = () => {
    if (searchParams.has('uname')) searchParams.delete('uname');
    if (searchParams.has('uid')) searchParams.delete('uid');
    setSearchParams(searchParams);
  };

  // const userSearchSelect = () => (
  //   <Box w={'200px'}>
  //     <FloatingLabelSearchSelectScrollPaginationInput label={giveText(202)}
  //                                                     placeholder={''}
  //                                                     dir={'ltr'}
  //                                                     list={usersList}
  //                                                     lastElementUserRef={lastElementUserRef}
  //                                                     loading={isFetchingUsers}
  //                                                     hasInputLeftElement={true}
  //                                                     InputLeftElementIcon={(
  //                                                           <ChevronDownOutlineIcon width={'1rem'} />
  //                                                         )}
  //                                                     value={searchedSelectValue}
  //                                                     onChange={(event) => {
  //                                                           selectUserController.abort();
  //                                                           setSearchedSelectValue(event.target.value);
  //                                                         }}
  //                                                     onKeyDown={(event) => {
  //                                                           if (event.key === 'Backspace') {
  //                                                             selectUserController.abort();
  //                                                             setSelectedUser({ id: '', username: '' });
  //                                                             setSearchedSelectValue('');
  //                                                             deleteSelectedUserParams();
  //                                                           }
  //                                                         }}
  //                                                     onSelectMethod={(value) => {
  //                                                           selectUserController.abort();
  //                                                           setSelectedUser(value);
  //                                                           setSearchedSelectValue(value.username);
  //                                                           saveSelectedUserParams({
  //                                                             uname: value.username,
  //                                                             uid: value.id,
  //                                                           });
  //                                                         }} />
  //   </Box>
  // );
  const userSearchSelect = () => (
    <Box w="200px">
      <FloatingLabelSearchSelectScrollPaginationInput
        label={giveText(0)}
        placeholder=""
        dir="ltr"
        list={usersList}
        picKey={''}
        lastElementUserRef={lastElementUserRef}
        loading={isFetchingUsers}
        hasInputLeftElement
        hasInputRightElement
        InputLeftElementIcon={<ChevronDownOutlineIcon width="1rem" />}
        // InputRightElement={
        //   <HStack mx={2}>
        //     {searchedSelectValue && (
        //       <Box
        //         cursor="pointer"
        //         onMouseDown={(e) => {
        //           e.preventDefault();
        //           selectUserController.abort();
        //           setSelectedUser({ id: '', username: '' });
        //           setSearchedSelectValue('');
        //           deleteSelectedUserParams();
        //         }}
        //       >
        //         <CircularCrossFillIcon color="red" width="1rem" />
        //       </Box>
        //     )}
        //   </HStack>
        // }
        value={searchedSelectValue}
        onChange={(event) => {
          selectUserController.abort();
          setSearchedSelectValue(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Backspace') {
            selectUserController.abort();
            setSelectedUser({ id: '', username: '' });
            setSearchedSelectValue('');
            deleteSelectedUserParams();
          }
        }}
        onSelectMethod={(value) => {
          selectUserController.abort();
          setSelectedUser(value);
          setSearchedSelectValue(value.username);
          saveSelectedUserParams({
            uname: value.username,
            uid: value.id,
          });
        }}

        onClear={() => {
                        selectUserController.abort();         
                        setSearchedSelectValue('');            
                        setSelectedUser({ id: '', username: '' }); 
                        deleteSelectedUserParams();
                      }}
      />
    </Box>
  );


  const sortedListValue = useMemo(() => {
    return stableSort(listValue, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, listValue]);

  const options = createListCollection({
    items: [
      { label: giveText(342), value: '' },
      { label: giveText(340), value: 'positive' },
      { label: giveText(341), value: 'negative' },
    ],
  });

  const memorizedTableRow = (row, index) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
      <TableCell align={'center'} component="th" scope="row">
        <User userInfo={{
          username: row.user_username,
          profile_pic: row.user_profile_pic,
          email: row.user_email,
        }} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'} text={row.gateway} maxLength={20} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'} text={row.tracking_code} maxLength={20} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'}
                   text={`${commaForEvery3Digit(row?.transaction_price)} ${giveText(213)}`}
                   color={row.transaction_price > 0 ? 'green' : 'red'}
                   maxLength={20} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'} text={row.transaction_date} maxLength={20} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <Center>
          {row.status
            ? <CircularCheckIcon width={'1.3rem'} color={'green'} />
            : <CircularCrossIcon width={'1.3rem'} color={'red'} />
          }
        </Center>
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'}
                   text={`${commaForEvery3Digit(row?.amount)} ` + giveText(213)}
                   maxLength={30} />
      </TableCell>
    </TableRow>
  );

  // const SelectTransactionType = memo(function SelectTransactionType() {
  //   return (
  //     <Select.Root width={'6rem'}
  //                  size={'sm'}
  //                  collection={options}
  //                  defaultValue={[selectedOption]}
  //                  onChange={(e) => {
  //                    setSelectedOption(e.target.value);
  //                  }}>
  //       <Select.HiddenSelect />
  //       <Select.Control>
  //         <Select.Trigger px={1} dir={'ltr'}>
  //           <Select.ValueText placeholder="Select Option" />
  //         </Select.Trigger>
  //         <Select.IndicatorGroup px={1}>
  //           <Select.Indicator />
  //         </Select.IndicatorGroup>
  //       </Select.Control>
  //       <Select.Positioner>
  //         <Select.Content>
  //           {options.items.map((option) => (
  //             <Select.Item px={1} borderRadius={0} item={option} key={option.value} cursor={'pointer'}>
  //               {option.label}
  //               <Select.ItemIndicator />
  //             </Select.Item>
  //           ))}
  //         </Select.Content>
  //       </Select.Positioner>
  //     </Select.Root>
  //   );
  // });
  const SelectTransactionType = memo(function SelectTransactionType() {
    return (
      <Box position="relative">
        <Select.Root
          width="6rem"
          size="sm"
          collection={options}
          defaultValue={[selectedOption]}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger px={1} dir={giveDir() === 'rtl' ? 'rtl' : 'ltr'}>
              <Select.ValueText placeholder="Select Option" />
            </Select.Trigger>
            <Select.IndicatorGroup px={1}>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {options.items.map((option) => (
                <Select.Item
                  px={1}
                  borderRadius={0}
                  item={option}
                  key={option.value}
                  cursor="pointer"

                >
                  {option.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>

        {selectedOption && (
          <Box
            position="absolute"
            top="50%"
            // right="3.5rem"
            right={giveDir() === 'rtl' ? '3.5rem' : '1.5rem'}
            transform="translateY(-50%)"
            cursor="pointer"
            onMouseDown={(e) => {
              e.preventDefault();
              setSelectedOption('');
            }}
          >
            <CircularCrossFillIcon color="red" width="1rem" />
          </Box>
        )}
      </Box>
    );
  });

  
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
                    {giveText(197)}
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
                    description={giveText(203)}
                    searchValue={searchValue}
                    extension={(
                      <HStack>
                        {userSearchSelect()}
                        <SelectTransactionType />
                      </HStack>
                    )}
                    setSearchValue={setSearchValue}
                    controller={controller} />

    <BaseTablePage isLoadingListAllUsers={isFetching}
                   headCells={headCells}
                   order={order}
                   orderBy={orderBy}
                   setOrderBy={setOrderBy}
                   setOrder={setOrder}
                   lastElementRef={lastElementRef}

                   currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={onNextPage}
                    onPreviousPage={onPreviousPage}
                    showPageNavigator={true}
                    hasPagination={false}
                   body={sortedListValue?.map((row, index) => (
                     memorizedTableRow(row, index)
                   ))} />
  </>;
}
