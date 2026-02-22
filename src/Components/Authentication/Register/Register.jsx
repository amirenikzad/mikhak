import { Button, HStack } from '@chakra-ui/react';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  showToast,
  checkStatus,
  handleErrors,
  promiseToast,
  giveMeCaptcha,
  validateEmail,
  checkEmailIsValid,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo, giveMessage,
} from '../../Base/BaseFunction';
import { useDispatch, useSelector } from 'react-redux';
import { setCaptchaInput } from '../../../store/features/captchaSlice';
import { Base } from '../Base';
import { HaveAccount } from '../../Base/Extensions.jsx';
import { setCroppedImage } from '../../../store/features/cropImageSlice';
import { giveDir, giveText } from '../../Base/MultiLanguages/HandleLanguage';
import { fetchWithAxios } from '../../Base/axios/FetchAxios.jsx';
import { setIsFetchingRegister } from '../../../store/features/isLoadingSlice.jsx';
import { toaster } from '../../ui/toaster.jsx';

const Step1 = lazy(() => import('./Step1'));
const Step2 = lazy(() => import('./Step2'));
const Step3 = lazy(() => import('./Step3'));

export default function Register({
                                   w = '600px',
                                   showIsAdmin = false,
                                   showIsActive = false,
                                   showExtra = true,
                                   hasLogo = false,
                                   showCancel = false,
                                   do_after,
                                   onCloseModal,
                                   hasAccessToAddAdminUser = false,
                                 }) {
  const captchaSlice = useSelector(state => state.captchaSlice);
  const cropImageSlice = useSelector(state => state.cropImageSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const [checkingUserExist, setCheckingUserExist] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    username: { value: '', isInvalid: false },
    password: { value: '', isInvalid: false },
    confirmPassword: { value: '', isInvalid: false },
    email: { value: '', isInvalid: false },
    firstName: { value: '', isInvalid: false },
    lastName: { value: '', isInvalid: false },
    description: { value: '', isInvalid: false },
    isEnable: { value: true, isInvalid: false },
    admin: { value: false, isInvalid: false },
  });

  const [activeStep, setActiveStep] = useState(0);
  const buttonId = useMemo(() => 'register_submit_id', []);
  const dispatch = useDispatch();

  const errorHandlingNextPage = () => {
    if (activeStep === 0) {
      if (!registerForm.username.value) {
        showToast({
          title: giveText(30),
          description: giveText(26),
          status: 2,
        });
        handleErrors(registerForm, setRegisterForm, ['username']);
        return false;
      }
    } else if (activeStep === 1) {
      if (!registerForm.email.value || !registerForm.firstName.value || !registerForm.lastName.value) {
        showToast({
          title: giveText(30),
          description: giveText(26),
          status: 2,
        });
        handleErrors(registerForm, setRegisterForm, ['email', 'firstName', 'lastName']);
        return false;
      }
      return checkEmailIsValid({
        email: registerForm.email.value, doIfValidate: () => {
          handleErrors(registerForm, setRegisterForm, ['email'], true);
        },
      });
    }

    return true;
  };

  const registerAxios = () => {
    if (registerForm.username.value === ''
      || registerForm.password.value === ''
      || registerForm.confirmPassword.value === ''
      || registerForm.email.value === ''
      || registerForm.firstName.value === ''
      || registerForm.lastName.value === ''
      || captchaSlice.captchaInput === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(registerForm, setRegisterForm, ['username', 'password', 'confirmPassword', 'email', 'firstName', 'lastName']);

    } else if (validateEmail(registerForm.email.value)) {
      showToast({
        title: giveText(30),
        description: giveText(27),
        status: 2,
      });
      handleErrors(registerForm, setRegisterForm, ['email'], true);

    } else if (registerForm.password.value !== registerForm.confirmPassword.value) {
      showToast({
        title: giveText(30),
        description: giveText(28),
        status: 2,
      });
      handleErrors(registerForm, setRegisterForm, ['password', 'confirmPassword'], true);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingRegister(true));

      fetchWithAxios.post(hasAccessToAddAdminUser ? '/user' : '/user/manual', {
        'username': registerForm.username.value,
        'password': registerForm.password.value,
        'email': registerForm.email.value,
        'name': registerForm.firstName.value,
        'family': registerForm.lastName.value,
        'description': registerForm.description.value,
        'disabled': !registerForm.isEnable.value,
        'admin': registerForm.admin.value,
        'extension': 'image/jpeg',
        'profile_pic': cropImageSlice.croppedImage === null ? '' : cropImageSlice.croppedImage,
      }, {
        headers: {
          'id': captchaSlice.id,
          'captcha': captchaSlice.captchaInput,
        },
      }).then((response) => {
        if (checkStatus({ status: response.data.status })) {
          do_after && do_after();
        }
        updatePromiseToastSuccessWarningInfo({ toastId, response });

      }).catch((error) => {
        giveMeCaptcha(dispatch);
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setCaptchaInput(''));
        dispatch(setIsFetchingRegister(false));
      });
    }
  };

  const checkIfUserExist = () => {
    setCheckingUserExist(true);

    fetchWithAxios.get(`/user_exist?username=${registerForm.username.value}`, {
      headers: {
        'id': captchaSlice.id,
      },
    }).then((response) => {
      if (response.data.status === 'success') {
        setActiveStep(activeStep + 1);
      } else {
        toaster.create({
          title: giveText(30),
          description: giveMessage(response.data.message),
          status: response.data.status,
          type: response.data.status,
          duration: 3000,
        });
        handleErrors(registerForm, setRegisterForm, ['username'], true);
      }
    }).catch((error) => {
      handleErrors(registerForm, setRegisterForm, ['username'], true);
      toaster.create({
        type: 'error',
        title: giveText(30),
        description: error.message,
        dir: giveDir(),
        duration: 3000,
      });
    }).finally(() => {
      setCheckingUserExist(false);
    });
  };

  const changeInputs = useCallback((event) => {
    const { name, value } = event.target;
    setRegisterForm((prev) => ({ ...prev, [name]: { ...prev[name], value, isInvalid: false } }));
  }, []);

  const changeSwitch = useCallback((event) => {
    const { name, checked } = event.target;
    setRegisterForm((prev) => ({ ...prev, [name]: { ...prev[name], value: checked, isInvalid: false } }));
  }, []);

  useEffect(() => {
    dispatch(setCroppedImage(null));
  }, []);

  return (
    <Base buttonId={buttonId}
          submitTitle={giveText(29)}
          title={giveText(29)}
          px={7}
          mr={0}
          ml={0}
          w={w}
          noHeadingImage={!activeStep}
          hasCancelButton={false}
          hasLogo={hasLogo}
          hasTitle={false}
          hasTitleTopAbsolute={true}
          Content={<>
            {activeStep === 0 &&
              <Suspense fallback={'loading...'}>
                <Step1 registerForm={registerForm} buttonId={buttonId} changeInputs={changeInputs} />
              </Suspense>
            }

            {activeStep === 1 &&
              <Suspense fallback={'loading...'}>
                <Step2 registerForm={registerForm} changeInputs={changeInputs} buttonId={buttonId} />
              </Suspense>
            }

            {activeStep === 2 &&
              <Suspense fallback={'loading...'}>
                <Step3 showIsActive={showIsActive}
                       showIsAdmin={showIsAdmin}
                       registerForm={registerForm}
                       changeInputs={changeInputs}
                       changeSwitch={changeSwitch}
                       buttonId={buttonId} />
              </Suspense>
            }
          </>}
          Extension={showExtra && <HaveAccount />}
          SubmitButton={(
            <HStack spacing={1}>
              {showCancel && activeStep === 0 &&
                <Button w={'50%'}
                        colorPalette={'red'}
                        onClick={onCloseModal}>
                  {giveText(31)}
                </Button>
              }
              {activeStep > 0 && activeStep <= 2 &&
                <Button w={'50%'}
                        colorPalette={'red'}
                        onClick={() => setActiveStep(activeStep - 1)}>
                  {giveText(32)}
                </Button>
              }
              {activeStep < 2 &&
                <Button w={showCancel || activeStep > 0 ? '50%' : '50%'}
                        loading={checkingUserExist}
                        mx={'auto'}
                        colorPalette={'blue'}
                        id={`${buttonId}_${activeStep}`}
                        onClick={() => {
                          if (errorHandlingNextPage()) {
                            if (activeStep > 0) {
                              setActiveStep(activeStep + 1);
                            } else {
                              checkIfUserExist();
                            }
                          }
                        }}>
                  {giveText(33)}
                </Button>
              }
              {activeStep === 2 &&
                <Button id={`${buttonId}_2`}
                        w={'50%'}
                        colorPalette={'blue'}
                        loading={isLoadingSlice.isFetchingRegister}
                        loadingText={giveText(116)}
                        onClick={registerAxios}>
                  {giveText(17)}
                </Button>
              }
            </HStack>
          )} />
  );
}
