import { giveDir } from './MultiLanguages/HandleLanguage.jsx';
import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import { MENU_BACKGROUND_DARK, MENU_BACKGROUND_DARK_HOVER } from './BaseColor.jsx';
import { useColorMode } from '../ui/color-mode.jsx';

export const SideTabs = ({ tabsValues = [], sectionBody, selectedTab = 0, setSelectedTab }) => {
  const { colorMode } = useColorMode();

  return (
    <HStack dir={giveDir()} mt={3}>
      <Stack mt={0} mb={'auto'} w={'30%'} spacing={1}>
        {tabsValues.map((value, index) => (value &&
          <Box key={index}
               bg={colorMode === 'light'
                 ? selectedTab === index ? MENU_BACKGROUND_DARK_HOVER : 'white'
                 : selectedTab === index ? 'white' : 'transparent'
               }
               color={colorMode === 'light'
                 ? selectedTab === index ? 'white' : 'black'
                 : selectedTab === index ? 'black' : 'white'
               }
               borderRadius={8}
               px={2}
               py={1}
               cursor={'pointer'}
               w={'100%'}
               onClick={() => {
                 setSelectedTab(index);
               }}
               _hover={{
                 backgroundColor: colorMode === 'light' ? MENU_BACKGROUND_DARK : 'white',
                 color: colorMode === 'light' ? 'white' : 'black',
                 borderColor: 'transparent',
               }}>
            <Text fontWeight={'500'} dir={giveDir()}>
              {value}
            </Text>
          </Box>
        ))}
      </Stack>

      <Box w={'70%'} my={'auto'}>
        {sectionBody}
      </Box>
    </HStack>
  );
};
