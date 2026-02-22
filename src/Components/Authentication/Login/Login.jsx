import { Stack, HStack, Text } from '@chakra-ui/react';
import { useCallback, useMemo, useState, useEffect } from 'react';
import {
  showToast,
  handleEnter,
  checkStatus,
  handleErrors,
  promiseToast,
  giveMeCaptcha,
  updatePromiseToastError,
  updatePromiseToastError2,
  updatePromiseToastSuccessWarningInfo,
} from '../../Base/BaseFunction';
import { useDispatch, useSelector } from 'react-redux';
import { setCaptchaInput } from '../../../store/features/captchaSlice';
import { useNavigate } from 'react-router';
import { GetCaptcha } from '../../Base/GetCaptcha';
import { Base } from '../Base';
import { ADMIN_ROUTE, DASHBOARD_ROUTE } from '../../Base/BaseRouts';
import { giveText } from '../../Base/MultiLanguages/HandleLanguage';
import { fetchWithAxios } from '../../Base/axios/FetchAxios.jsx';
import FloatingLabelInput from '../../Base/CustomComponets/FloatingLabelInput.jsx';
import { setIsFetchingLogin } from '../../../store/features/isLoadingSlice.jsx';
import { ExtensionLogin } from '../../Base/Extensions.jsx';
import { EyeIconPassword } from '../../Base/CustomComponets/EyeIconPassword.jsx';
import { KeyIcon } from '../../Base/CustomIcons/KeyIcon.jsx';
import { UserOutlineIcon } from '../../Base/CustomIcons/UserOutlineIcon.jsx';
import Checkbox from '@mui/material/Checkbox';
import { useColorMode } from '../../ui/color-mode.jsx';
// import { buildErrorMessage } from 'vite';

export default function Login() {
  const captchaSlice = useSelector(state => state.captchaSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const [loginForm, setLoginForm] = useState({
    username: { value: '', isInvalid: false },
    password: { value: '', isInvalid: false },
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buttonId = useMemo(() => 'login_submit_id', []);

  const [captchaRefreshTrigger, setCaptchaRefreshTrigger] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const { colorMode } = useColorMode();



  const loginAxios = () => {
    if (loginForm.username.value === '' || loginForm.password.value === '' || captchaSlice.captchaInput === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(loginForm, setLoginForm, ['username', 'password']);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingLogin(true));

      fetchWithAxios.post('/login',
        new URLSearchParams({
          username: loginForm.username.value,
          password: loginForm.password.value,
          platform: "mikhak",
        }).toString(), {
          headers: {
            'id': captchaSlice.id,
            'captcha': captchaSlice.captchaInput,
            'platform': 'mikhak',
            'Accept': 'application/json',
          },
          withCredentials: true,
        },
      ).then((response) => {
        // console.log(" response 11:", response); 
        if (checkStatus({ status: response.data.status })) {

          if (rememberMe) {
            localStorage.setItem("remember_login", JSON.stringify({
              username: loginForm.username.value,
              password: loginForm.password.value, // اگر نمی‌خوای ذخیره شود، حذفش کن
            }));
          } else {
            localStorage.removeItem("remember_login");
          }

          
          setLoginForm({
            username: { value: '', isInvalid: false },
            password: { value: '', isInvalid: false },
          });
          navigate(`${ADMIN_ROUTE}${DASHBOARD_ROUTE}`);
        } else {
          giveMeCaptcha(dispatch);
          setCaptchaRefreshTrigger(prev => prev + 1);

        }
        updatePromiseToastSuccessWarningInfo({ toastId, response });

      }).catch((error2) => {
        // giveMeCaptcha(dispatch);
        setCaptchaRefreshTrigger(prev => prev + 1);
        // console.log("login error:", error2.response.data.detail.fa); 
        const error = error2.response.data.detail;
        // console.log("login error:", error ); 
        updatePromiseToastError2({ toastId, error });

        // updatePromiseToastError({ toastId, error });

      }).finally(() => {
        dispatch(setCaptchaInput(''));
        dispatch(setIsFetchingLogin(false));
      });
    }
  };

  const changeInputs = useCallback((event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: { ...prev[name], value, isInvalid: false } }));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("remember_login");
    // console.log("LocalStorage remember_login:", saved); 
    if (saved) {
    const parsed = JSON.parse(saved);
      setRememberMe(true);
      setLoginForm({
        username: { value: parsed.username || "", isInvalid: false },
        password: { value: parsed.password || "", isInvalid: false },
      });
    }
  }, []);

  const handleChange = (e) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    if (!checked) {
      localStorage.removeItem("remember_login");
    }
    const parsed = JSON.parse(saved);
    setRememberMe(true);
    setLoginForm({
      username: { value: parsed.username || "", isInvalid: false },
      password: { value: parsed.password || "", isInvalid: false },
    });
  };




  return (
    <Base buttonId={buttonId}
          submitTitle={giveText(61)}
          title={giveText(61)}
          submitFunc={loginAxios}
          noHeadingImage={false}
          hasCancelButton={false}
          hasLogo={true}
          hasTitle={false}
          hasTitleTopAbsolute={true}
          mr={0}
          ml={0}
          px={7}
          w={'600px'}
          isLoadingSubmitButton={isLoadingSlice.isFetchingLogin}
          Content={(
            <Stack spacing={1} my={'auto'}>
              <FloatingLabelInput label={giveText(14)}
                                  name={'username'}
                                  type="text"
                                  mx={0}
                                  dir={'ltr'}
                                  autoFocus
                                  value={loginForm.username.value}
                                  invalid={loginForm.username.isInvalid}
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<UserOutlineIcon width={'1rem'} />}
                                  onKeyDown={(event) => handleEnter(event, buttonId)}
                                  onChange={changeInputs} />

              <FloatingLabelInput label={giveText(15)}
                                  name={'password'}
                                  pr={'4.5rem'}
                                  type={showPassword ? 'text' : 'password'}
                                  dir={'ltr'}
                                  mx={0}
                                  value={loginForm.password.value}
                                  invalid={loginForm.password.isInvalid}
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<KeyIcon width={'1rem'} />}
                                  hasInputRightElement={true}
                                  InputRightElement={(
                                    <EyeIconPassword isOn={showPassword}
                                                     onClick={() => setShowPassword(!showPassword)} />
                                  )}
                                  onKeyDown={(event) => handleEnter(event, buttonId)}
                                  onChange={changeInputs} />

              <GetCaptcha buttonId={buttonId} externalRefresh={() => setCaptchaRefreshTrigger(prev => prev + 1)} />
              <HStack justifyContent="flex-start" mt={-3} mb={-4}>
                <Checkbox
                    checked={rememberMe}
                    onChange={handleChange}
                    // sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                    sx={{
                        '& .MuiSvgIcon-root': { 
                          fontSize: 20,
                          color: colorMode === 'light' ? 'rgba(21, 13, 73, 0.8)' :'rgba(128, 130, 136, 0.8)'
                         },
                      }}
                  />
                  <Text 
                  // sx={{
                  //           fontSize: 16,
                  //         }} 
                      // fontSize={'16px'}
                      marginRight={-3}
                      fontSize={14}
                      color={colorMode === 'light' ? 'rgba(0,0,0,0.8)' :'rgba(255,255,255,0.8)'}>{giveText(429)}</Text>
              </HStack>


            </Stack>
          )}
          Extension={<ExtensionLogin />}
    />
  );
};