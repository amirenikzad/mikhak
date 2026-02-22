import { memo, useMemo } from 'react';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { GET_COUNT_ACTIVE_ORGANIZATIONS } from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { BaseDoughnutChart } from './Base/BaseDoughnutChart.jsx';

export const ActiveOrganizations = memo(function ActiveOrganizations() {
  const accessSlice = useSelector(state => state.accessSlice);
  const refetchInterval = useMemo(() => 5 * 60 * 1000, []);

  const activeOrganizationsAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_COUNT_ACTIVE_ORGANIZATIONS)) {
      const response = await fetchWithAxios.get('/count_active_organizations');
      return response.data.result;
    } else {
      return null;
    }
  };

  const {
    data: activeOrganizationsData,
    isFetching,
  } = useQuery({
    queryKey: ['activeOrganizations', accessSlice],
    queryFn: activeOrganizationsAxios,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  return (
    <BaseDoughnutChart labelsValues={[giveText(20), giveText(160)]}
                       count={activeOrganizationsData?.active_organizations}
                       total={activeOrganizationsData?.organizations}
                       isFetching={isFetching}
                       bgColors={['#1abcc3', '#e60808']}
                       dataValues={[activeOrganizationsData?.active_organizations, activeOrganizationsData?.organizations - activeOrganizationsData?.active_organizations]}
                       title={giveText(363)} />
  );
});
