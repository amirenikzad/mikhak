import { Center, HStack, Image, Stack, Text, Box } from '@chakra-ui/react';
import logo from '../../assets/icons/Logo.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AUTHENTICATION_ROUTE, LOGIN_ROUTE } from './BaseRouts.jsx';
import CircularProgress from '@mui/material/CircularProgress';

export default function NotFound() {
  const [progressCounter, setProgressCounter] = useState(0);
  const [counter, setCounter] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    if (progressCounter > 95) {
      navigate(`${AUTHENTICATION_ROUTE}${LOGIN_ROUTE}`);
    }
  }, [progressCounter]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgressCounter((prevProgress) => (prevProgress + 32 >= 100 ? 0 : prevProgress + 32));
    }, 1000);

    const timer2 = setInterval(() => {
      setCounter((prevProgress) => prevProgress - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(timer2);
    };
  }, []);

  return (
    <Center h={'100dvh'} dir={'rtl'} color={'black'}>
      <Stack>
        <HStack>
          <Image w={'90px'} src={logo} />

          <Stack gap={0}>
            <Text fontSize={'18px'} fontWeight={'800'}>صفحه مورد نظر یافت نشد</Text>
            <Text fontSize={'16px'}>در حال انتقال به سامانه مدیریت یکپارچه خدمات کارکنان</Text>
          </Stack>
        </HStack>

        <Center dir={'ltr'}>
          <Box sx={{ position: 'relative' }}>
            <CircularProgress variant="determinate" value={progressCounter} />
            <Text mt={'-40px'} ml={'16px'}>{counter}</Text>
          </Box>
        </Center>
      </Stack>
    </Center>
  );
};
