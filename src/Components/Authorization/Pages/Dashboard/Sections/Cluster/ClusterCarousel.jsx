import { memo, useMemo } from 'react';
import { Box, Stack, Text, Progress, HStack } from '@chakra-ui/react';
import { Tag } from '../../../../../ui/tag.jsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { ChevronRightCircularIcon } from '../../../../../Base/CustomIcons/ChevronRightCircularIcon.jsx';
import { ChevronLeftCircularIcon } from '../../../../../Base/CustomIcons/ChevronLeftCircularIcon.jsx';

export const ClusterCarousel = memo(function ClusterCarousel({ clusterData }) {

  const SampleNextArrow = memo(function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <Box position={'absolute'}
           top={'50%'}
           cursor={'pointer'}
           display={'block'}
           right={'-25px'}
           transform={'translate(0, -50%)'}
           lineHeight={0}
           onClick={onClick}>
        <ChevronRightCircularIcon width={'1.35rem'} />
      </Box>
    );
  });

  const SamplePrevArrow = memo(function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
      <Box position={'absolute'}
           top={'50%'}
           cursor={'pointer'}
           display={'block'}
           left={'-25px'}
           transform={'translate(0, -50%)'}
           lineHeight={0}
           onClick={onClick}>
        <ChevronLeftCircularIcon width={'1.35rem'} />
      </Box>
    );
  });

  const settings = useMemo(() => {
    return {
      dots: true,
      infinite: true,
      lazyLoad: true,
      speed: 500,
      pauseOnHover: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 5000,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
    };
  }, []);

  return (
    <Slider {...settings}>
      {clusterData?.map((value, index) => (
        <Stack gap={2} mb={3} px={1} key={index}>
          <Stack gap={0} borderWidth={1} w={'100%'} borderRadius={8} px={2} py={3}>
            <Text fontWeight={'500'} fontSize={'24px'}>{value.ram_total} GB</Text>
            <Text fontWeight={'300'} fontSize={'14px'}>Memory (RAM)</Text>

            <Box my={1}>
              <Progress.Root key={'xs'}
                             size={'xs'}
                             colorPalette={'green'}
                             defaultValue={(value.ram_usage * 100) / value.ram_total}>
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Box>

            <HStack>
              <Text fontWeight={'300'} mt={2} fontSize={'14px'} my={'auto'}>
                Free: {(value.ram_total - value.ram_usage).toFixed(2)} GB
              </Text>
              <Tag cursor={'default'} colorPalette={'cyan'} p={0} my={'auto'}>
                {(((value.ram_total - value.ram_usage) * 100) / value.ram_total).toFixed(2)}%
              </Tag>
            </HStack>

            <HStack>
              <Text fontWeight={'300'} mt={2} fontSize={'14px'} my={'auto'}>
                Usage: {value.ram_usage} GB
              </Text>
              <Tag cursor={'default'} colorPalette={'red'} p={0} my={'auto'}>
                {((value.ram_usage * 100) / value.ram_total).toFixed(2)}%
              </Tag>
            </HStack>
          </Stack>

          <Stack gap={0} borderWidth={1} w={'100%'} borderRadius={8} px={2} py={3}>
            <Text fontWeight={'500'} fontSize={'24px'}>{value.disk_total} GB</Text>
            <Text fontWeight={'300'} fontSize={'14px'}>Disk (SSD / HDD)</Text>

            <Box my={1}>
              <Progress.Root key={'xs'}
                             size={'xs'}
                             colorPalette={'green'}
                             defaultValue={(value.disk_usage * 100) / value.disk_total}>
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Box>

            <HStack>
              <Text fontWeight={'300'} mt={2} fontSize={'14px'} my={'auto'}>
                Free: {(value.disk_total - value.disk_usage).toFixed(2)} GB
              </Text>
              <Tag cursor={'default'} colorPalette={'cyan'} p={0} my={'auto'}>
                {(((value.disk_total - value.disk_usage) * 100) / value.disk_total).toFixed(2)}%
              </Tag>
            </HStack>

            <HStack>
              <Text fontWeight={'300'} mt={2} fontSize={'14px'} my={'auto'}>
                Usage: {value.disk_usage} GB
              </Text>
              <Tag cursor={'default'} colorPalette={'red'} p={0} my={'auto'}>
                {((value.disk_usage * 100) / value.disk_total).toFixed(2)}%
              </Tag>
            </HStack>
          </Stack>

          <Stack gap={0} borderWidth={1} w={'100%'} borderRadius={8} px={2} py={3}>
            <Text fontWeight={'500'} fontSize={'24px'}>{value.cpu_total}</Text>
            <Text fontWeight={'300'} fontSize={'14px'}>CPU</Text>

            <Box my={1}>
              <Progress.Root key={'xs'}
                             size={'xs'}
                             colorPalette={'green'}
                             defaultValue={(value.cpu_usage * 100) / value.cpu_total}>
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Box>

            <HStack>
              <Text fontWeight={'300'} mt={2} fontSize={'14px'} my={'auto'}>
                Unused: {(value.cpu_total - value.cpu_usage).toFixed(2)}
              </Text>
              <Tag cursor={'default'} colorPalette={'cyan'} p={0} my={'auto'}>
                {(((value.cpu_total - value.cpu_usage) * 100) / value.cpu_total).toFixed(2)}%
              </Tag>
            </HStack>

            <HStack>
              <Text fontWeight={'300'} mt={2} fontSize={'14px'} my={'auto'}>
                Usage: {value.cpu_usage}
              </Text>
              <Tag cursor={'default'} colorPalette={'red'} p={0} my={'auto'}>
                {((value.cpu_usage * 100) / value.cpu_total).toFixed(2)}%
              </Tag>
            </HStack>
          </Stack>
        </Stack>
      ))}
    </Slider>
  );
});
