import { memo, useMemo } from 'react';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { GET_ACTIVE_USERS } from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { BaseDoughnutChart } from './Base/BaseDoughnutChart.jsx';

export const ActiveUsers = memo(function ActiveUsers() {
  const accessSlice = useSelector(state => state.accessSlice);
  const refetchInterval = useMemo(() => 5 * 60 * 1000, []);

  const activeUsersAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ACTIVE_USERS)) {
      const response = await fetchWithAxios.get('/active_users');
      return response.data.result;
    } else {
      return null;
    }
  };

  const {
    data: activeUsersData,
    isFetching,
  } = useQuery({
    queryKey: ['activeUsers', accessSlice],
    queryFn: activeUsersAxios,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  return (
    <BaseDoughnutChart labelsValues={[giveText(20), giveText(160)]}
                       count={activeUsersData?.active_users}
                       total={activeUsersData?.total_users}
                       bgColors={['#1abcc3', '#e60808']}
                       isFetching={isFetching}
                       dataValues={[activeUsersData?.active_users, activeUsersData?.total_users - activeUsersData?.active_users]}
                       title={giveText(361)} />
  );
});
