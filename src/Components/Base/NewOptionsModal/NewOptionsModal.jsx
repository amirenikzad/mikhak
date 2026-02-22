import {  Image, Separator, Stack, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { NEW_OPTIONS_VERSION } from './Names.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {  giveTextBaseInput } from '../MultiLanguages/HandleLanguage.jsx';
import { IMAGE_NAME, newOptionsData, VIDEO_NAME } from './NewOptionsData.jsx';
import { onOpenNewOptionsSlice } from '../../../store/features/newOptionsSlice.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';

export const NewOptionsModal = () => {
  const newOptionsSlice = useSelector(state => state.newOptionsSlice);
  const baseSlice = useSelector(state => state.baseSlice);
  const [selectedTab, setSelectedTab] = useState(0);
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();

  const sectionBody = useMemo(() => {
    return newOptionsData()[selectedTab]?.data.map((data) => (
      <Stack w={'730px'} cursor={'default'} key={`${colorMode}-${selectedTab}`} pt={4}>
        {data.type === VIDEO_NAME ? (
          <video width="100%" height="100%" loop={true} autoPlay={true}>
            <source src={colorMode === 'light' ? data.address.light : data.address.dark} type="video/mp4" />
          </video>
        ) : (
          data.type === IMAGE_NAME && (
            <Image loading="lazy" src={colorMode === 'light' ? data.address.light : data.address.dark} alt={data.title} />
          )
        )}

        <Separator color={colorMode === 'light' ? 'gray' : 'white'} />

        <Text mt={2} fontSize={'22px'} fontWeight={600}>{giveTextBaseInput(data.title)}</Text>
        {giveTextBaseInput(data.description)}
      </Stack>
    ));
  }, [colorMode, selectedTab]);

  const tabsValues = useMemo(() => {
    return newOptionsData().map((value) => (
      giveTextBaseInput(value.title)
    ));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(NEW_OPTIONS_VERSION) || localStorage.getItem(NEW_OPTIONS_VERSION) !== baseSlice.appVersion) {
      dispatch(onOpenNewOptionsSlice());
      localStorage.setItem(NEW_OPTIONS_VERSION, baseSlice.appVersion);
    }
  }, [baseSlice.appVersion]);

  return <>
    {/*<BaseModal isOpen={newOptionsSlice.isOpen}*/}
    {/*           onClose={() => dispatch(onCloseNewOptionsSlice())}*/}
    {/*           minH={'auto'}*/}
    {/*           h={'750px'}*/}
    {/*           size={'6xl'}*/}
    {/*           content={(*/}
    {/*             <Box px={8}>*/}
    {/*               <Box position={'absolute'} left={3} top={0} mt={1}>*/}
    {/*                   <ColorModeButton />*/}
    {/*               </Box>*/}

    {/*               <Center>*/}
    {/*                 <Text cursor={'default'} fontWeight={'500'} fontSize={'22px'}>*/}
    {/*                   {giveText(210)}*/}
    {/*                 </Text>*/}
    {/*               </Center>*/}

    {/*               <Box>*/}
    {/*                 <Separator borderColor={colorMode === 'light' ? 'black' : 'white'} mb={2} />*/}
    {/*               </Box>*/}

    {/*               <Center>*/}
    {/*                 <Grid dir={giveDir()} minW={'100%'} px={6} templateColumns="repeat(9, 1fr)" gap={9} mt={3}>*/}
    {/*                   <GridItem colSpan={2}>*/}
    {/*                     <VStack spacing={1}>*/}
    {/*                       {tabsValues.map((value, index) => (*/}
    {/*                         <Box key={index}*/}
    {/*                              bg={colorMode === 'light'*/}
    {/*                                ? selectedTab === index ? MENU_BACKGROUND_DARK_HOVER : 'white'*/}
    {/*                                : selectedTab === index ? 'white' : 'transparent'*/}
    {/*                              }*/}
    {/*                              color={colorMode === 'light'*/}
    {/*                                ? selectedTab === index ? 'white' : 'black'*/}
    {/*                                : selectedTab === index ? 'black' : 'white'*/}
    {/*                              }*/}
    {/*                              borderRadius={8}*/}
    {/*                              px={2}*/}
    {/*                              py={1}*/}
    {/*                              cursor={'pointer'}*/}
    {/*                              w={'100%'}*/}
    {/*                              onClick={() => {*/}
    {/*                                setSelectedTab(index);*/}
    {/*                              }}*/}
    {/*                              _hover={{*/}
    {/*                                backgroundColor: colorMode === 'light' ? MENU_BACKGROUND_DARK : 'white',*/}
    {/*                                textColor: colorMode === 'light' ? 'white' : 'black',*/}
    {/*                                borderColor: 'transparent',*/}
    {/*                              }}>*/}
    {/*                           <Text fontWeight={'500'} dir={giveDir()}>*/}
    {/*                             {value}*/}
    {/*                           </Text>*/}
    {/*                         </Box>*/}
    {/*                       ))}*/}
    {/*                     </VStack>*/}
    {/*                   </GridItem>*/}

    {/*                   <GridItem colSpan={7}*/}
    {/*                             borderWidth={1}*/}
    {/*                             borderRadius={8}*/}
    {/*                             h={'650px'}*/}
    {/*                             p={2}>*/}
    {/*                     <CarouselSlider Content={sectionBody} hasDot={false} refreshPage={selectedTab} />*/}
    {/*                   </GridItem>*/}
    {/*                 </Grid>*/}
    {/*               </Center>*/}
    {/*             </Box>*/}
    {/*           )} />*/}
  </>;
};
