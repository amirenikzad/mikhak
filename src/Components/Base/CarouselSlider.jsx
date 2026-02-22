import { useCallback, useEffect, useState } from 'react';
import { Box, Center, HStack } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { giveDir } from './MultiLanguages/HandleLanguage.jsx';
import { useColorMode } from '../ui/color-mode.jsx';
import { ChevronRightOutlineIcon } from './CustomIcons/ChevronRightOutlineIcon.jsx';
import { ChevronLeftOutlineIcon } from './CustomIcons/ChevronLeftOutlineIcon.jsx';
import { DotIcon } from './CustomIcons/DotIcon.jsx';

export const CarouselSlider = ({ Content, hasDot = true, refreshPage }) => {
  const [page, setPage] = useState(0);
  const { colorMode } = useColorMode();

  const nextSlideMethod = useCallback(() => {
    if (page + 1 < Content.length) {
      setPage(page + 1);
    } else {
      setPage(0);
    }
  }, [page, Content]);

  const previousSlideMethod = useCallback(() => {
    if (page - 1 >= 0) {
      setPage(page - 1);
    } else {
      setPage(Content.length - 1);
    }
  }, [page, Content]);

  const setPageByDot = useCallback((input_page) => {
    setPage(input_page);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [refreshPage]);

  if (!Content) return <></>;

  return <>
    <Center>
      <HStack key={page} dir={'ltr'}>
        {Content.length > 1 && <ChevronLeftOutlineIcon width={'1rem'}
                                                       onClick={previousSlideMethod}
                                                       cursor={'pointer'} />}

        <Box dir={giveDir()}>
          {Content[page]}
        </Box>

        {Content.length > 1 && <ChevronRightOutlineIcon width={'1rem'}
                                                        onClick={nextSlideMethod}
                                                        cursor={'pointer'} />}

      </HStack>
    </Center>

    {(hasDot && Content.length > 1) &&
      <Center mt={1}>
        <HStack spacing={0} key={page}>
          {Content.map((value, index) => (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DotIcon key={index}
                       cursor={'pointer'}
                       fontSize={'1rem'}
                       color={page === index
                         ? (colorMode === 'light' ? 'black' : 'white')
                         : (colorMode === 'light' ? 'gray.400' : 'gray.400')
                       }
                       onClick={() => setPageByDot(index)}
                       width={'1rem'} />
            </motion.div>
          ))}
        </HStack>
      </Center>
    }
  </>;
};
