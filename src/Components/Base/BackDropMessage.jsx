import { Center, Text, VStack } from '@chakra-ui/react';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { giveDir } from './MultiLanguages/HandleLanguage';
import { memo } from 'react';

export const BackDropMessage = memo(function BackDropMessage({ open, text = '' }) {
  if (!open) return null;

  const direction = giveDir();

  return (
    <Center dir={direction}>
      <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={open}>
        <VStack>
          <CircularProgress color="inherit" />

          {text &&
            <Text color={'white'} fontWeight={'500'} fontSize={'25px'} textAlign={'center'}>{text}</Text>
          }
        </VStack>
      </Backdrop>
    </Center>
  );
});
