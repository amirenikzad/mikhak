import { Box, Field } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { MENU_BACKGROUND_DARK } from '../BaseColor.jsx';
import { giveDir } from '../MultiLanguages/HandleLanguage.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import { NumberInputField, NumberInputRoot } from '../../ui/number-input.jsx';

const FloatingLabelNumberInput = memo(function FloatingLabelNumberInput({
                                                                          label,
                                                                          step,
                                                                          min,
                                                                          max,
                                                                          onChange,
                                                                          value,
                                                                          invalid = false,
                                                                          ...props
                                                                        }) {
  const [isFocused, setIsFocused] = useState(false);
  const { colorMode } = useColorMode();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <Box position="relative">
      <Box position={'absolute'}
           top={isFocused || value ? '-8px' : '50%'}
           left={giveDir() === 'ltr' && '12px'}
           right={giveDir() === 'rtl' && '18px'}
           transform={isFocused || value ? 'scale(0.75)' : 'translateY(-50%)'}
           transformOrigin={'left top'}
           transition={'all 0.2s ease'}
           color={isFocused
             ? (colorMode === 'light' ? 'teal.500' : 'teal.400')
             : (colorMode === 'light' ? 'gray.500' : 'gray.200')}
           pointerEvents={'none'}
           zIndex={1}
           backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}>
        {label}
      </Box>

      <Field.Root invalid={invalid}>
        <NumberInputRoot w={'100%'}
                         step={step}
                         dir={''}
                         min={min}
                         max={max}
                         value={value}
                         onFocus={handleFocus}
                         onBlur={handleBlur}
                         onValueChange={(e) => {
                           onChange(isNaN(e.valueAsNumber) ? '' : e.valueAsNumber);
                         }}
                         {...props}
                         position={'relative'}
                         zIndex={0}
                         tabIndex={0}>
          <NumberInputField px={3} name="port" />
        </NumberInputRoot>
      </Field.Root>
    </Box>
  );
});

export default FloatingLabelNumberInput;
