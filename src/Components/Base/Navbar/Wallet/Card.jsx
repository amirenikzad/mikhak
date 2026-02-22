import { Box, HStack, Image, Text } from '@chakra-ui/react';
import map_image from '../../../../assets/images/map.webp';
import chip_image from '../../../../assets/images/chip.webp';
import pattern_image from '../../../../assets/images/pattern.webp';
import { commaForEvery3Digit, showToast } from '../../BaseFunction.jsx';
import { giveText } from '../../MultiLanguages/HandleLanguage.jsx';
import suspend_image from '../../../../assets/images/suspend.webp';
import { memo, useState } from 'react';
import { CopyIcon } from '../../CustomIcons/CopyIcon.jsx';
import { useCopyToClipboard } from '../../CustomHook/useCopyToClipboard.jsx';

export const Card = memo(function Card({ data, suspended = false }) {
  const [isClicked, setIsClicked] = useState(true);
  const [state, copyToClipboard] = useCopyToClipboard();

  const copyTheText = () => {
    copyToClipboard(data?.wallet_number[0]);
    showToast({
      title: state.error ? giveText(291) : giveText(292),
      description: state.error
        ? <p>Unable to copy value: {state.error.message}</p>
        : state.value && <p>Copied {state.value}</p>,
      status: state.error ? 1 : 0,
    });
  };

  const onClick = () => {
    isClicked ? setIsClicked(false) : setIsClicked(true);
  };

  return <>
    {suspended &&
      <Image mt={2}
             src={suspend_image}
             w={'400px'}
             h={'220px'}
             position={'absolute'}
             zIndex={'9'} />
    }

    <Box filter={`brightness(${suspended ? 50 : 100}%)`}>
      <Box backgroundColor={'transparent'} className="container">
        <Box className="card">
          <Box transform={isClicked ? 'rotateY(0deg)' : 'rotateY(-180deg)'} className="card-inner">
            <Box className="front" dir={'ltr'}>
              <Image loading="lazy" onClick={onClick} alt={'test'} src={map_image} className="map-img" />

              <Box onClick={onClick} className="row">
                <Image loading="lazy" alt={'test'} src={chip_image} width="50px" height="50px" />
              </Box>

              <HStack spacing={1}
                      fontSize={'1rem'}
                      transition={'all 0.2s ease'}
                      _hover={{ fontSize: '1.1rem' }}>
                <Box mt={6} onClick={copyTheText}>
                  <Text fontSize={'22px'}>{data?.wallet_number}</Text>
                </Box>

                <Box mt={3}>
                  <CopyIcon width={'1rem'} color={'white'} />
                </Box>
              </HStack>

              <Box onClick={onClick} className="row card-holder">
                <Text>{giveText(189)}</Text>
                <Text>{giveText(187)}</Text>
              </Box>
              <Box onClick={onClick} className="row name">
                <Text>{data?.name}</Text>
                <Text>{commaForEvery3Digit(data?.amount)} {giveText(213)}</Text>
              </Box>
            </Box>

            <Box onClick={onClick} className="back">
              <Image loading="lazy" alt={'map-img'} src={map_image} className="map-img" />
              <Box className="bar"></Box>
              <Box className="row card-cvv">
                <Box>
                  <Image loading="lazy" alt={'test'} src={pattern_image} />
                </Box>
                <Text>{data?.wallet_id}</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  </>;
});
