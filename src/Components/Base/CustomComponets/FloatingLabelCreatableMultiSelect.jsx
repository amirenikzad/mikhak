import { memo, useState } from 'react';
import { giveDir, giveText } from '../MultiLanguages/HandleLanguage.jsx';
import CreatableSelect from 'react-select/creatable';
import { MENU_BACKGROUND_DARK } from '../BaseColor.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import { Box } from '@chakra-ui/react';

const FloatingLabelCreatableMultiSelect = memo(function FloatingLabelCreatableMultiSelect({
                                                                                            name,
                                                                                            label,
                                                                                            value = [],
                                                                                            onChange,
                                                                                            styles,
                                                                                            isLoading = false,
                                                                                            options = [],
                                                                                            ...props
                                                                                          }) {
  const [isFocused, setIsFocused] = useState(false);
  const { colorMode } = useColorMode();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <Box position={'relative'}>
      <Box position={'absolute'}
           top={isFocused || value.length ? '-8px' : '50%'}
           left={giveDir() === 'ltr' && '12px'}
           right={giveDir() === 'rtl' && '12px'}
           transform={isFocused || value.length ? 'scale(0.75)' : 'translateY(-50%)'}
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

      <CreatableSelect name={name}
                       isMulti
                       noOptionsMessage={() => giveText(113)}
                       loading={isLoading}
                       options={options}
                       theme={(theme) => ({
                         ...theme,
                         colors: {
                           ...theme.colors,
                           neutral0: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
                           neutral10: colorMode === 'light' ? 'rgb(66,154,43)' : '#003361',
                           primary25: colorMode === 'light' ? 'gray' : MENU_BACKGROUND_DARK,
                           neutral80: colorMode === 'light' ? 'black' : 'white',
                         },
                       })}
                       styles={{
                         ...styles,
                         placeholder: (provided) => ({
                           ...provided,
                           position: 'absolute',
                           top: isFocused || value.length ? '-20px' : '50%',
                           transform: 'translateY(-50%)',
                         }),
                       }}
                       defaultValue={value}
                       onFocus={handleFocus}
                       onBlur={handleBlur}
                       onChange={onChange}
                       tabIndex={0}
                       {...props} />
    </Box>
  );
});

export default FloatingLabelCreatableMultiSelect;
