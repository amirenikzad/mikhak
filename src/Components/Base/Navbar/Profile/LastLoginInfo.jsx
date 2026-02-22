import { useCallback, useMemo, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTableBaseActions } from '../../CustomHook/useTableBaseActions.jsx';
import { giveText } from '../../MultiLanguages/HandleLanguage.jsx';
import { BaseTablePage } from '../../../Authorization/Pages/BaseTablePage.jsx';
import { TableText } from '../../Extensions.jsx';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Text, Stack, Box } from '@chakra-ui/react';

export default function LastLoginInfo() {
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'last_login_info_react_query', []);
  const [totalCountLabel, setTotalCountLabel] = useState(0);
  const update = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);
  const formatCount = (count) => {
    if (count > 99900) return '99k+';
    if (count >= 1000) return Math.round(count / 1000) + 'k';
    return count;
  };
  const headCellsValues = useMemo(() => [
    {
      id: 'username',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(0)}
          <Box 
            minW="31px"
            h="30px"
            bg="blue.500"
            color="white"
            borderRadius="50%"
            fontSize="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {formatCount(totalCountLabel)}
          </Box>
          
        </Box>
      )
    },// { id: 'ip', label: giveText(176) },
      { id: 'platform', label: giveText(430) },
      { id: 'country', label: giveText(398) },
      { id: 'os', label: giveText(394) },
      { id: 'time', label: giveText(399) },
      { id: 'browser', label: giveText(400) },
  ], [totalCountLabel]);

  const {
    listValue,
    totalCount,
    error,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    lastElementRef,
  } = useTableBaseActions({
    getAllURL: '/login_history',
    headCellsValues,
    update: update,
    hasAccessToRemove: false,
    responseKey: 'res',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
    loadWhenIsTrue: true,
    useQueryDependsUpdate: null,
  });

  useEffect(() => {
      setTotalCountLabel(totalCount ?? 0);
    }, [totalCount]);

  const LastLoginInfoContent = ({ row }) => (
    <TableRow hover tabIndex={-1}>
      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'} text={row.ip} maxLength={20} />
      </TableCell>

      <TableCell align="center">
        <TableText cursor="default" text={row.platform || '-'} maxLength={20} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'} text={row.country} maxLength={10} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'} text={row.os} maxLength={10} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'} text={row.time} maxLength={40} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'} text={row.browser} maxLength={40} />
      </TableCell>
    </TableRow>
  );

  return <>
    <Box pt={4} px={5}>
      <Stack>
        <Text fontSize={'19px'} fontWeight={'bold'}>{giveText(401)}</Text>
        <Text fontSize={'14px'}>{giveText(402)}</Text>
      </Stack>
    </Box>

    <BaseTablePage isLoadingListAllUsers={isFetching}
                   headCells={headCells}
                   order={order}
                   errorGetAllUsers={error}
                   orderBy={orderBy}
                   setOrderBy={setOrderBy}
                   setOrder={setOrder}
                   lastElementRef={lastElementRef}
                   hasPagination={true}
                   hasAddButton={false}
                   searchValue={searchValue}
                   setSearchValue={setSearchValue}
                   px={0}
                   tableSX={{ 'td, th': { borderBottomWidth: 0 } }}
                   body={
                     stableSort(listValue, getComparator(order, orderBy)).map((row, index) => (
                       <LastLoginInfoContent row={row} key={index} />
                     ))
                   } />
  </>;
}
