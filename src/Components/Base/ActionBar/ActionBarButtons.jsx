import { memo } from 'react';
import { Button } from '../../ui/button.jsx';
import { Text } from '@chakra-ui/react';
import { useColorMode } from '../../ui/color-mode.jsx';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.buttons === nextProps.buttons) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

export const ActionBarButtons = memo(function ActionBarButtons({ buttons }) {
  const { colorMode } = useColorMode();

  return (
    buttons.map((button, index) => (button.hasAccess &&
      <Button key={index}
              variant="outline"
              size="sm"
              px={2}
              _hover={{
                backgroundColor: colorMode === 'light'
                  ? button.hoverBackgroundColor[0]
                  : button.hoverBackgroundColor[1],
              }}
              css={{
                backgroundColor: colorMode === 'light'
                  ? button.backgroundColor[0]
                  : button.backgroundColor[1],
              }}
              onClick={button.onClickFunc}>
        <Text color={colorMode === 'light' ? button.color[0] : button.color[1]}>
          {button.title}
        </Text>
      </Button>
    ))
  );
}, arePropsEqual);
