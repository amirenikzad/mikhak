import { memo } from 'react';
import { Center, HStack, Image, Link, Stack, Text } from '@chakra-ui/react';
import { ADMIN_ROUTE, DASHBOARD_ROUTE } from '../../BaseRouts.jsx';
import logo from '../../../../assets/icons/Logo.png';
import { LOGO_COLOR } from '../../BaseColor.jsx';
import { giveText } from '../../MultiLanguages/HandleLanguage.jsx';
import { useSelector } from 'react-redux';
import { useColorMode } from '../../../ui/color-mode.jsx';

export const TopSideMenu = memo(function TopSideMenu() {
  const { colorMode } = useColorMode();
  const menuSlice = useSelector(state => state.menuSlice);

  return (
    <Center pt={menuSlice.is_expanded_menu ? 12 : 8} mb={menuSlice.is_expanded_menu ? 8 : 2}>
      {menuSlice.is_expanded_menu
        ? (
          <Link href={`${ADMIN_ROUTE}${DASHBOARD_ROUTE}`}>
            <Stack cursor={'pointer'}>
              <Center>
                <HStack spacing={0} dir={'ltr'}>
                  <Image loading="lazy" alt={'mikhak_icon'} w={'80px'} h={'80px'} src={logo} />
                  <Text fontWeight={'600'} pt={2.5} fontSize={'32px'} color={LOGO_COLOR}>ikhak</Text>
                </HStack>
              </Center>

              <Text textAlign={'center'} px={8} fontSize={'11px'} color={colorMode === 'light' ? 'white' : 'white'}>
                {giveText(185)}
              </Text>
            </Stack>
          </Link>
        )
        : null
      }
    </Center>
  );
});
