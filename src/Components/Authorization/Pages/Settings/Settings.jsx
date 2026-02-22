import { useEffect } from 'react';
import { setPageName } from '../../../../store/features/pagesSlice.jsx';
import { SETTINGS_NAME } from '../../../Base/PageNames.jsx';
import { useDispatch } from 'react-redux';
import { Box, Center, Grid, GridItem, Separator, Text } from '@chakra-ui/react';
import { giveDir, giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
import { motion } from 'motion/react';
import { useColorMode } from '../../../ui/color-mode.jsx';

export default function Settings() {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();

  useEffect(() => {
    dispatch(setPageName(SETTINGS_NAME));
  }, []);

  const Template = ({ left, right }) => (
    <Grid templateColumns="repeat(2, 1fr)" gap={1} dir={giveDir()}>
      <GridItem dir={giveDir()} colSpan={1} my={'auto'}>
        {left}
      </GridItem>

      <GridItem colSpan={1} my={'auto'}>
        <Center>
          {right}
        </Center>
      </GridItem>
    </Grid>
  );

  return <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box px={'2rem'} pt={'1.2rem'}>
        <Grid templateColumns="repeat(3, 1fr)" gap={1} dir={giveDir()}>
          <GridItem dir={giveDir()} colSpan={1} my={'auto'}>
            <Text fontWeight={'800'} fontSize={'24px'} cursor={'default'}>{giveText(182)}</Text>
          </GridItem>

          <GridItem dir={giveDir(true)} colStart={3} my={'auto'}>
            {/*<Button size={'sm'} onClick={() => dispatch(onOpenNewOptionsSlice())}>*/}
            {/*  <HStack>*/}
            {/*    <FaGift color={LOGO_COLOR} fontSize={'1.3rem'} />*/}
            {/*    <Text fontWeight={'800'} fontSize={'16px'}>{giveText(210)}</Text>*/}
            {/*  </HStack>*/}
            {/*</Button>*/}
          </GridItem>
        </Grid>

        <Separator borderColor={colorMode === 'light' ? 'black' : 'white'} />

        <Box w={'300px'} mt={3}>

        </Box>
      </Box>
    </motion.div>
  </>;
};
