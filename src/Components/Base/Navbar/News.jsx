import { Box, Button } from '@chakra-ui/react';
import { MENU_BACKGROUND_DARK, MENU_BACKGROUND_DARK_HOVER } from '../BaseColor';
import { giveDir } from '../MultiLanguages/HandleLanguage';
import { UnderConstructor } from '../Extensions.jsx';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../../ui/popover.jsx';
import { useState } from 'react';
import { BellRingingIcon } from '../CustomIcons/BellRingingIcon.jsx';

export const News = () => {
  const [isOpenProfileNavbar, setIsOpenProfileNavbar] = useState(false)

  return <>
    <PopoverRoot lazyMount open={isOpenProfileNavbar} onOpenChange={(e) => setIsOpenProfileNavbar(e.open)}>
      <PopoverTrigger asChild>
        <Button borderRadius={'full'}
                aria-label={'news button'}
                position={'relative'}
                p={0}
                backgroundColor={'transparent'}
                _hover={{ backgroundColor: MENU_BACKGROUND_DARK_HOVER }}>
          <BellRingingIcon width={'1.6rem'} color={'white'} />

          <Box position={'absolute'} bottom={1} right={1} w={'9px'} h={'9px'} borderRadius={'full'}
               backgroundColor={'red'} />
        </Button>
      </PopoverTrigger>

      <PopoverContent w={'200px'} dir={giveDir()} backgroundColor={MENU_BACKGROUND_DARK} color={'white'}>
        <PopoverBody px={2} py={1}>
          <UnderConstructor />
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  </>;
};
