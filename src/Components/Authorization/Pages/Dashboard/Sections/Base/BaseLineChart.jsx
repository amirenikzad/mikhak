import { memo, useEffect, useMemo, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { Box } from '@chakra-ui/react';

export const BaseLineChart = memo(function BaseLineChart({
                                                           dataValues = [],
                                                           labelsValues = [],
                                                           bgColors = '#1abcc3',
                                                           datasetLabels = [],
                                                           height,
                                                         }) {
  const chartRef = useRef(null);

  const data = useMemo(() => {
    return {
      labels: labelsValues,
      datasets: [{
        label: datasetLabels,
        data: dataValues,
        backgroundColor: bgColors,
        // barThickness: 60,
        borderRadius: 10,
      }],
    };
  }, [labelsValues, dataValues, bgColors]);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const options = {
      hoverOffset: 4,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          bodyFont: {
            family: 'shabnam',
            size: 14,
            weight: '400',
          },
        },
      },
      scales: {
        x: {
          barPercentage: 0.2,
          categoryPercentage: 0.2,
        },
      },
    };

    const barChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });

    return () => {
      barChart.destroy();
    };
  }, [data]);

  return <>
    <Box minW={'100%'} maxH={height} minH={height}>
      <canvas ref={chartRef} />
    </Box>
  </>;
});
