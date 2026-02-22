import { memo, useMemo } from 'react';
import { GET_SUM_USER_WALLETS } from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { BaseNumeric } from './Base/BaseNumeric.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { WalletIcon } from '../../../../Base/CustomIcons/WalletIcon.jsx';

export const SumOfUsersWallet = memo(function SumOfUsersWallet() {
  const accessSlice = useSelector(state => state.accessSlice);
  const refetchInterval = useMemo(() => 5 * 60 * 1000, []);

  const sumUsersWalletsAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_SUM_USER_WALLETS)) {
      const response = await fetchWithAxios.get('/sum_user_wallets');
      return response.data.result;
    } else {
      return null;
    }
  };

  const {
    data: countSumUsersWallets,
    isFetching,
  } = useQuery({
    queryKey: ['countSumUsersWallets', accessSlice],
    queryFn: sumUsersWalletsAxios,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  return (
    <BaseNumeric title={`${giveText(369)} (${giveText(213)})`}
                 titleSize={'14px'}
                 countSize={'28px'}
                 count={countSumUsersWallets}
                 isFetching={isFetching}
                 commaSeparate={true}
                 Icon={<WalletIcon color={'green'} width={'2rem'} />} />
  );
});
