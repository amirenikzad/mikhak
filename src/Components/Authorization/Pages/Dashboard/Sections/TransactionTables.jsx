import { memo, useMemo, useState } from 'react';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { commaForEvery3Digit } from '../../../../Base/BaseFunction.jsx';
import { Text, Center, Box } from '@chakra-ui/react';
import { useTableBaseActions } from '../../../../Base/CustomHook/useTableBaseActions.jsx';
import { prouseTableBaseActions } from '../../../../Base/CustomHook/prouseTableBaseActions.jsx';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { TableText, User } from '../../../../Base/Extensions.jsx';
import { CircularCheckIcon } from '../../../../Base/CustomIcons/CircularCheckIcon.jsx';
import { CircularCrossIcon } from '../../../../Base/CustomIcons/CircularCrossIcon.jsx';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

export const TransactionTables = memo(function TransactionTables({ height }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const {
    listValue: transactionLineData,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    lastElementRef,
  } = useTableBaseActions({
    getAllURL: '/transaction_users',
    queryParameter: `&tr_type=`,
    headCellsValues: [
      { id: 'user', label: giveText(0) },
      { id: 'transaction_price', label: giveText(344) },
      { id: 'transaction_date', label: giveText(201) },
      { id: 'status', label: giveText(202) },
      { id: 'balance', label: giveText(345) },
    ],
    hasAccessToRemove: false,
    searchValue: '',
    responseKey: 'transactions',
    hasSearch: true,
    loadWhenIsTrue: true,
    useQueryDependsUpdate: null,
    requestEveryMinute: 1,
  });

  const sortedListValue = useMemo(() => {
    return stableSort(transactionLineData, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, transactionLineData]);

  const memorizedTableRow = useMemo(() => {
    return (
      sortedListValue?.map((row, index) => (
        <>
          <TableRow hover role="checkbox" tabIndex={-1} key={index}>
            <TableCell align={'center'} component="th" scope="row">
              <User gap={0}
                    userInfo={{
                      username: row?.user_username,
                      profile_pic: row?.user_profile_pic,
                    }} />
            </TableCell>

            <TableCell align={'center'} component="th" scope="row">
              <TableText cursor={'default'}
                         text={`${commaForEvery3Digit(row?.transaction_price)} ${giveText(213)}`}
                         color={row?.transaction_price > 0 ? 'green' : 'red'}
                         maxLength={20} />
            </TableCell>

            <TableCell align={'center'} component="th" scope="row">
              <TableText cursor={'default'} text={row?.transaction_date} maxLength={20} />
            </TableCell>

            <TableCell align={'center'} component="th" scope="row">
              <Center>
                {row?.status
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
        </>
      ))
    );
  }, [sortedListValue]);

  return <>
    <Box borderWidth={1} gap={3} pt={3} boxShadow={'lg'} borderRadius={8}>
      <Text px={4} fontSize={'18px'} fontWeight={'500'} cursor={'default'}>{giveText(197)}</Text>

      <BaseTablePage px={4}
                     isLoadingListAllUsers={isFetching}
                     heightResponsive={[height, height, height, height, height, height, height]}
                     headCells={headCells}
                     order={order}
                     orderBy={orderBy}
                     setOrderBy={setOrderBy}
                     setOrder={setOrder}
                     lastElementRef={lastElementRef}
                     body={memorizedTableRow} />
    </Box>
  </>;
});
