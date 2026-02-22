// BaseHeaderPage.jsx
import {
  Box, Button, Grid, GridItem, HStack, Text, Select, Icon,
} from '@chakra-ui/react';
import { TURQUOISE_BUTTON_COLOR, TURQUOISE_COLOR } from '../../Base/BaseColor';
import { giveDir, giveText } from '../../Base/MultiLanguages/HandleLanguage';
import FloatingLabelInput from '../../Base/CustomComponets/FloatingLabelInput.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import { Tooltip } from '../../ui/tooltip.jsx';
import { SearchIcon } from '../../Base/CustomIcons/SearchIcon.jsx';
import { CircularCrossFillIcon } from '../../Base/CustomIcons/CircularCrossFillIcon.jsx';
import { memo } from 'react';

// export const ProBaseHeaderPage3 = memo(function BaseHeaderPage({
export default memo(function ProBaseHeaderPage3({
  titleText,
  titleBadge,
  description,
  onOpenAdd,
  addTitle = giveText(9),
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
    <Grid templateColumns="1fr auto" gap={6} px={'2rem'} dir={giveDir()}>
      <GridItem>
        <Box fontWeight="800" fontSize="22px" cursor="default" display="flex" alignItems="center" gap={3}>
            {titleText}
            {titleBadge}
        </Box>
        <Text fontWeight={'400'} fontSize={'15px'} cursor={'default'}>
          {description}
        </Text>
      </GridItem>

      <GridItem dir={giveDir(true)} mt={'auto'}>
        <HStack spacing={3} align="flex-end">
          {hasAddButton && (
            <Tooltip
              bg={'black'}
              color={'white'}
              disabled={!addTitleDisabled}
              content={addTitleDisabled ? giveText(159) : ''}
            >
              <Button
                borderRadius={5}
                px={4}
                disabled={addTitleDisabled}
                color={colorMode === 'light' ? 'white' : 'black'}
                bg={colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR}
                _hover={{ bg: colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR }}
                onClick={onOpenAdd}
              >
                {addTitle}
              </Button>
            </Tooltip>
          )}

          <FloatingLabelInput
            label={giveText(10)}
            value={searchValue}
            dir={giveDir()}
            maxW="360px"
            minW="320px"
            hasInputLeftElement
            InputLeftElementIcon={<SearchIcon width="1rem" color="gray.100" />}
            hasInputRightElement
            InputRightElement={
              <HStack mx={2}>
                {InputRightElement}
                {searchValue && (
                  <Box cursor="pointer" onClick={() => setSearchValue('')}>
                    <CircularCrossFillIcon color="red" width="1rem" />
                  </Box>
                )}
              </HStack>
            }
            onChange={(e) => setSearchValue(e.target.value)}
          />

          {extension}
        </HStack>
      </GridItem>
    </Grid>
  );
});