import { Grid, GridItem, Image, Button, Flex, Box } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { giveMeCaptcha, handleEnter } from './BaseFunction';
import { setCaptchaInput } from '../../store/features/captchaSlice';
import { giveText } from './MultiLanguages/HandleLanguage';
import { useEffect, useState } from 'react';
import FloatingLabelInput from './CustomComponets/FloatingLabelInput.jsx';
import { Tooltip } from '../ui/tooltip.jsx';
import { CodeIcon } from './CustomIcons/CodeIcon.jsx';
import { RepeatIcon } from './CustomIcons/RepeatIcon.jsx';

export const GetCaptcha = ({ buttonId, externalRefresh }) => {
  const captchaSlice = useSelector(state => state.captchaSlice);
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(100);
  const [expired, setExpired] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  // giveMeCaptcha(dispatch);

  useEffect(() => {
    giveMeCaptcha(dispatch);
    setProgress(100);
    setExpired(false);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          setExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - (100 / 60);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);
  // }, [dispatch, refreshKey]);

  useEffect(() => {
    dispatch(setCaptchaInput(''));
    // giveMeCaptcha(dispatch);
    // handleRefresh();
  }, []);

  const handleRefresh = () => {
    giveMeCaptcha(dispatch);
    setProgress(100);
    setExpired(false);
    setRefreshKey(prev => prev + 1);
    // if (externalRefresh) externalRefresh();
  };

  return (
    <Grid templateColumns="repeat(9, 1fr)" gap={1}>
      <GridItem colSpan={7} my="auto">
        <FloatingLabelInput
          label={giveText(75)}
          value={captchaSlice.captchaInput}
          dir="ltr"
          mx={0}
          w="90%"
          hasInputLeftElement={true}
          InputLeftElementIcon={<CodeIcon width="1rem" />}
          onKeyDown={(event) => handleEnter(event, buttonId)}
          onChange={(event) => dispatch(setCaptchaInput(event.target.value))}
        />
      </GridItem>

      <GridItem colSpan={2} dir="ltr" bg="white" w="100px" borderRadius="4px">
        <Flex align="center" position="relative" justify="center">
          {/* <Box
            position="absolute"
            top="0"
            left="0"
            h="3px"
            w={`${progress}%`}
            bg="blue.500"
            borderTopLeftRadius="4px"
            borderTopRightRadius="4px"
            transition="width 1s linear"
          /> */}
          <Box
            position="absolute"
            top="0"
            left="0"
            h="3px"
            w={`${progress}%`}
            bg={
              progress > 66
                ? 'green.400'  
                : progress > 33
                ? 'yellow.400'  
                : 'red.500'   
            }
            borderTopLeftRadius="4px"
            borderTopRightRadius="4px"
            transition="width 1s linear, background-color 0.3s ease"
          />


          <Tooltip showArrow content={giveText(76)} bg="black" color="white" fontWeight="bold">
            <Image
              loading="lazy"
              w="100px"
              src={`data:image/png;base64,${captchaSlice.captchaImage}`}
              cursor="pointer"
              borderRadius="4px"
              onClick={handleRefresh}
            />
          </Tooltip>
          <Button
            position="absolute"
            left="70px"
            top="20px"
            backgroundColor="transparent"
            _hover={{ transform: 'scale(0.9)', bg: 'transparent' }}
            transition="transform 0.2s"
            onClick={handleRefresh}
            zIndex={99}
          >
            <RepeatIcon width="1.2rem" height="1.2rem" color="blue.800" />
          </Button>

          {expired && (
            <Flex
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              bg="rgba(0,0,0,0.5)"
              borderRadius="4px"
              align="center"
              justify="center"
              zIndex={90}
              cursor="pointer"
              onClick={handleRefresh}
            >
              <RepeatIcon width="2.5rem" height="2.5rem" color="blue.300" position="absolute" top="2.5" left="9"/>
            </Flex>
          )}
        </Flex>
      </GridItem>
    </Grid>
  );
};
