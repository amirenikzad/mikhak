import { Center, Image, Stack, Text } from '@chakra-ui/react';
import { giveText } from './MultiLanguages/HandleLanguage';
import logo from '../../assets/icons/access_denied.webp';

export const AccessDenied = () => (
  <Center>
    <Stack position={'absolute'} top={'10dvh'}>
      <Center><Image loading="lazy" src={logo} w={'350px'}/></Center>
      <Center><Text fontSize={'20px'} fontWeight={'700'}>{giveText(50)}</Text></Center>
    </Stack>
  </Center>
);
