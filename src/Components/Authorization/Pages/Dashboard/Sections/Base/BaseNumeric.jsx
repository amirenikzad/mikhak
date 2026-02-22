import { memo } from 'react';
import { Text, Spinner, Grid, GridItem, FormatNumber } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { useSpring, animated } from '@react-spring/web';

export const BaseNumeric = memo(function BaseNumeric({
                                                       count,
                                                       isFetching,
                                                       Icon,
                                                       title,
                                                       titleSize = '18px',
                                                       countSize = '38px',
                                                       commaSeparate = false,
                                                     }) {
  const { val } = useSpring({
    from: { val: 0 },
    to: { val: count },
    config: { duration: 500 },
  })

  return (
    <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.01 }}>
      <Grid templateRows={'repeat(3, 1fr)'}
            gap={4}
            borderWidth={1}
            h={'170px'}
            boxShadow={'lg'}
            borderRadius={8}
            cursor={'default'}>
        <GridItem rowSpan={1} m={'auto'} height={'10px'} textAlign={'center'}>
          {Icon}
        </GridItem>

        <GridItem rowSpan={1} m={'auto'} height={'40px'} textAlign={'center'}>
          {isFetching ? (
            <Spinner size={'lg'} color={'green'} borderWidth={'4px'} />
          ) : (
            <Text fontSize={countSize} fontWeight={'800'}>
              {commaSeparate ? (
                <FormatNumber value={count} />
              ) : (
                <animated.span>
                  {val.to((val) => Math.floor(val))}
                </animated.span>
              )}
            </Text>
          )}
        </GridItem>

        <GridItem rowSpan={1} height={'50px'} textAlign={'center'}>
          <Text fontSize={titleSize} fontWeight={'500'} cursor={'default'}>{title}</Text>
        </GridItem>
      </Grid>
    </motion.div>
  );
});
