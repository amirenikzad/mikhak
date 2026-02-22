import { Box, Grid, GridItem, HStack, Stack, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  showToast,
  handleEnter,
  checkStatus,
  handleErrors,
  promiseToast,
  giveMeCaptcha,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../Base/BaseFunction';
import { GetCaptcha } from '../../Base/GetCaptcha';
import { Base } from '../Base';
import { useNavigate } from 'react-router';
import { AUTHENTICATION_ROUTE, FORGET_PASSWORD_ROUTE, LOGIN_ROUTE } from '../../Base/BaseRouts';
import { HaveAccount } from '../../Base/Extensions.jsx';
import { giveDir, giveText } from '../../Base/MultiLanguages/HandleLanguage';
import { setCaptchaInput } from '../../../store/features/captchaSlice';
import { fetchWithAxios } from '../../Base/axios/FetchAxios.jsx';
import FloatingLabelInput from '../../Base/CustomComponets/FloatingLabelInput.jsx';
import { setIsFetchingResetPassword } from '../../../store/features/isLoadingSlice.jsx';
import { motion } from 'motion/react';
import { EyeIconPassword } from '../../Base/CustomComponets/EyeIconPassword.jsx';
import { RefreshIcon } from '../../Base/CustomIcons/RefreshIcon.jsx';
import { KeyIcon } from '../../Base/CustomIcons/KeyIcon.jsx';
import { BarcodeIcon } from '../../Base/CustomIcons/BarcodeIcon.jsx';
import { useTimer } from 'react-timer-hook';

export default function ResetPassword() {
  const [resetPasswordForm, setResetPasswordForm] = useState({
    code: { value: '', isInvalid: false },
    password: { value: '', isInvalid: false },
    confirmPassword: { value: '', isInvalid: false },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResendCodeActive, setIsResendCodeActive] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const forgetPasswordSlice = useSelector(state => state.forgetPasswordSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const captchaSlice = useSelector(state => state.captchaSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const buttonId = useMemo(() => 'reset_password_submit_id', []);

  const expiryTimestamp = useCallback(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 120); // 2 * 60 seconds
    return time;
  }, []);

  const {
    seconds,
    minutes,
    restart,
  } = useTimer({
    expiryTimestamp: expiryTimestamp(),
    onExpire: () => {
      setIsResendCodeActive(true);
    },
    interval: 20,
  });

  const onReset = () => {
    const time = expiryTimestamp();
    restart(time);
    setIsResendCodeActive(false);
  };

  useEffect(() => {
    if (!forgetPasswordSlice.email.value) {
      navigate(`${AUTHENTICATION_ROUTE}${FORGET_PASSWORD_ROUTE}`);
    }
  }, [forgetPasswordSlice.email]);

  const RefreshCodeAxios = useCallback(() => {
    if (forgetPasswordSlice.email !== '') {
      const toastId = promiseToast();
      setIsResendingCode(true);

      fetchWithAxios.post(`/forgot_password?email=${forgetPasswordSlice.email.value}`, {}, {
        headers: {
          'id': captchaSlice.id,
          'captcha': captchaSlice.captchaInput,
        },
      }).then((response) => {
        if (checkStatus({ status: response.data.status })) {
          onReset();
        }
        updatePromiseToastSuccessWarningInfo({ toastId, response });

      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setCaptchaInput(''));
        giveMeCaptcha(dispatch);
        setIsResendingCode(false);
      });
    } else {
      navigate(`${AUTHENTICATION_ROUTE}${FORGET_PASSWORD_ROUTE}`);
    }
  }, [forgetPasswordSlice.email, captchaSlice.id, captchaSlice.captchaInput]);

  const resetPasswordAxios = useCallback(() => {
    if (resetPasswordForm.code.value === '' || resetPasswordForm.password.value === '' || resetPasswordForm.confirmPassword.value === '' || captchaSlice.captchaInput === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(resetPasswordForm, setResetPasswordForm, ['code', 'password', 'confirmPassword']);

    } else if (resetPasswordForm.password.value !== resetPasswordForm.confirmPassword.value) {
      showToast({
        title: giveText(30),
        description: giveText(28),
        status: 2,
      });
      handleErrors(resetPasswordForm, setResetPasswordForm, ['password', 'confirmPassword'], true);

    } else {
      if (forgetPasswordSlice.email !== '') {
        const toastId = promiseToast();
        dispatch(setIsFetchingResetPassword(true));

        fetchWithAxios.post(`/reset_password?code=${resetPasswordForm.code.value}&password=${resetPasswordForm.password.value}&confirm_password=${resetPasswordForm.confirmPassword.value}`, {}, {
          headers: {
            'id': captchaSlice.id,
            'captcha': captchaSlice.captchaInput,
          },
        }).then((response) => {
          if (checkStatus({ status: response.data.status })) {
            navigate(`${AUTHENTICATION_ROUTE}${LOGIN_ROUTE}`);
          } else {
            dispatch(setCaptchaInput(''));
            giveMeCaptcha(dispatch);
          }
          updatePromiseToastSuccessWarningInfo({ toastId, response });

        }).catch((error) => {
          dispatch(setCaptchaInput(''));
          giveMeCaptcha(dispatch);
          updatePromiseToastError({ toastId, error });

        }).finally(() => {
          dispatch(setIsFetchingResetPassword(false));
        });
      } else {
        navigate(`${AUTHENTICATION_ROUTE}${FORGET_PASSWORD_ROUTE}`);
      }
    }
  }, [resetPasswordForm, captchaSlice.captchaInput, captchaSlice.id, forgetPasswordSlice.email]);

  const changeInputs = useCallback((event) => {
    const { name, value } = event.target;
    setResetPasswordForm((prev) => ({ ...prev, [name]: { ...prev[name], value, isInvalid: false } }));
  }, []);

  return (
    <Base buttonId={buttonId}
          submitTitle={giveText(56)}
          title={giveText(55)}
          submitFunc={resetPasswordAxios}
          noHeadingImage={false}
          hasCancelButton={false}
          hasLogo={true}
          hasTitleTopAbsolute={true}
          ml={0}
          mr={0}
          w={'600px'}
          isLoadingSubmitButton={isLoadingSlice.isFetchingResetPassword}
          Content={(
            <Stack gap={2}>
              <FloatingLabelInput label={giveText(57)}
                                  name={'code'}
                                  dir={'ltr'}
                                  value={resetPasswordForm.code.value}
                                  invalid={resetPasswordForm.code.isInvalid}
                                  type={'text'}
                                  mx={3}
                                  autoFocus
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<BarcodeIcon width={'1rem'} />}
                                  onKeyDown={(event) => handleEnter(event, buttonId)}
                                  onChange={changeInputs} />

              <FloatingLabelInput label={giveText(58)}
                                  name={'password'}
                                  dir={'ltr'}
                                  value={resetPasswordForm.password.value}
                                  invalid={resetPasswordForm.password.isInvalid}
                                  pr={'4.5rem'}
                                  mx={3}
                                  placeContent={giveText(15)}
                                  type={showPassword ? 'text' : 'password'}
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<KeyIcon width={'1rem'} />}
                                  hasInputRightElement={true}
                                  InputRightElement={(
                                    <EyeIconPassword isOn={showPassword}
                                                     onClick={() => setShowPassword(!showPassword)} />
                                  )}
                                  onKeyDown={(event) => handleEnter(event, buttonId)}
                                  onChange={changeInputs} />

              <FloatingLabelInput label={giveText(16)}
                                  name={'confirmPassword'}
                                  value={resetPasswordForm.confirmPassword.value}
                                  invalid={resetPasswordForm.confirmPassword.isInvalid}
                                  pr={'4.5rem'}
                                  mx={3}
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<KeyIcon width={'1rem'} />}
                                  hasInputRightElement={true}
                                  InputRightElement={(
                                    <EyeIconPassword isOn={showConfirmPassword}
                                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                                  )}
                                  onKeyDown={(event) => handleEnter(event, buttonId)}
                                  onChange={changeInputs} />

              <GetCaptcha buttonId={buttonId} />

              <Grid mt={2} templateColumns="repeat(5, 1fr)" gap={4}>
                <GridItem colStart={1} colEnd={4}>
                  <HStack spacing={2} cursor={isResendCodeActive ? 'pointer' : 'default'}
                          onClick={isResendCodeActive ? RefreshCodeAxios : null}>
                    <motion.div animate={{ rotate: isResendingCode ? 360 : 0 }}
                                transition={{ repeat: isResendingCode ? Infinity : 360, duration: 2 }}>
                      <RefreshIcon width={'1rem'} />
                    </motion.div>

                    <Text textAlign={'left'}>{giveText(60)}</Text>
                  </HStack>
                </GridItem>

                <GridItem dir={giveDir(true)} colStart={4} colEnd={6}>
                  <Box>
                    <span>{minutes}</span>:<span>{seconds}</span>
                  </Box>
                </GridItem>
              </Grid>
            </Stack>
          )}
          Extension={<HaveAccount />}
    />
  );
};
