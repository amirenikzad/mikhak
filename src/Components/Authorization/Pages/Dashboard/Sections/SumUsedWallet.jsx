import { memo, useMemo } from 'react';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { GET_SUM_USED_WALLET } from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { BaseNumeric } from './Base/BaseNumeric.jsx';
import { WalletIcon } from '../../../../Base/CustomIcons/WalletIcon.jsx';

export const SumUsedWallet = memo(function MicroserviceCount() {
  const accessSlice = useSelector(state => state.accessSlice);
  const refetchInterval = useMemo(() => 5 * 60 * 1000, []);

  const sumUsedWalletAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_SUM_USED_WALLET)) {
      const response = await fetchWithAxios.get('/sum_used_wallets');
      return response.data.result;
    } else {
      return null;
    }
  };

  const {
    data: countMicroservice,
    isFetching,
  } = useQuery({
    queryKey: ['sumUsedWallet', accessSlice],
    queryFn: sumUsedWalletAxios,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  return (
    <BaseNumeric title={`${giveText(396)} (${giveText(213)})`}
                 titleSize={'14px'}
                 countSize={'28px'}
                 count={countMicroservice}
                 isFetching={isFetching}
                 commaSeparate={true}
                 Icon={<WalletIcon color={'orange.500'} width={'2rem'} />} />
  );
});
