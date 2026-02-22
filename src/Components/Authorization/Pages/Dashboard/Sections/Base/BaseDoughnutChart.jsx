import { memo, useEffect, useMemo, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { Box, Center, Flex, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { giveDir } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { Tooltip } from '../../../../../ui/tooltip.jsx';
import { InfoOutlineIcon } from '../../../../../Base/CustomIcons/InfoOutlineIcon.jsx';

export const BaseDoughnutChart = memo(function BaseDoughnutChart({
                                                                   dataValues = [],
                                                                   count = 0,
                                                                   total = 0,
                                                                   labelsValues = ['ادمین', 'غیرادمین'],
                                                                   bgColors = ['#1abcc3', '#e60808'],
                                                                   title = '',
                                                                   isFetching = false,
                                                                 }) {
  const chartRef = useRef(null);

  const data = useMemo(() => {
    return {
      labels: labelsValues,
      datasets: [{
        label: 'تعداد',
        data: dataValues,
        backgroundColor: bgColors,
        borderWidth: 0,
      }],
    };
  }, [labelsValues, dataValues, bgColors]);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const options = {
      hoverOffset: 4,
      cutout: 35,
      layout: {
        padding: 5,
      },
      plugins: {
        title: {
          display: false,
        },
        legend: {
          display: false,
        },
        tooltip: {
          bodyFont: {
            family: 'shabnam',
            size: 14,
            weight: '400',
          },
        },
      },
    };

    const barChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
    });

    return () => {
      barChart.destroy();
    };
  }, [data]);

  return (
    <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.01 }}>
      <VStack position={'relative'} px={'30px'} borderWidth={1} gap={3} py={3} borderRadius={8} h={'170px'} boxShadow={'lg'}>
        <Box position={'absolute'} top={2} left={2}>
          <Tooltip showArrow
                   content={(
                     <Stack px={2} py={1}>
                       {labelsValues.map((item, i) => (
                         <Flex>
                           <Box mr={giveDir() === 'rtl' ? null : 2} ml={giveDir() === 'ltr' ? null : 2} w={'15px'}
                                y={'15px'} borderRadius={5}
                                bgColor={bgColors[i]} />
                           <Text fontSize={'16px'} cursor={'default'} my={'auto'}>{item}</Text>
                         </Flex>
                       ))}
                     </Stack>
                   )}
                   color={'white'}
                   fontWeight={'bold'}>
            <InfoOutlineIcon width={'1.5rem'} color={'gray'} />
          </Tooltip>
        </Box>

        <Box width={'100px'} height={'100px'} position={'relative'}>
          <canvas ref={chartRef} />

          <Center>
            {isFetching ? (
              <Spinner size={'lg'} color={'green'} position={'absolute'} top={'35px'} borderWidth={'4px'} />
            ) : (
              <Text position={'absolute'} top={'40px'} fontWeight={'800'} cursor={'default'}>
                {count > 9999 ? '+9999' : count}{total && `/${total > 9999 ? '+9999' : total}`}
              </Text>
            )}

          </Center>
        </Box>

        <Text fontSize={'18px'} fontWeight={'500'} cursor={'default'}>{title}</Text>
      </VStack>
    </motion.div>
  );
});
