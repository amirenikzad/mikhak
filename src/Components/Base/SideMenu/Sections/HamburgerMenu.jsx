import { memo } from 'react';
import { Box, Center, Text } from '@chakra-ui/react';
import { giveDir, giveText } from '../../MultiLanguages/HandleLanguage.jsx';
import { MenuIcon } from '../../CustomIcons/MenuIcon.jsx';
import { Tooltip } from '../../../ui/tooltip.jsx';
import { setIsExpandedMenu } from '../../../../store/features/menuSlice.jsx';
import { EXPAND_NAME } from '../../MultiLanguages/Languages/Names.jsx';
import { useDispatch, useSelector } from 'react-redux';

export const HamburgerMenu = memo(function HamburgerMenu() {
  const menuSlice = useSelector(state => state.menuSlice);
  const dispatch = useDispatch();

  const setExpandStat = (stat) => {
    dispatch(setIsExpandedMenu(stat));
    localStorage.setItem(EXPAND_NAME, stat ? 'true' : 'false');
  };

  return (
    menuSlice.is_expanded_menu ? (
      <Box position={'absolute'}
           top={3}
           mx={4}
           left={giveDir() === 'rtl' ? 0 : null}
           right={giveDir() === 'ltr' ? 0 : null}
           cursor={'pointer'}
           onClick={() => setExpandStat(false)}>
        <Tooltip showArrow
                 positioning={{ placement: 'right' }}
                 content={<Text fontWeight={'500'} fontSize={'15px'}>{giveText(119)}</Text>}
                 colorPalette={'white'} dir={giveDir()} textAlign={'center'} borderRadius={5}>
          <MenuIcon width={'1.75rem'} color={'white'} />
        </Tooltip>
      </Box>
    ) : (
      <Center pt={3} cursor={'pointer'} onClick={() => setExpandStat(true)}>
        <Tooltip showArrow
                 positioning={{ placement: 'right' }}
                 content={<Text fontWeight={'500'} fontSize={'15px'}>{giveText(119)}</Text>}
                 colorPalette={'white'} dir={giveDir()} textAlign={'center'} borderRadius={5}>
          <MenuIcon width={'1.75rem'} color={'white'} />
        </Tooltip>
      </Center>
    )
  );
});
