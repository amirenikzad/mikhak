import { Route, Routes, useNavigate } from 'react-router';
import { Box, Center, HStack, Image, Text } from '@chakra-ui/react';
import {
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  AUTHENTICATION_ROUTE,
  RESET_PASSWORD_ROUTE,
  FORGET_PASSWORD_ROUTE,
} from '../Base/BaseRouts';
import back_img_dark from '../../assets/images/bg3.webp';
import { Languages } from '../Base/Navbar/Languages';
import { giveDir } from '../Base/MultiLanguages/HandleLanguage.jsx';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { ColorModeButton } from '../ui/color-mode.jsx';
import { lazy, useEffect } from 'react';
import { changeLocation } from '../Base/BaseFunction.jsx';
import { Copyright } from '../Base/Copyright.jsx';

const NotFound = lazy(() => import('../Base/NotFound'));
const Login = lazy(() => import('./Login/Login'));
const Register = lazy(() => import('./Register/Register'));
const ResetPassword = lazy(() => import('./ForgetPassword/ResetPassword'));
const ForgetPassword = lazy(() => import('./ForgetPassword/ForgetPassword'));

export default function RouteAuthentication() {
  const baseSlice = useSelector(state => state.baseSlice);
  const navigate = useNavigate();
  const backgroundImage = back_img_dark;

  useEffect(() => {
    changeLocation();
  }, []);

  return (
    <Box position={'relative'} height={'100vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
      <Box zIndex={1}>
        <HStack position={'absolute'}
                top={4}
                left={giveDir() === 'rtl' ? '' : 5}
                right={giveDir() === 'rtl' ? 5 : ''}>
          <Languages hoverColor={'gray.700'} color={'white'} />
          <ColorModeButton />
        </HStack>

        <Box position={'absolute'}
             bottom={4}
             left={giveDir() === 'ltr' ? '' : 5}
             right={giveDir() === 'ltr' ? 5 : ''}>
          <Text color={'white'} cursor={'default'}>{baseSlice.appVersion}</Text>
        </Box>

        <motion.div initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}>
          <Center spacing={1} h={'100dvh'} my={'auto'}>
            <Routes>
              <Route path={LOGIN_ROUTE} element={<Login />} />
              <Route path={REGISTER_ROUTE}
                     element={<Register hasLogo={true}
                                        hasAccessToAddAdminUser={false}
                                        do_after={() => navigate(`${AUTHENTICATION_ROUTE}${LOGIN_ROUTE}`)} />} />
              <Route path={FORGET_PASSWORD_ROUTE} element={<ForgetPassword />} />
              <Route path={RESET_PASSWORD_ROUTE} element={<ResetPassword />} />
              <Route path={'*'} element={<NotFound />} />
            </Routes>
          </Center>
        </motion.div>
      </Box>

      <Image loading="lazy"
             width={'100%'}
             height={'100dvh'}
             key={backgroundImage}
             position={'absolute'}
             inset={'0'}
             zIndex={0}
             src={backgroundImage}
             className="banner-bg" />

      <Box position={'absolute'} bottom={4}>
        <Text color={'white'} cursor={'default'}>
          <Copyright />
        </Text>
      </Box>
    </Box>
  );
};
