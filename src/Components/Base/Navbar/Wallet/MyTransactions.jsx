import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTableBaseActions } from '../../CustomHook/useTableBaseActions.jsx';
import { giveDir, giveText } from '../../MultiLanguages/HandleLanguage.jsx';
import { BaseTablePage } from '../../../Authorization/Pages/BaseTablePage.jsx';
import { TableText, User } from '../../Extensions.jsx';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { commaForEvery3Digit } from '../../BaseFunction.jsx';
import { Text, Grid, Stack, HStack, Center, Select, GridItem, createListCollection } from '@chakra-ui/react';
import { CircularCheckFillIcon } from '../../CustomIcons/CircularCheckFillIcon.jsx';
import { CircularCrossFillIcon } from '../../CustomIcons/CircularCrossFillIcon.jsx';

export default function MyTransactions() {
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState('');
  const reactQueryItemName = useMemo(() => 'all_my_transactions_list_react_query', []);

  const update = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const {
    listValue,
    error,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    lastElementRef,
  } = useTableBaseActions({
    getAllURL: '/transaction',
    queryParameter: `&tr_type=${selectedOption}`,
    headCellsValues: [
      { id: 'user', label: giveText(0) },
      { id: 'gateway', label: giveText(198) },
      { id: 'tracking_code', label: giveText(199) },
      { id: 'transaction_price', label: giveText(344) },
      { id: 'transaction_date', label: giveText(201) },
      { id: 'status', label: giveText(202) },
      { id: 'balance', label: giveText(345) },
    ],
    update: update,
    hasAccessToRemove: false,
    responseKey: 'transactions',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
    loadWhenIsTrue: true,
    useQueryDependsUpdate: null,
  });

  const options = createListCollection({
    items: [
      { label: giveText(342), value: '' },
      { label: giveText(340), value: 'positive' },
      { label: giveText(341), value: 'negative' },
    ],
  });

  const TransactionContent = ({ row }) => (
    <TableRow hover role="checkbox" tabIndex={-1}>
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
            ? <CircularCheckFillIcon width={'1.4rem'} color={'green'} />
            : <CircularCrossFillIcon width={'1.4rem'} color={'red'} />
          }
        </Center>
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'}
                   text={`${commaForEvery3Digit(row?.amount)} ${giveText(213)}`}
                   maxLength={30} />
      </TableCell>
    </TableRow>
  );

  return <>
    <Grid templateColumns="repeat(2, 1fr)" gap={4} px={4}>
      <GridItem colSpan={1}>
        <Stack>
          <Text fontSize={'19px'} fontWeight={'bold'}>{giveText(206)}</Text>
          <Text fontSize={'14px'}>{giveText(203)}</Text>
        </Stack>
      </GridItem>

      <GridItem colSpan={1} dir={giveDir(true)}>
        <HStack>
          <Select.Root width={'10rem'}
                       size={'sm'}
                       collection={options}
                       defaultValue={[selectedOption]}
                       onChange={(e) => {
                         setSelectedOption(e.target.value);
                       }}>
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger px={1}>
                <Select.ValueText placeholder="Select Option" />
              </Select.Trigger>
              <Select.IndicatorGroup px={1}>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {options.items.map((framework) => (
                  <Select.Item px={1} borderRadius={0} item={framework} key={framework.value} cursor={'pointer'}>
                    {framework.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>

          <Text dir={giveDir()} fontSize={'14px'} my={'auto'}>{giveText(343)}: </Text>
        </HStack>
      </GridItem>
    </Grid>

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
                       <TransactionContent row={row} key={index} />
                     ))
                   } 
                   />
  </>;
}
