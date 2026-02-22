import { Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { TURQUOISE_BUTTON_COLOR, TURQUOISE_COLOR } from '../../Base/BaseColor';
import { giveDir, giveText } from '../../Base/MultiLanguages/HandleLanguage';
import UserFloatingLabelInput from '../../Base/CustomComponets/UserFloatingLabelInput.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import { Tooltip } from '../../ui/tooltip.jsx';
import { SearchIcon } from '../../Base/CustomIcons/SearchIcon.jsx';
import { memo } from 'react';
import { CircularCrossFillIcon } from '../../Base/CustomIcons/CircularCrossFillIcon.jsx';

export const ProBaseHeaderPage2 = memo(function ProBaseHeaderPage({
  title,
  description,
  onOpenAdd,
  addTitle = giveText(9),
  hasAddButton = true,
  searchValue,
  setSearchValue,
  extension,
  addTitleDisabled = false,
  InputRightElementCustom,
  controller,

  /** ✅ NEW — Generic flag buttons */
  flagButtons = [], // [{ key, value, icon, onClick, tooltip }]

}) {
  const { colorMode } = useColorMode();

  const InputRightElement = (
    <HStack mx={2}>
      {InputRightElementCustom}

      {searchValue && (
        <Box cursor={'pointer'} onClick={() => setSearchValue('')}>
          <CircularCrossFillIcon color={'red'} width={'1rem'} />
        </Box>
      )}
    </HStack>
  );

  /** ✅ Generic Flag Buttons Renderer */
  const FlagButtons = flagButtons?.length ? (
    <HStack>
      {flagButtons.map((btn) => {
        const bg =
          btn.value === true
            ? 'yellow.400'
            : btn.value === false
            ? 'red.400'
            : 'transparent';

        return (
          <Tooltip key={btn.key} content={btn.tooltip || ''}>
            <Button bg={bg} onClick={btn.onClick}>
              {btn.icon}
            </Button>
          </Tooltip>
        );
      })}
    </HStack>
  ) : null;

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6} px={'2rem'} dir={giveDir()}>
      {/* LEFT SIDE */}
      <GridItem colStart={1} colEnd={2}>
        {/* <Text fontWeight={'800'} fontSize={'22px'} cursor={'default'}>
          {title}
        </Text> */}
        <Box fontWeight="800" fontSize="22px">
            {title}
        </Box>

        <Text fontWeight={'400'} fontSize={'15px'} cursor={'default'}>
          {description}
        </Text>
      </GridItem>

      {/* RIGHT SIDE */}
      <GridItem colStart={2} colEnd={3} dir={giveDir(true)} mt={'auto'}>
        <HStack spacing={2}>

          {hasAddButton && (
            <Tooltip
              bg={'black'}
              color={'white'}
              disabled={!addTitleDisabled}
              content={addTitleDisabled ? giveText(159) : ''}
              fontWeight={'bold'}
            >
              <Button
                borderRadius={5}
                px={4}
                disabled={addTitleDisabled}
                color={colorMode === 'light' ? 'white' : 'black'}
                backgroundColor={colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR}
                _hover={{
                  backgroundColor:
                    colorMode === 'light'
                      ? TURQUOISE_BUTTON_COLOR
                      : TURQUOISE_COLOR,
                }}
                onClick={onOpenAdd}
              >
                {addTitle}
              </Button>
            </Tooltip>
          )}

          <UserFloatingLabelInput
            label={giveText(10)}
            value={searchValue}
            dir={giveDir()}
            maxW={'400px'}
            minW2={'400px'}
            hasInputLeftElement={true}
            InputLeftElementIcon={<SearchIcon width={'1rem'} color="gray.300" />}
            hasInputRightElement={true}
            InputRightElement={InputRightElement}
            mx={3}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          {FlagButtons}

          {extension}
        </HStack>
      </GridItem>
    </Grid>
  );
});
