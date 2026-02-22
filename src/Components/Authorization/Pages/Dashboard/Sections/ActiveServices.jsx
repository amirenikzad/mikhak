import { memo, useMemo } from 'react';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { GET_ACTIVE_SERVICE_COUNT } from '../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { BaseDoughnutChart } from './Base/BaseDoughnutChart.jsx';

export const ActiveServices = memo(function ActiveServices() {
  const accessSlice = useSelector(state => state.accessSlice);
  const refetchInterval = useMemo(() => 5 * 60 * 1000, []);

  const activeServicesAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ACTIVE_SERVICE_COUNT)) {
      const response = await fetchWithAxios.get('/active_service/count');
      return response.data;
    } else {
      return null;
    }
  };

  const {
    data: activeServicesData,
    isFetching,
  } = useQuery({
    queryKey: ['activeServices', accessSlice],
    queryFn: activeServicesAxios,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  return (
    <BaseDoughnutChart labelsValues={[giveText(20), giveText(160)]}
                       count={activeServicesData?.active_services}
                       total={activeServicesData?.total_services}
                       isFetching={isFetching}
                       bgColors={['#1abcc3', '#e60808']}
                       dataValues={[activeServicesData?.active_services, activeServicesData?.total_services - activeServicesData?.active_services]}
                       title={giveText(370)} />
  );
});
