import { memo, useMemo } from 'react';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { GET_ADMIN_USERS } from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { BaseDoughnutChart } from './Base/BaseDoughnutChart.jsx';

export const AdminUsers = memo(function AdminUsers() {
  const accessSlice = useSelector(state => state.accessSlice);
  const refetchInterval = useMemo(() => 5 * 60 * 1000, []);

  const adminUsersAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ADMIN_USERS)) {
      const response = await fetchWithAxios.get('/admin_users/count');
      return response.data.result;
    } else {
      return null;
    }
  };

  const {
    data: adminUsersData,
    isFetching,
  } = useQuery({
    queryKey: ['adminUsers', accessSlice],
    queryFn: adminUsersAxios,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  return (
    <BaseDoughnutChart labelsValues={[giveText(3), giveText(364)]}
                       count={adminUsersData?.admin_users}
                       total={adminUsersData?.total_users}
                       isFetching={isFetching}
                       bgColors={['#1abcc3', '#e60808']}
                       dataValues={[adminUsersData?.admin_users, adminUsersData?.total_users - adminUsersData?.admin_users]}
                       title={giveText(362)} />
  );
});
