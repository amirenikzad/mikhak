import { Box, Button, ButtonGroup, Center, Image, Separator, Text } from '@chakra-ui/react';
import { giveDir, giveText } from '../Base/MultiLanguages/HandleLanguage';
import image from '../../assets/icons/Logo.png';
import { MENU_BACKGROUND_DARK } from '../Base/BaseColor.jsx';
import { useColorMode } from '../ui/color-mode.jsx';

export const Base = ({
                       buttonId,
                       title,
                       Content,
                       submitFunc,
                       submitTitle,
                       isLoadingSubmitButton = false,
                       Extension,
                       backNone = false,
                       hasTitle = true,
                       hasTitleTopAbsolute = false,
                       hasLogo = false,
                       minW = '400px',
                       SubmitButton,
                       p = 8,
                       w = '100%',
                       ml = '4rem',
                       mr = '4rem',
                       box_shadow = true,
                       hasSubmitButton = true,
                       noHeadingImage = true,
                       hasCancelButton = true,
                       onCloseModal,
                       px = '4rem',
                       hasExtensionButton = false,
                       extensionButton,
                       buttonWidth = 'full',
                     }) => {
  const { colorMode } = useColorMode();

  return <>
    <Box position={'relative'}
         minW={minW}
         w={w}
         ml={ml}
         mr={mr}
         className={box_shadow ? 'box_shadow' : ''}
         borderRadius={'0.4rem'}
         p={p}
         dir={giveDir()}
         backgroundColor={(
           backNone
             ? 'transparent'
             : colorMode === 'light' ? 'rgba(255,255,255,0.98)' : MENU_BACKGROUND_DARK
         )}>

      {hasLogo &&
        <Center mb={'2rem'}>
          <Image loading="lazy"
                 position={'absolute'}
                 mt={'-120px'}
                 src={image}
                 w={'150px'}
                 h={'150px'}
                 mx={`-${p}`}
                 mb={1} />
        </Center>
      }

      {hasTitleTopAbsolute && (
        <Text position={'absolute'}
              textShadow={'1px 1px 1px black'}
              color={'gray.100'}
              top={'-10'}
              dir={giveDir()}
              fontSize={'22px'}
              fontWeight={'600'}
              cursor={'default'}>
          {title}
        </Text>
      )}

      {(!hasLogo && hasTitle) && (
        <>
          <Center mb={3}>
            <Text dir={giveDir()} fontSize={'22px'} fontWeight={'600'} cursor={'default'}>
              {title}
            </Text>
          </Center>

          <Separator color={colorMode === 'light' ? 'gray' : 'white'} mb={2} />
        </>
      )}

      <Box px={px}>
        {Content}

        {hasSubmitButton &&
          <Center dir={'ltr'}>
            <ButtonGroup size={'xs'} w={buttonWidth} mt={3}>
              {hasCancelButton &&
                <Button w={'100%'} colorPalette={'red'} onClick={onCloseModal}>{giveText(31)}</Button>
              }

              {hasExtensionButton && extensionButton}

              <Box w={'100%'}>
                {SubmitButton
                  ? SubmitButton
                  : (
                    <Center>
                      <Button id={buttonId} w={'100%'}
                              colorPalette={'blue'}
                              onClick={submitFunc}
                              loading={isLoadingSubmitButton}
                              loadingText={giveText(116)}>
                        {submitTitle}
                      </Button>
                    </Center>
                  )
                }
              </Box>
            </ButtonGroup>
          </Center>
        }
        {Extension && Extension}
      </Box>
    </Box>
  </>;
};
