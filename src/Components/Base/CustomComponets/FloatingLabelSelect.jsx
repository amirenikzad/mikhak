import { memo, useState } from 'react';
import { MENU_BACKGROUND_DARK } from '../BaseColor.jsx';
import { giveDir } from '../MultiLanguages/HandleLanguage.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import { Box, Select } from '@chakra-ui/react';

const FloatingLabelSelect = memo(function FloatingLabelSelect({
                                                                label,
                                                                options,
                                                                value,
                                                                onChange,
                                                                onInputChange,
                                                                styles,
                                                                isLoading = false,
                                                                w = 'auto',
                                                                ...props
                                                              }) {
  const [isFocused, setIsFocused] = useState(false);
  const { colorMode } = useColorMode();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <Box position={'relative'} w={w}>
      <Box position={'absolute'}
           top={isFocused || value ? '-8px' : '50%'}
           left={giveDir() === 'ltr' && '15px'}
           right={giveDir() === 'rtl' && '20px'}
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

      <Select.Root collection={options}
                   width={w}
                   value={value}
                   onFocus={handleFocus}
                   onBlur={handleBlur}
                   loading={isLoading}
                   onValueChange={onChange}
                   {...props}>
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            {/* <Select.ValueText px={2} /> */}
            <Select.ValueText px={2}>
              {value}
            </Select.ValueText>
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator px={2} />
          </Select.IndicatorGroup>
        </Select.Control>
          <Select.Positioner>
            <Select.Content px={1} py={2}>
              {options.items.map((option) => (
                <Select.Item item={option} key={option.value} py={1} px={2}>
                  {option.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
      </Select.Root>
    </Box>
  );
});

export default FloatingLabelSelect;
