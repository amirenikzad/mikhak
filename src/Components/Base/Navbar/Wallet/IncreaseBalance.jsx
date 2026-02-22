import { Box, Button, ButtonGroup, Center, HStack, Text } from '@chakra-ui/react';
import { giveDir, giveText } from '../../MultiLanguages/HandleLanguage.jsx';
import { commaForEvery3Digit, handleEnter } from '../../BaseFunction.jsx';
import { useMemo, useState } from 'react';
import { numberToLetterPersian } from '../../NumberToLetter/NumberToLetterPersian.jsx';
import { Card } from './Card.jsx';
import { numberToLetterEnglish } from '../../NumberToLetter/NumberToLetterEnglish.jsx';
import FloatingLabelInput from '../../CustomComponets/FloatingLabelInput.jsx';
import { CarouselSlider } from '../../CarouselSlider.jsx';
import { AddCircularFillIcon } from '../../CustomIcons/AddCircularFillIcon.jsx';

export default function IncreaseBalance ({ data, chargeWalletAxios, ids, onCloseModal }) {
  const [value, setValue] = useState(0);
  const amounts = useMemo(() => [10000, 20000, 50000, 100000, 200000], []);
  const buttonId = useMemo(() => 'increase_balance_button_id', []);

  const buttonStyle = {
    backgroundImage: 'linear-gradient(45deg, #0045c7, #ff2c7d)',
    color: 'white',
    paddingX: '8px',
  };

  return (
    <>
      <Box mb={3}>
        <CarouselSlider
          Content={
            data?.map((dataValue, index) => (
              <Card data={dataValue} key={index} />
            ))
          } />
      </Box>

      <FloatingLabelInput label={giveText(196)}
                          value={commaForEvery3Digit(value)}
                          mx={3}
                          onChange={(e) => setValue(e.target.value.replace(/[^\d.-]/g, ''))}
                          onKeyDown={(event) => handleEnter(event, buttonId)} />

      <Text dir={giveDir()} my={1} fontSize={'14px'} mx={1}>
        {giveDir() === 'rtl' ? numberToLetterPersian(value) : numberToLetterEnglish(value)}
      </Text>

      <Center>
        <ButtonGroup gap={1} size={'sm'}>
          {amounts?.map((amount) => (
            <Button {...buttonStyle}
                    _hover={{ ...buttonStyle }}
                    onClick={() => setValue(prevState => prevState + amount)}>
              <HStack spacing={1}>
                <Text>{amount}</Text>

                <AddCircularFillIcon width={'1rem'} />
              </HStack>
            </Button>
          ))}
        </ButtonGroup>
      </Center>

      <Center mt={3}>
        <HStack w={'100%'}>
            <Button size={'xs'} w={'50%'}
                    colorPalette={'red'}
                    onClick={onCloseModal}
                    >
              {giveText(31)}
            </Button>

                <Button id={buttonId}
                        colorPalette={'blue'}
                        px={5}
                        // w={'200px'}
                         w={'50%'}
                        size={'xs'}
                        className={'box_shadow'}
                        onClick={() => chargeWalletAxios({ value, user_ids: ids })}>
                  {/* {giveText(17)} */}
                  {giveText(186)}
                </Button>
          </HStack>

      </Center>
    </>
  );
};
