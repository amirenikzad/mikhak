import { useSelector } from 'react-redux';
import { Button, Center, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { giveDir } from '../MultiLanguages/HandleLanguage.jsx';
import { GOLD_BG_COLOR, MENU_BACKGROUND_DARK, MENU_BACKGROUND_LIGHT, TURQUOISE_COLOR } from '../BaseColor.jsx';
import { hasPageNameMatch, lightenColor } from './baseFunction.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import { Tooltip } from '../../ui/tooltip.jsx';
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../../ui/popover.jsx';
import { memo, useState } from 'react';
import { ChevronLeftOutlineIcon } from '../CustomIcons/ChevronLeftOutlineIcon.jsx';
import { ChevronRightOutlineIcon } from '../CustomIcons/ChevronRightOutlineIcon.jsx';

export const CollapseMenu = memo(function CollapseMenu({ list, index }) {
  const pagesSlice = useSelector(state => state.pagesSlice);
  const { colorMode } = useColorMode();

  const SingleElement = ({ value = {}, onClose }) => (
    <Flex key={`${value.title}-single${index}`}
          p={2}
          my={1}
          dir={giveDir()}
          color={value.section === pagesSlice.page_name ? TURQUOISE_COLOR : 'white'}
          w={'100%'}
          borderRadius={9}
          className={value.section === pagesSlice.page_name && 'box_shadow'}
          backgroundColor={value.section === pagesSlice.page_name ? `rgba(${GOLD_BG_COLOR}, 0.6)` : 'transparent'}
          _hover={{
            backgroundColor: value.section !== pagesSlice.page_name && `rgba(${GOLD_BG_COLOR}, 0.6)`,
          }}
          cursor={value.section === pagesSlice.page_name ? 'default' : 'pointer'}
          onClick={() => {
            onClose();
            if (value.section !== pagesSlice.page_name) {
              value.method();
            }
          }}>
      <Center mx={2}>
        {value.icon({ color: value.section === pagesSlice.page_name ? TURQUOISE_COLOR : 'white' })}
      </Center>
      <Text fontWeight={'500'} fontSize={`16px`} pt={'0.3rem'}>{value.title}</Text>
    </Flex>
  );

  const ListExpanded = ({ list, recursive_index = 1, onClose }) => {
    const [openPopover, setOpenPopover] = useState(false);

    return list.map((value, index) => (
      value.type === 'single' ? (
        <SingleElement key={index} value={value} index={index} onClose={onClose} />
      ) : (
        <PopoverRoot lazyMount
                     key={index}
                     positioning={{ placement: 'right' }}
                     closeOnBlur={true}
                     trigger={'hover'}
                     open={openPopover}
                     onOpenChange={(e) => setOpenPopover(e.open)}>
          <PopoverTrigger asChild>
            <Grid templateColumns="repeat(7, 1fr)" gap={1}
                  my={0.5}
                  p={2}
                  dir={giveDir()}
                  w={'100%'}
                  borderRadius={9}
                  cursor={'pointer'}
                  color={hasPageNameMatch(value.items, pagesSlice.page_name) ? lightenColor(TURQUOISE_COLOR, recursive_index) : 'white'}
                  className={hasPageNameMatch(value.items, pagesSlice.page_name) && 'box_shadow'}
                  backgroundColor={hasPageNameMatch(value.items, pagesSlice.page_name) ? `rgba(${GOLD_BG_COLOR}, 0.6)` : 'transparent'}
                  _hover={{
                    backgroundColor: value.section !== pagesSlice.page_name && `rgba(${GOLD_BG_COLOR}, 0.6)`,
                  }}>
              <GridItem colSpan={6} my={'auto'}>
                <Flex>
                  <Center mx={2}>
                    {value.icon({ color: hasPageNameMatch(value.items, pagesSlice.page_name) ? lightenColor(TURQUOISE_COLOR, recursive_index) : 'white' })}
                  </Center>
                  <Text fontWeight={'500'} fontSize={`16px`} pt={'0.3rem'}>{value.title}</Text>
                </Flex>
              </GridItem>

              <GridItem colSpan={1} my={'auto'}>
                {giveDir() === 'rtl'
                  ? <ChevronLeftOutlineIcon width={'1rem'} />
                  : <ChevronRightOutlineIcon width={'1rem'} />
                }
              </GridItem>
            </Grid>
          </PopoverTrigger>
          <PopoverContent backgroundColor={colorMode === 'light' ? MENU_BACKGROUND_LIGHT : MENU_BACKGROUND_DARK}>
            <PopoverArrow />

            <PopoverBody>
              {value.items?.map((value) => (
                value.type === 'single'
                  ? (
                    <SingleElement value={value} index={index}
                                   onClose={() => {
                                     onClose();
                                     setOpenPopover(false);
                                   }} />
                  ) : (
                    <ListExpanded list={value.items} recursive_index={recursive_index + 1}
                                  onClose={() => {
                                    onClose();
                                    setOpenPopover(false);
                                  }} />
                  )
              ))}
            </PopoverBody>
          </PopoverContent>
        </PopoverRoot>
      )));
  };

  return list.map((value, index) => (
    value.type === 'single'
      ? (
        <Tooltip key={`${value.title}-single${index}-without_text`}
                 showArrow
                 positioning={{ placement: 'right' }}
                 content={(
                   <Text fontWeight={'500'} fontSize={'16px'}>
                     {value.title}
                   </Text>
                 )}
                 colorPalette={'white'}
                 dir={giveDir()}
                 textAlign={'center'}
                 borderRadius={5}>
          <Center py={2}
                  mx={2}
                  my={'auto'}
                  color={'white'}
                  className={value.section === pagesSlice.page_name && 'box_shadow'}
                  backgroundColor={value.section === pagesSlice.page_name ? `rgba(${GOLD_BG_COLOR}, 0.6)` : 'transparent'}
                  _hover={{
                    backgroundColor: value.section !== pagesSlice.page_name && `rgba(${GOLD_BG_COLOR}, 0.6)`,
                  }}
                  cursor={value.section === pagesSlice.page_name ? 'default' : 'pointer'}
                  onClick={() => {
                    if (value.section !== pagesSlice.page_name) {
                      value.method();
                    }
                  }}>
            {value.icon({
              size: '1.9rem',
              color: value.section === pagesSlice.page_name ? TURQUOISE_COLOR : 'white',
            })}
          </Center>
        </Tooltip>
      ) : (
        <PopoverRoot key={index}
                     lazyMount
                     positioning={{ placement: 'right-start' }}
                     closeOnEscape={true}
                     closeOnBlur={true}
                     trigger={'hover'}>
          <PopoverTrigger asChild>
            <Button my={0.5}
                    w={'100%'}
                    color={'white'}
                    className={hasPageNameMatch(value.items, pagesSlice.page_name) && 'box_shadow'}
                    backgroundColor={hasPageNameMatch(value.items, pagesSlice.page_name) ? `rgba(${GOLD_BG_COLOR}, 0.6)` : 'transparent'}
                    _hover={{
                      backgroundColor: value.section !== pagesSlice.page_name && `rgba(${GOLD_BG_COLOR}, 0.6)`,
                    }}>
              <Center my={'auto'}>
                {value.icon({
                  size: '1.9rem',
                  color: hasPageNameMatch(value.items, pagesSlice.page_name) ? TURQUOISE_COLOR : 'white',
                })}
              </Center>
            </Button>
          </PopoverTrigger>
          <PopoverContent css={{ '--popover-bg': colorMode === 'light' ? MENU_BACKGROUND_LIGHT : MENU_BACKGROUND_DARK }}>
            <PopoverArrow bgolor={'black'} />

            <PopoverBody dir={giveDir()}>
              <ListExpanded list={value.items} onClose={() => null} />
            </PopoverBody>
          </PopoverContent>
        </PopoverRoot>
      )
  ));
});
