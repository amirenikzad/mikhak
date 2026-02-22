import { Box, HStack } from '@chakra-ui/react';
import { TableText } from '../Extensions.jsx';
import { useState } from 'react';
import { Avatar } from '../../ui/avatar.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import { MENU_BACKGROUND_LIGHT } from '../BaseColor.jsx';

export const CustomAvatarGroup = ({ value }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { colorMode } = useColorMode();

  return (
    <Box onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => {
           setIsClicked(false);
           setIsHovered(false);
         }}
         transition={'all 0.3s ease'}
         transform={`scale(${isClicked ? 1.2 : 1})`}
         onClick={() => setIsClicked(true)}
         _hover={{
           transition: '0.3s ease',
           '& ~ div': {
             transform: 'translateX(30px)',
           },
         }}>
      <HStack spacing={0}
              dir={'ltr'}
              borderRadius={'full'}
              borderWidth={isHovered ? 1 : 0}
              className={isHovered && 'box_shadow'}>
        <Avatar bgColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_LIGHT}
                boxShadow={!isHovered && 'md'}
                name={value?.name}
                src={value?.icon} />

        <Box textAlign={'left'}
             mx={0}
             dir={'ltr'}
             transition={'all 0.3s ease'}
             w={isHovered ? '120px' : '0px'}
             opacity={isHovered ? 1 : 0}>
          <TableText text={value?.name}
                     fontSize={'14px'}
                     fontWeight={'500'}
                     maxLength={12}
                     hasCenter={false}
                     copyable={false}
                     display={isHovered ? 'inline-block' : 'none'} />
          <TableText text={value?.email}
                     fontSize={'11px'}
                     maxLength={16}
                     hasCenter={false}
                     copyable={false}
                     display={isHovered ? 'inline-block' : 'none'} />
        </Box>
      </HStack>
    </Box>
  );
};
