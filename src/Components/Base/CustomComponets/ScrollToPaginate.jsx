import { memo } from 'react';
import { Center, HStack, Spinner, Text } from '@chakra-ui/react';
import { giveText } from '../MultiLanguages/HandleLanguage.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';

const ScrollToPaginate = memo(function ScrollToPaginate({
                                                          hasPagination = true,
                                                          lastElementRef,
                                                          isLoading,
                                                        }) {
  const { colorMode } = useColorMode();
  if (!hasPagination) return <></>;

  return (
    <Center>
      <HStack ref={!isLoading ? lastElementRef : null}>
        <Text cursor={'default'} color={colorMode === 'light' ? 'black' : 'white'}>
          {giveText(293)}
        </Text>

        {isLoading &&
          <Spinner color={colorMode === 'light' ? 'blue.600' : 'white'} />
        }
      </HStack>
    </Center>
  );
});

export default ScrollToPaginate;
