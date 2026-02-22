import { memo, useMemo } from 'react';
import { Text, Center, Spinner, Box, Stack } from '@chakra-ui/react';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { useSelector } from 'react-redux';
import { GET_HARDWARE_COUNT } from '../../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { ClusterCarousel } from './ClusterCarousel.jsx';
import { motion } from 'motion/react';
import { ClusterTable } from './ClusterTable.jsx';

export const Cluster = memo(function Cluster({ height }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const refetchInterval = useMemo(() => 5 * 60 * 1000, []);

  const clusterAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_HARDWARE_COUNT)) {
      const response = await fetchWithAxios.get('/hardware/count');
      return response.data.clusters;
    } else {
      return null;
    }
  };

  const {
    data: clusterData,
    isFetching,
  } = useQuery({
    queryKey: ['cluster', accessSlice],
    queryFn: clusterAxios,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  return (
    <Stack gap={2}>
      {isFetching ? (
        <Box borderWidth={1} gap={3} pt={3} pb={8} boxShadow={'lg'} borderRadius={8} minH={height}>
          <Center h={'60.5dvh'} my={'auto'}>
            <Spinner size={'lg'} color={'green'} borderWidth={'4px'} />
          </Center>
        </Box>
      ) : (
        <Stack gap={2} pb={8} minH={height}>
          <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.008 }}>
            <Box borderWidth={1} boxShadow={'lg'} borderRadius={8} height={height * 2 / 10} px={2} py={2}>
              <ClusterTable clusterData={clusterData} />
            </Box>
          </motion.div>

          <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.008 }}>
            <Box borderWidth={1} boxShadow={'lg'} borderRadius={8} height={height * 8 / 10} py={2}>
              <Text px={4} mb={3} fontSize={'18px'} fontWeight={'500'} cursor={'default'}>{giveText(373)}</Text>
              <Box px={8} pb={6}>
                <ClusterCarousel clusterData={clusterData} />
              </Box>
            </Box>
          </motion.div>
        </Stack>
      )}
    </Stack>
  );
});
