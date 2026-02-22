import { giveDir } from '../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { TableText, User } from '../../../../../../Base/Extensions.jsx';
import { useColorMode } from '../../../../../../ui/color-mode.jsx';
import { Box, Center } from '@chakra-ui/react';
import { Handle } from '@xyflow/react';
import { motion } from 'motion/react';

const MotionBox = motion(Box);

const CustomNodeAPI = ({ data, focusedButton, zoomLevel, hierarchyDirection = 'TB' }) => {
  const { colorMode } = useColorMode();

  return (
    <Box borderWidth={1} borderColor={focusedButton === data.id ? data?.color : 'transparent'}>
      <Box position="relative" width="97px" height="34px" bg={data?.color} boxShadow={'lg'}>
        <Handle type="target" position={hierarchyDirection === 'TB' ? 'top' : 'left'} />

        <Box position="absolute"
             px={2}
             top="0"
             left="0"
             width="100%"
             height="100%"
             bg="white"
             display="flex"
             justifyContent="center"
             alignItems="center">
          {zoomLevel && (
            <Box my={'auto'}>
              <User dir={giveDir()}
                    avatarHeight={'20px'}
                    avatarWidth={'20px'}
                    fontSizeTop={'8px'}
                    fontWeightTop={'900'}
                    fontSizeBottom={'5px'}
                    maxLengthTop={15}
                    maxLengthBottom={40}
                    copyable={false}
                    cursor={''}
                    userInfo={{
                      username: data?.name,
                      profile_pic: data?.image,
                    }} />
            </Box>
          )}
        </Box>

        <MotionBox position="absolute"
                   top={0}
                   left="0"
                   width="100%"
                   height={zoomLevel ? '3px' : '97px'}
                   backgroundColor={colorMode === 'light' ? 'cyan.600' : '#000000'}
                   initial={{ top: '0', height: '34px' }}
                   animate={{
                     top: zoomLevel ? '0' : '0',
                     height: zoomLevel ? '3px' : '34px',
                   }}
                   transition={{ duration: 0.25 }}>
          {!zoomLevel && (
            <Center h={'inherit'} my={'auto'}>
              <TableText copyable={false}
                         zIndex={'2 !important'}
                         color={zoomLevel ? 'black' : 'white'}
                         text={data?.name} />
            </Center>
          )}
        </MotionBox>

        <Handle type="source"
                position={hierarchyDirection === 'TB' ? 'bottom' : 'right'}
                style={{ background: 'black' }} />
      </Box>
    </Box>
  );
};

export default CustomNodeAPI;
