



import { useSelector } from 'react-redux';
import { Box, Center, Flex, HStack, Text } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { giveDir } from '../MultiLanguages/HandleLanguage.jsx';
import { GOLD_BG_COLOR, TURQUOISE_COLOR } from '../BaseColor.jsx';
import { hasPageNameMatch, lightenColor } from './baseFunction.jsx';
import { NewOption } from '../Extensions.jsx';
import { AccordionItem, AccordionRoot, AccordionItemContent, AccordionItemTrigger } from '../../ui/accordion.jsx';

export const ExpandMenu = memo(function ExpandMenu({ list, fontSize = 15, ml = 0, recursive_index = 1 }) {
  const pagesSlice = useSelector((state) => state.pagesSlice);
  // const [expandedItems, setExpandedItems] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);


  // const handleAccordionChange = (clickedItem) => {
  //   setExpandedItems((prevExpanded) =>
  //     prevExpanded.includes(clickedItem)
  //       ? prevExpanded.filter((item) => item !== clickedItem)
  //       : [...prevExpanded, clickedItem],
  //   );
  // };

  const handleAccordionChange = (clickedItem) => {
    setExpandedItem((prev) => (prev === clickedItem ? null : clickedItem));
  };


  const AccordionItemBody = ({ value = {}, isNew }) => (
    <HStack spacing={1}>
      <Center mx={1}>
        {value.icon({
          color: hasPageNameMatch(value.items, pagesSlice.page_name)
            ? lightenColor(TURQUOISE_COLOR, recursive_index)
            : 'white',
        })}
      </Center>

      <Box color={hasPageNameMatch(value.items, pagesSlice.page_name)
        ? lightenColor(TURQUOISE_COLOR, recursive_index)
        : 'white'}>
        <Text textAlign={giveDir() === 'rtl' ? 'right' : 'left'} fontWeight="500" fontSize={`${fontSize}px`}>
          {value.title}
          {isNew && <NewOption cursor="pointer" />}
        </Text>
      </Box>
    </HStack>
  );

  const SingleItemBody = memo(function SingleItemBody({ value = {}, index, isNew = false }) {
    return (
      <Flex color={value.section === pagesSlice.page_name ? TURQUOISE_COLOR : 'white'}
            key={`${value.title}-single${index}`}
            p={2}
            ml={ml}
            my={1}
            dir={giveDir()}
            w="100%"
            borderRadius={9}
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
        <Center mx={2}>
          {value.icon({ color: value.section === pagesSlice.page_name ? TURQUOISE_COLOR : 'white' })}
        </Center>
        <Text textAlign={giveDir() === 'rtl' ? 'right' : 'left'} fontWeight="500" fontSize={`${fontSize}px`}
              pt="0.3rem">
          {value.title}
          {isNew && <NewOption cursor="pointer" />}
        </Text>
      </Flex>
    );
  });

  return (
    // <AccordionRoot multiple value={expandedItems} onValueChange={(e) => handleAccordionChange(e.value)}>
    <AccordionRoot
                  value={expandedItem ? [expandedItem] : []}
                  // onValueChange={(e) => handleAccordionChange(e.value?.[0])}
                  type="single"
                  collapsible
                  onValueChange={(e) => {
                    const nextValue = e.value?.[0] ?? null;
                    setExpandedItem(nextValue);
                  }}
                >

      {list.map((value, index) =>
        value.type === 'single' ? (
          <SingleItemBody key={index} value={value} index={index} isNew={value.is_new} />
        ) : (
          <AccordionItem key={value.title} value={value.title} borderBottom="none" py={1}>
            <AccordionItemTrigger color="white"
                                  px={3}
                                  py={2}
                                  borderRadius={9}
                                  cursor="pointer"
                                  dir={giveDir()}
                                  className={hasPageNameMatch(value.items, pagesSlice.page_name) && 'box_shadow'}
                                  backgroundColor={hasPageNameMatch(value.items, pagesSlice.page_name) ? `rgba(${GOLD_BG_COLOR}, 0.6)` : 'transparent'}
                                  _hover={{ backgroundColor: `rgba(${GOLD_BG_COLOR}, 0.6)` }}
                                  // onClick={() => handleAccordionChange(value.title)}
                                  >
              <AccordionItemBody value={value} isNew={value.is_new} />
            </AccordionItemTrigger>
            <AccordionItemContent pl={giveDir() === 'rtl' ? 1 : 3} pr={giveDir() === 'rtl' ? 3 : 1} py={1}>
              <ExpandMenu list={value.items}
                          fontSize={fontSize - 1}
                          ml={ml + 1}
                          recursive_index={recursive_index + 1} />
            </AccordionItemContent>
          </AccordionItem>
        ),
      )}
    </AccordionRoot>
  );
});

