import { memo, useMemo } from 'react';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { GET_SUM_CHARGED_WALLET } from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { BaseNumeric } from './Base/BaseNumeric.jsx';
import { WalletIcon } from '../../../../Base/CustomIcons/WalletIcon.jsx';

export const SumChargedWallet = memo(function SumChargedWallet() {
  const accessSlice = useSelector(state => state.accessSlice);
  const refetchInterval = useMemo(() => 5 * 60 * 1000, []);

  const countComponentAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_SUM_CHARGED_WALLET)) {
      const response = await fetchWithAxios.get('/sum_charged_wallets');
      return response.data.result;
    } else {
      return null;
    }
  };

  const {
    data: countSumChargedWallet,
    isFetching,
  } = useQuery({
    queryKey: ['sumChargedWallet', accessSlice],
    queryFn: countComponentAxios,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  return (
    <BaseNumeric title={`${giveText(397)} (${giveText(213)})`}
                 titleSize={'14px'}
                 countSize={'28px'}
                 count={countSumChargedWallet}
                 isFetching={isFetching}
                 commaSeparate={true}
                 Icon={<WalletIcon color={'cyan.500'} width={'2rem'} />} />
  );
});
