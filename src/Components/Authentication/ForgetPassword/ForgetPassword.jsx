import { Stack } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail } from '../../../store/features/forgetPasswordSlice';
import { GetCaptcha } from '../../Base/GetCaptcha';
import {
  showToast,
  handleEnter,
  checkStatus,
  promiseToast,
  validateEmail,
  giveMeCaptcha,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../Base/BaseFunction';
import { Base } from '../Base';
import { HaveAccount } from '../../Base/Extensions.jsx';
import { giveText } from '../../Base/MultiLanguages/HandleLanguage';
import { AUTHENTICATION_ROUTE, RESET_PASSWORD_ROUTE } from '../../Base/BaseRouts';
import { useNavigate } from 'react-router';
import { setCaptchaInput } from '../../../store/features/captchaSlice';
import { fetchWithAxios } from '../../Base/axios/FetchAxios.jsx';
import FloatingLabelInput from '../../Base/CustomComponets/FloatingLabelInput.jsx';
import { setIsFetchingForgetPassword } from '../../../store/features/isLoadingSlice.jsx';
import { EmailIcon } from '../../Base/CustomIcons/EmailIcon.jsx';

export default function ForgetPassword() {
  const forgetPasswordSlice = useSelector(state => state.forgetPasswordSlice);
  const captchaSlice = useSelector(state => state.captchaSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buttonId = useMemo(() => 'forget_pass_submit_id', []);

  const handleErrors = (invalidate = false) => {
    dispatch(setEmail({ isInvalid: invalidate }));
  };

  const forgetPasswordAxios = () => {
    if (forgetPasswordSlice.email.value === '' || captchaSlice.captchaInput === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      forgetPasswordSlice.email.value === '' && handleErrors(true);

    } else if (validateEmail(forgetPasswordSlice.email.value)) {
      showToast({
        title: giveText(30),
        description: giveText(27),
        status: 2,
      });
      handleErrors(true);

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingForgetPassword(true));

      fetchWithAxios.post(`/forgot_password?email=${forgetPasswordSlice.email.value}`, {}, {
        headers: {
          'id': captchaSlice.id,
          'captcha': captchaSlice.captchaInput,
        },
      }).then((response) => {
        if (checkStatus({ status: response.data.status })) {
          navigate(`${AUTHENTICATION_ROUTE}${RESET_PASSWORD_ROUTE}`);
        }
        updatePromiseToastSuccessWarningInfo({ toastId, response });

      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setCaptchaInput(''));
        giveMeCaptcha(dispatch);
        dispatch(setIsFetchingForgetPassword(false));
      });
    }
  };

  useEffect(() => {
    dispatch(setEmail({ value: '', isInvalid: false }));
  }, []);

  const changeInputs = useCallback((event) => {
    dispatch(setEmail({ value: event.target.value, isInvalid: false }));
  }, []);

  return (
    <Base buttonId={buttonId}
          submitTitle={giveText(33)}
          title={giveText(54)}
          noHeadingImage={false}
          submitFunc={forgetPasswordAxios}
          hasCancelButton={false}
          hasTitleTopAbsolute={true}
          hasLogo={true}
          mr={0}
          ml={0}
          px={5}
          w={'600px'}
          isLoadingSubmitButton={isLoadingSlice.isFetchingForgetPassword}
          Content={(
            <Stack spacing={2}>
              <FloatingLabelInput label={giveText(18)}
                                  dir={'ltr'}
                                  value={forgetPasswordSlice.email.value}
                                  type={'email'}
                                  autoFocus
                                  mx={3}
                                  invalid={forgetPasswordSlice.email.isInvalid}
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<EmailIcon width={'1rem'} />}
                                  onKeyDown={(event) => handleEnter(event, buttonId)}
                                  onChange={changeInputs} />

              <GetCaptcha buttonId={buttonId} />
            </Stack>
          )}
          Extension={<HaveAccount />}
    />
  );
};
