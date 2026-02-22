import { Box, Field, Textarea } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { MENU_BACKGROUND_DARK } from '../BaseColor.jsx';
import { giveDir } from '../MultiLanguages/HandleLanguage.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';

const FloatingLabelTextArea = memo(function FloatingLabelTextArea({
                                                                    label,
                                                                    onChange,
                                                                    value,
                                                                    invalid,
                                                                    ...props
                                                                  }) {
  const [isFocused, setIsFocused] = useState(false);
  const { colorMode } = useColorMode();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <Box position={'relative'} w={'100%'}>
      <Box position={'absolute'}
           top={isFocused || value ? '-8px' : '50%'}
           left={giveDir() === 'ltr' && '12px'}
           right={giveDir() === 'rtl' && '12px'}
           transform={isFocused || value ? 'scale(0.75)' : 'translateY(-50%)'}
           transformOrigin={'left top'}
           transition={'all 0.2s ease'}
           color={isFocused
             ? (colorMode === 'light' ? 'teal.500' : 'teal.400')
             : (colorMode === 'light' ? 'gray.500' : 'gray.200')}
           pointerEvents={'none'}
           zIndex={2}
           backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}
           px={1}>
        {label}
      </Box>

      <Field.Root invalid={invalid}>
        <Textarea value={value}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={onChange}
                  pt={3}
                  px={2}
                  {...props}
                  position={'relative'}
                  zIndex={0}
                  maxH={'100px'}
                  tabIndex={0}
                  dir={'auto'}
        />
      </Field.Root>
    </Box>
  );
});

export default FloatingLabelTextArea;
