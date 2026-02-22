import { Input, InputGroup, Field, Box, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { MENU_BACKGROUND_DARK } from '../BaseColor.jsx';
import { giveDir } from '../MultiLanguages/HandleLanguage.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';

const UserFloatingLabelInput = ({
                              label,
                              onChange,
                              value,
                              hasInputLeftElement,
                              InputLeftElementIcon,
                              hasInputRightElement,
                              InputRightElement,
                              endElement,
                              maxW = '100%',
                              // minW = '100%',
                              minW2,
                              disabled = false,
                              invalid = false,
                              mx = 3,
                              ...props
                            }) => {
  const minW = minW2 ?? '100%';
  const [isFocused, setIsFocused] = useState(false);
  const { colorMode } = useColorMode();

  const handleFocus = () => setIsFocused(!disabled);
  const handleBlur = () => setIsFocused(false);

  return (
    // <Box position={'relative'} maxW={maxW} minW={minW} dir={giveDir()}>
    <Box position={'relative'} maxW={maxW} dir={giveDir()}>
      <Text htmlfor={`${label}-id`}
            position={'absolute'}
            top={isFocused || value ? '-8px' : '50%'}
            left={giveDir() === 'ltr' && '12px'}
            right={giveDir() === 'rtl' && '12px'}
            transform={isFocused || value ? 'scale(0.75)' : 'translateY(-50%)'}
            transformOrigin={`${giveDir() === 'rtl' ? 'right' : 'left'} top`}
            transition={'all 0.2s ease'}
            color={isFocused
              ? (colorMode === 'light' ? 'teal.500' : 'teal.400')
              : (colorMode === 'light' ? 'gray.500' : 'gray.200')
            }
            pointerEvents={'none'}
            zIndex={1}
            backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}
            px={2}>
        {label}
      </Text>
      <Field.Root invalid={invalid}>
        <InputGroup id={`${label}-id`}
                    w={'100%'}
                    css={{ minWidth: 'inherit' }}
                    startElement={hasInputLeftElement && <Box mx={mx}>{InputLeftElementIcon}</Box>}
                    endElement={hasInputRightElement && InputRightElement}
                    >
          <Input disabled={disabled}
                 px={3}
                 value={value}
                 onFocus={handleFocus}
                 onBlur={handleBlur}
                 onChange={onChange}
                 _disabled={{
                   color: colorMode === 'light' ? '#676767' : '#cacaca',
                   cursor: 'not-allowed',
                 }}
                 pt={1}
                 position={'relative'}
                 zIndex={0}
                 tabIndex={0}
                 {...props} />
        </InputGroup>
      </Field.Root>
    </Box>
  );
};

export default UserFloatingLabelInput;