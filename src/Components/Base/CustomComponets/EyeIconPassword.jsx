import { Button } from '@chakra-ui/react';
import { useColorMode } from '../../ui/color-mode.jsx';
import { EyeFillIcon } from '../CustomIcons/EyeFillIcon.jsx';
import { EyeOffFillIcon } from '../CustomIcons/EyeOffFillIcon.jsx';
import { memo } from 'react';

export const EyeIconPassword = memo(function({ isOn, onClick, ...icon_props }) {
  const { colorMode } = useColorMode();

  return (
    <Button p={0} m={0} backgroundColor={'transparent'} onClick={onClick} tabIndex={-1}>
      {isOn
        ? <EyeFillIcon width={'1rem'} color={colorMode === 'light' ? 'black' : 'white'} {...icon_props} />
        : <EyeOffFillIcon width={'1rem'} color={colorMode === 'light' ? 'black' : 'white'} {...icon_props} />}
    </Button>
  );
});
