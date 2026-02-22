import { Box } from '@chakra-ui/react';
import celebrationAnimation from '../../../assets/Lottie/celebration2';
import Lottie from 'react-lottie';
import { memo, useState } from 'react';

export const useCelebration = () => {
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationTime = 5000;

  const handleClickShowCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, celebrationTime);
  };

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: celebrationAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const Component = memo(function Component() {
    return showCelebration && (
      <Box position="fixed"
           top={0}
           left={0}
           width="100vw"
           height="100vh"
           display="flex"
           alignItems="center"
           justifyContent="center"
           zIndex={'9000 !important'}>
        <Box width={'600px'} height={'600px'}>
          <Lottie options={defaultOptions} height="100%" width="100%" isClickToPauseDisabled={true} speed={1} />
        </Box>
      </Box>
    );
  });

  return {
    Component,
    handleClickShowCelebration,
  };
};
