import { memo } from 'react';
import { Center, Stack, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { ColorModeButton, useColorMode } from '../../../ui/color-mode.jsx';

export const BottomSideMenu = memo(function BottomSideMenu({ hasVersion }) {
  const baseSlice = useSelector(state => state.baseSlice);
  const { colorMode } = useColorMode();

  return (
    <Center>
      <Stack spacing={0} pos={'absolute'} bottom={5}>
        <Center>
          <ColorModeButton />
        </Center>

        {hasVersion &&
          <Center>
            <Text fontSize={'12px'} cursor={'default'} color={colorMode === 'light' ? 'yellow' : 'yellow'}>
              {baseSlice.appVersion}
            </Text>
          </Center>
        }
      </Stack>
    </Center>
  );
});
