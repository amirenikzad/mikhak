import { memo, useMemo } from 'react';
import { GET_TRANSACTION_ALL_COUNT } from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { BaseNumeric } from './Base/BaseNumeric.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { TransactionIcon } from '../../../../Base/CustomIcons/TransactionIcon.jsx';

export const AllTransactionsCount = memo(function AllTransactionsCount() {
  const accessSlice = useSelector(state => state.accessSlice);
  const refetchInterval = useMemo(() => 5 * 60 * 1000, []);

  const transactionCountAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_TRANSACTION_ALL_COUNT)) {
      const response = await fetchWithAxios.get('/transaction_all/count');
      return response.data.result;
    } else {
      return null;
    }
  };

  const {
    data: transactionAllCount,
    isFetching,
  } = useQuery({
    queryKey: ['transactionAllCount', accessSlice],
    queryFn: transactionCountAxios,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  return (
    <BaseNumeric title={giveText(371)}
                 titleSize={'16px'}
                 count={transactionAllCount}
                 isFetching={isFetching}
                 Icon={<TransactionIcon color={'blue'} width={'2rem'} />} />
  );
});
