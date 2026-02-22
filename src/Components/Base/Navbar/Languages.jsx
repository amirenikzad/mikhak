import { Box, Grid, GridItem, HStack, Stack, Text } from '@chakra-ui/react';
import { MENU_BACKGROUND_DARK, MENU_BACKGROUND_DARK_HOVER } from '../BaseColor';
import { EN_UN_NAME, FA_IR_NAME, LANGUAGE_LOCALSTORAGE_LABEL } from '../MultiLanguages/Languages/Names';
import { useEffect, useMemo } from 'react';
import { giveText } from '../MultiLanguages/HandleLanguage';
import { useColorMode } from '../../ui/color-mode.jsx';
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../../ui/popover.jsx';
import { DotIcon } from '../CustomIcons/DotIcon.jsx';
import { LanguageIcon } from '../CustomIcons/LanguageIcon.jsx';

export const Languages = ({ placement = 'bottom', hoverColor, color }) => {
  const { colorMode } = useColorMode();
  const languages = useMemo(() => [
    { name: 'English (US)', lang: EN_UN_NAME },
    { name: 'فارسی', lang: FA_IR_NAME },
  ], []);

  useEffect(() => {
    document.title = giveText(91);
  }, []);

  const isSelectLanguage = (languageValue) => {
    return languageValue.lang === localStorage.getItem(LANGUAGE_LOCALSTORAGE_LABEL);
  };

  return (
    <PopoverRoot lazyMount positioning={{ placement: placement }}>
      <PopoverTrigger asChild>
        <Box backgroundColor={'transparent'}
             aria-label={'change language button'}
             _hover={{
               backgroundColor: hoverColor
                 ? hoverColor
                 : (colorMode === 'light' ? 'gray.300' : 'gray.700'),
             }}
             cursor={'pointer'}
             px={1}
             py={1}
             borderRadius={'full'}>
          <LanguageIcon width={'1.8rem'}
                        color={color
                          ? color
                          : colorMode === 'light' ? 'black' : 'white'
                        } />
        </Box>
      </PopoverTrigger>

      <PopoverContent w={'200px'}
                      dir={'rtl'}
                      px={2}
                      py={1}
                      className={'box_shadow'}
                      backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}
                      color={'white'}>
        <PopoverArrow />

        <PopoverBody dir={'ltr'}>
          <Stack gap={1}>
            {languages && languages.map((languageValue, index) => (
              <Grid templateColumns="repeat(4, 1fr)"
                    gap={4}
                    cursor={!isSelectLanguage(languageValue) ? 'pointer' : 'default'}
                    py={1}
                    key={index}
                    color={'black'}
                    _hover={{ backgroundColor: colorMode === 'light' ? 'gray.200' : MENU_BACKGROUND_DARK_HOVER }}
                    fontSize={'15px'}
                    pr={1}
                    borderRadius={5}
                    onClick={() => {
                      if (!isSelectLanguage(languageValue)) {
                        localStorage.setItem(LANGUAGE_LOCALSTORAGE_LABEL, languageValue.lang);
                        window.location.reload();
                      }
                    }}>
                <GridItem colSpan={3} my={'auto'}>
                  <HStack spacing={1}>
                    <DotIcon width={'0.5rem'}
                             my={'auto'}
                             color={isSelectLanguage(languageValue)
                               ? colorMode === 'light' ? 'black' : 'white'
                               : 'transparent'} />
                    <Text color={colorMode === 'light' ? 'black' : 'white'}>{languageValue.name}</Text>
                  </HStack>
                </GridItem>
                <GridItem colSpan={1} my={'auto'} textAlign={'right'}>
                  <Text color={colorMode === 'light' ? 'black' : 'white'}>{languageValue.lang}</Text>
                </GridItem>
              </Grid>
            ))}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};
