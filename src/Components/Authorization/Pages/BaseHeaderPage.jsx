import { Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { TURQUOISE_BUTTON_COLOR, TURQUOISE_COLOR } from '../../Base/BaseColor';
import { giveDir, giveText } from '../../Base/MultiLanguages/HandleLanguage';
import FloatingLabelInput from '../../Base/CustomComponets/FloatingLabelInput.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import { Tooltip } from '../../ui/tooltip.jsx';
import { SearchIcon } from '../../Base/CustomIcons/SearchIcon.jsx';
import { memo } from 'react';
import { CircularCrossFillIcon } from '../../Base/CustomIcons/CircularCrossFillIcon.jsx';

export const BaseHeaderPage = memo(function BaseHeaderPage({
                                                             title,
                                                             description,
                                                             onOpenAdd, addTitle = giveText(9),
                                                             hasAddButton = true,
                                                             searchValue,
                                                             setSearchValue,
                                                             extension,
                                                             addTitleDisabled = false,
                                                             InputRightElement,
                                                             controller,
                                                           }) {
  const { colorMode } = useColorMode();

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6} px={'2rem'} dir={giveDir()}>
      <GridItem colStart={1} colEnd={2}>
        <Text fontWeight={'800'} fontSize={'22px'} cursor={'default'}>{title}</Text>
        <Text fontWeight={'400'} fontSize={'15px'} cursor={'default'}>{description}</Text>
      </GridItem>

      <GridItem colStart={2} colEnd={3} dir={giveDir(true)} mt={'auto'}>
        <HStack spacing={2}>
          {hasAddButton &&
            <Tooltip bg={'black'}
                     color={'white'}
                     disabled={!addTitleDisabled}
                     content={addTitleDisabled ? giveText(159) : ''}
                     fontWeight={'bold'}>
              <Button borderRadius={5} px={4}
                      disabled={addTitleDisabled}
                      color={colorMode === 'light' ? 'white' : 'black'}
                      backgroundColor={colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR}
                      _hover={{ backgroundColor: colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR }}
                      onClick={onOpenAdd}>
                {addTitle}
              </Button>
            </Tooltip>
          }

          <FloatingLabelInput label={giveText(10)}
                              value={searchValue}
                              dir={giveDir()}
                              maxW={'400px'}
                              minW={'400px'}
                              hasInputLeftElement={true}
                              InputLeftElementIcon={<SearchIcon width={'1rem'} color="gray.300" />}
                              hasInputRightElement={true}
                              InputRightElement={(
                                <HStack mx={2}>
                                  {InputRightElement}

                                  {searchValue &&
                                    <Box cursor={'pointer'} onClick={() => setSearchValue('')}>
                                      <CircularCrossFillIcon color={'red'} width={'1rem'} />
                                    </Box>
                                  }
                                </HStack>
                              )}
                              mx={3}
                              // onChange={(e) => {
                              //   controller.abort();
                              //   setSearchValue(e.target.value);
                              // }}
                              onChange={(e) => setSearchValue(e.target.value)}

                              />


          {extension}
        </HStack>
      </GridItem>
    </Grid>
  );
});
