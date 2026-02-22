import { giveDir, giveText } from '../../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { Box, HStack, Image, Stack, Text } from '@chakra-ui/react';
import { memo, useMemo } from 'react';
import { commaForEvery3Digit } from '../../../../../../../Base/BaseFunction.jsx';
import FloatingLabelInput from '../../../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { MENU_BACKGROUND_DARK } from '../../../../../../../Base/BaseColor.jsx';
import { useColorMode } from '../../../../../../../ui/color-mode.jsx';
import { POST_SERVICE_COMPONENT_MICROSERVICE } from '../../../../../../../Base/UserAccessNames.jsx';
import { useSelector } from 'react-redux';

export const ServiceApiInfo = memo(function ServiceApiInfo({ selectedService = {}, nodes = [] }) {
  const accessSlice = useSelector((state) => state.accessSlice);
  const { colorMode } = useColorMode();

  const apisCounter = useMemo(() => {
    let count = 0;
    count += nodes.filter(node => node.id !== '0').length;
    return count;
  }, [nodes]);

  return (
    <Stack px={3}
           py={2}
           gap={3}
           dir={giveDir()}
           borderRadius={4}
           borderWidth={1}
           height={'100px'}
           transition="all 0.5s ease"
           _hover={{ boxShadow: '2xl' }}
           backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}>
      <HStack spacing={2}>
        <Image loading="lazy" width={'50px'}
               src={colorMode === 'light' ? selectedService?.light_icon : selectedService?.dark_icon} />

        <Text fontSize={'18px'} fontWeight="800" cursor={'default'}>
          {giveDir() === 'rtl' ? selectedService?.fa_name : selectedService?.en_name}
        </Text>
      </HStack>

      <HStack cursor={'default'}>
        <Text>{giveText(267)}:</Text>
        <Text>{apisCounter}</Text>
      </HStack>
    </Stack>
  );
});
