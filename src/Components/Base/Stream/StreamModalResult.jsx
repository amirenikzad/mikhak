import { Box, Grid, GridItem, HStack, Separator, Text } from '@chakra-ui/react';
import { giveDir, giveText } from '../MultiLanguages/HandleLanguage.jsx';
import { Tooltip } from '../../ui/tooltip.jsx';
import { motion } from 'motion/react';
import { RefreshIcon } from '../CustomIcons/RefreshIcon.jsx';
import { CircularCheckFillIcon } from '../CustomIcons/CircularCheckFillIcon.jsx';
import { CircularCrossFillIcon } from '../CustomIcons/CircularCrossFillIcon.jsx';

export default function StreamModalResult({ setIsOpenResult, isAlive, streamSlice, handleWS, closeConnection }) {

  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={1}>
        <GridItem colSpan={9} my={'auto'}>
          <Text cursor={'default'} fontSize={'16px'} fontWeight={'500'}>{giveText(177)}</Text>
        </GridItem>

        <GridItem colSpan={1} my={'auto'} dir={giveDir(true)}>
          <Tooltip showArrow
                   content={giveText(80)}
                   bg={'black'}
                   color={'white'}
                   fontWeight={'bold'}>
            <Box display={'inline-block'}
                 cursor={'pointer'}
                 onClick={() => {
                   closeConnection();
                   setIsOpenResult(false);
                   handleWS({
                     ip: streamSlice.ip,
                     port: streamSlice.port,
                     path: streamSlice.path,
                   });
                 }}>
              <motion.div transition={{ duration: 0.3 }} whileHover={{ rotate: [null, 15, -5] }}>
                <RefreshIcon width={'1.2rem'} />
              </motion.div>
            </Box>
          </Tooltip>
        </GridItem>
      </Grid>

      <Separator my={1} />

      <HStack dir={giveDir()} w={'100%'} fontSize={'18px'} px={2} mb={2}>
        {isAlive ? (
          <CircularCheckFillIcon color={'green'} width={'1.4rem'} />
        ) : (
          <CircularCrossFillIcon color={'red'} width={'1.4rem'} />
        )}

        <Text fontWeight={'500'} mt={1} cursor={'default'}>
          {isAlive ? giveText(170) : giveText(171)} ({streamSlice.elapse_time} ms)
        </Text>
      </HStack>
    </>
  );
}
