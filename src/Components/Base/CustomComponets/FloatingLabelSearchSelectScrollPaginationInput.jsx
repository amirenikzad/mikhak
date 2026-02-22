import { Input, Field, InputGroup, Box, Text } from '@chakra-ui/react';
import { memo, useEffect, useState } from 'react';
import { MENU_BACKGROUND_DARK, MENU_BACKGROUND_DARK_HOVER, MENU_BACKGROUND_LIGHT } from '../BaseColor.jsx';
import { giveDir } from '../MultiLanguages/HandleLanguage.jsx';
import { User } from '../Extensions.jsx';
import Avatar from '@mui/material/Avatar';
import { CustomCircularProgress } from './CustomCircularProgress.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import { hasPersianText } from '../BaseFunction.jsx';
import { useSearchParams } from 'react-router';

import { forwardRef, useImperativeHandle } from 'react';
import { CircularCrossFillIcon } from '../CustomIcons/CircularCrossFillIcon.jsx';

// const FloatingLabelSearchSelectScrollPaginationInput = memo(forwardRef( function FloatingLabelUserSearchSelectScrollPaginationInput({
const FloatingLabelSearchSelectScrollPaginationInput = memo(function FloatingLabelUserSearchSelectScrollPaginationInput({
                                                                                                                          label,
                                                                                                                          onChange,
                                                                                                                          value,
                                                                                                                          hasInputLeftElement,
                                                                                                                          InputLeftElementIcon,
                                                                                                                          hasInputRightElement,
                                                                                                                          InputRightElement,
                                                                                                                          lastElementUserRef,
                                                                                                                          list = [],
                                                                                                                          boxWidth = '200px',
                                                                                                                          maxW,
                                                                                                                          minW = '100px',
                                                                                                                          disabled = false,
                                                                                                                          onSelectMethod,
                                                                                                                          usernameKey = 'username',
                                                                                                                          emailKey,
                                                                                                                          picKey = 'profile_pic',
                                                                                                                          isFetching = false,
                                                                                                                          onKeyDown = () => null,
                                                                                                                          the_icon = '',
                                                                                                                          invalid = false,
                                                                                                                          inputWidth = 'auto',
                                                                                                                          onClear,
                                                                                                                          ...props
                                                                                                                        }) 
                                                                                                                        {
  const [icon, setIcon] = useState(the_icon);
  const { colorMode } = useColorMode();
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadedFromQueryParameter, setLoadedFromQueryParameter] = useState(false);

  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true);
      setDropdownOpen(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setDropdownOpen(false);
    }, 200);
  };

  const onSelectItem = (user) => {
    setIcon(user[picKey]);
    onSelectMethod(user);
    setDropdownOpen(false);
  };

  const handleClear = () => {
    setIcon('');
    // setDropdownOpen(true);
    setIsFocused(true);
    onClear?.();
  };


  useEffect(() => {
    if (!loadedFromQueryParameter) {
      if (searchParams.has('uname')) {
        setIcon(list?.[0]?.[picKey]);
      }
      if (list.length) {
        setLoadedFromQueryParameter(true);
      }
    }
  }, [list]);

const clearButton = (!disabled && value) && (
  <Box
    cursor="pointer"
    onMouseDown={e => {
      e.preventDefault();
      e.stopPropagation(); 
      handleClear();     
    }}
    mx={2}
  >
    <CircularCrossFillIcon color="red" width="1rem" />
  </Box>
);

  return (
    <Box position={'relative'} maxW={maxW} minW={minW}>
      <Text position={'absolute'}
            top={isFocused || value ? '-8px' : '50%'}
            left={giveDir() === 'ltr' && '12px'}
            right={giveDir() === 'rtl' && '12px'}
            transform={isFocused || value ? 'scale(0.75)' : 'translateY(-50%)'}
            transformOrigin={`${giveDir() === 'ltr' ? 'left' : 'right'} top`}
            transition={'all 0.2s ease'}
            color={
              isFocused ?
                colorMode === 'light'
                  ? 'teal.500'
                  : 'teal.400'
                : colorMode === 'light'
                  ? 'gray.500'
                  : 'gray.200'
            }
            pointerEvents={'none'}
            zIndex={1}
            backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}
            px={2}>
        {label}
      </Text>

      <Field.Root invalid={invalid}>
        <InputGroup w={'100%'}
                    startElement={hasInputLeftElement && (
                      <Box mx={3}>
                        {InputLeftElementIcon}
                      </Box>
                    )}
                    endElement={
                      <>
                        {hasInputRightElement &&
                          <Box mx={3}>
                            {InputRightElement}
                          </Box>
                        }

                        {/* {(picKey && icon) && (
                          <Box position={'relative'} zIndex={3}>
                            <Avatar sx={{ width: '40px', height: '40px' }} src={icon} />
                          </Box>
                        )} */}
                        {clearButton}
                        {picKey && icon && (
                          <Box position={'relative'} zIndex={3}>
                            <Avatar sx={{ width: '40px', height: '40px' }} src={icon} />
                          </Box>
                        )}
                      </>
                    }>
          <Input disabled={disabled}
                 autoComplete={'off'}
                //  inputWidth={inputWidth}
                style={{ width: inputWidth }}
                 transition={'all 0.5s ease'}
                //  borderLeftRadius={(picKey && icon) ? '50px' : '5px'}
                 value={value}
                 onFocus={handleFocus}
                 onBlur={handleBlur}
                 onChange={!disabled && onChange}
                 backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_LIGHT}
                 _disabled={{
                   color: colorMode === 'light' ? '#676767' : '#cacaca',
                   cursor: 'not-allowed',
                 }}
                 borderColor={invalid ? 'red.500' : undefined}
                //  borderColor={'red.600'}
                 pt={1}
                 position={'relative'}
                 zIndex={0}
                 tabIndex={0}
                 onKeyDown={(event) => {
                   if (!disabled) {
                     onKeyDown(event);
                     setIcon('');
                   }
                 }}
                 {...props} />
        </InputGroup>

        {isFetching && (
          <Box position={'absolute'} right={3} top={3}>
            <CustomCircularProgress />
          </Box>
        )}
      </Field.Root>

      {(list && list.filter(element => element !== undefined)?.length !== 0 && dropdownOpen) && (
        <Box zIndex={'504 !important'}
             className={'box_shadow'}
             position={'fixed'}
             mt={1}
             w={boxWidth}
             h={'300px'}
             overflowY={'auto'}
             overflowX={'hidden'}
             borderWidth={2}
             backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}>
          {list?.map((listValue, index) => {
            return <Box key={index}
                 ref={lastElementUserRef}
                 py={2}
                 px={2}
                 dir={picKey
                   ? 'ltr'
                   : hasPersianText(listValue[usernameKey]) ? 'rtl' : 'ltr'
                 }
                 cursor={'pointer'}
                 _hover={{ backgroundColor: colorMode === 'light' ? 'gray.200' : MENU_BACKGROUND_DARK_HOVER }}
                 onClick={(e) => {
                   e.preventDefault(); // Prevent blur
                   if (!disabled) {
                     onSelectItem(listValue);
                   }
                 }}>

              {picKey ? (
                <User cursor={'pointer'}
                      dir={giveDir()}
                      copyable={false}
                      userInfo={{
                        username: listValue && listValue[usernameKey],
                        profile_pic: listValue[picKey],
                        email: listValue[emailKey],
                      }} />
              ) : (
                <Text>{listValue && listValue[usernameKey]}</Text>
              )}
            </Box>
        })}
        </Box>
      )}
    </Box>
  );
});
// }));

export default FloatingLabelSearchSelectScrollPaginationInput;
