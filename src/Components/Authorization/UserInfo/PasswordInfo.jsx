import { Stack, Text } from '@chakra-ui/react';
import {
  showToast,
  handleEnter,
  checkStatus,
  promiseToast,
  handleErrors,
  giveMeCaptcha,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../Base/BaseFunction.jsx';
import { useMemo, useState } from 'react';
import { Base } from '../../Authentication/Base.jsx';
import { setCaptchaInput } from '../../../store/features/captchaSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setHasUpdatedLoginUser } from '../../../store/features/updatedSlice.jsx';
import { setCroppedImage } from '../../../store/features/cropImageSlice.jsx';
import { giveText } from '../../Base/MultiLanguages/HandleLanguage.jsx';
import { fetchWithAxios } from '../../Base/axios/FetchAxios.jsx';
import FloatingLabelInput from '../../Base/CustomComponets/FloatingLabelInput.jsx';
import { setIsFetchingUserInfo } from '../../../store/features/isLoadingSlice.jsx';
import { EyeIconPassword } from '../../Base/CustomComponets/EyeIconPassword.jsx';
import { KeyIcon } from '../../Base/CustomIcons/KeyIcon.jsx';

export const PasswordInfo = ({
                               user_id = null,
                               closeModal,
                               url,
                               UserAccessName,
                               backNone = false,
                               minW = '450px',
                               w = 'auto',
                               title = giveText(11),
                               showable_current_password = true,
                             }) => {
  const updatedSlice = useSelector(state => state.updatedSlice);
  const accessSlice = useSelector(state => state.accessSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [userInfoForm, setUserInfoForm] = useState({
    current_password: { value: '', isInvalid: false },
    new_password: { value: '', isInvalid: false },
    confirm_new_password: { value: '', isInvalid: false },
  });
  const dispatch = useDispatch();
  const buttonId = useMemo(() => 'user_info_submit_id', []);

  const passwordChecker = () => {
    if (!userInfoForm.new_password.value || !userInfoForm.confirm_new_password.value || (showable_current_password && !userInfoForm.current_password.value)) {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      let list = [];
      if (!userInfoForm.current_password.value) list.push('current_password');
      if (!userInfoForm.new_password.value) list.push('new_password');
      if (!userInfoForm.confirm_new_password.value) list.push('confirm_new_password');
      handleErrors(userInfoForm, setUserInfoForm, list, true);
      return false;
    }
    if (userInfoForm.new_password.value !== userInfoForm.confirm_new_password.value) {
      showToast({
        title: giveText(30),
        description: giveText(391),
        status: 2,
      });
      handleErrors(userInfoForm, setUserInfoForm, [
        'new_password',
        'confirm_new_password',
      ], true);
      return false;
    }
    if (userInfoForm.new_password.value.length < 8) {
      showToast({
        title: giveText(30),
        description: giveText(392),
        status: 2,
      });
      handleErrors(userInfoForm, setUserInfoForm, [
        'new_password',
        'confirm_new_password',
      ], true);
      return false;
    }
    if (showable_current_password && (userInfoForm.current_password.value === userInfoForm.new_password.value)) {
      showToast({
        title: giveText(30),
        description: giveText(393),
        status: 2,
      });
      handleErrors(userInfoForm, setUserInfoForm, [
        'current_password',
        'new_password',
        'confirm_new_password',
      ], true);
      return false;
    }

    return true;
  };

  const updatePasswordUserAxios = () => {
    if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(UserAccessName)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else if (passwordChecker()) {
      const toastId = promiseToast();
      dispatch(setIsFetchingUserInfo(true));

      fetchWithAxios.patch(url, showable_current_password ? {
          'user_id': user_id,
          'current_password': userInfoForm.current_password.value,
          'new_password': userInfoForm.new_password.value,
          'confirm_new_password': userInfoForm.confirm_new_password.value,
        } : {
          'user_id': user_id,
          'new_password': userInfoForm.new_password.value,
          'confirm_new_password': userInfoForm.confirm_new_password.value,
        },
      ).then((response) => {
        if (checkStatus({ status: response.data.status })) {
          dispatch(setHasUpdatedLoginUser(!updatedSlice.hasUpdatedLoginUser));
          dispatch(setCroppedImage(null));
          closeModal();
        }
        updatePromiseToastSuccessWarningInfo({ toastId, response });

      }).catch((error) => {
        giveMeCaptcha(dispatch);
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setIsFetchingUserInfo(false));
        dispatch(setCaptchaInput(''));
      });
    }
  };

  const changeInputs = (event) => {
    const { name, value } = event.target;
    setUserInfoForm((prev) => ({ ...prev, [name]: { ...prev[name], value, isInvalid: false } }));
  };

  return (
    <Base buttonId={buttonId}
          submitTitle={giveText(17)}
          title={title}
          w={w}
          minW={minW}
          ml={'0'}
          mr={'0'}
          box_shadow={false}
          px={0}
          p={0}
          submitFunc={updatePasswordUserAxios}
          hasCancelButton={false}
          backNone={backNone}
          hasTitle={false}
          onCloseModal={closeModal}
          hasSubmitButton={accessSlice.isAdmin || accessSlice.userAccess?.includes(UserAccessName)}
          isLoadingSubmitButton={isLoadingSlice.isFetchingUserInfo}
          Content={(
            <Stack spacing={2}>
              {showable_current_password &&
                <FloatingLabelInput label={giveText(125)}
                                    name={'current_password'}
                                    dir={'ltr'}
                                    mx={3}
                                    value={userInfoForm.current_password.value}
                                    invalid={userInfoForm.current_password.isInvalid}
                                    pr="4.5rem"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    hasInputLeftElement={true}
                                    InputLeftElementIcon={<KeyIcon width={'1rem'} />}
                                    hasInputRightElement={true}
                                    InputRightElement={(
                                      <EyeIconPassword isOn={showCurrentPassword}
                                                       onClick={() => setShowCurrentPassword(!showCurrentPassword)} />
                                    )}
                                    readOnly={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(UserAccessName)}
                                    onKeyDown={(event) => handleEnter(event, buttonId)}
                                    onChange={changeInputs} />
              }

              <FloatingLabelInput label={giveText(124)}
                                  name={'new_password'}
                                  dir={'ltr'}
                                  mx={3}
                                  value={userInfoForm.new_password.value}
                                  invalid={userInfoForm.new_password.isInvalid}
                                  pr="4.5rem"
                                  type={showNewPassword ? 'text' : 'password'}
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<KeyIcon width={'1rem'} />}
                                  hasInputRightElement={true}
                                  InputRightElement={(
                                    <EyeIconPassword isOn={showNewPassword}
                                                     onClick={() => setShowNewPassword(!showNewPassword)} />
                                  )}
                                  readOnly={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(UserAccessName)}
                                  onKeyDown={(event) => handleEnter(event, buttonId)}
                                  onChange={changeInputs} />

              <FloatingLabelInput label={giveText(59)}
                                  name={'confirm_new_password'}
                                  dir={'ltr'}
                                  mx={3}
                                  value={userInfoForm.confirm_new_password.value}
                                  invalid={userInfoForm.confirm_new_password.isInvalid}
                                  pr="4.5rem"
                                  type={showConfirmNewPassword ? 'text' : 'password'}
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<KeyIcon width={'1rem'} />}
                                  hasInputRightElement={true}
                                  InputRightElement={(
                                    <EyeIconPassword isOn={showConfirmNewPassword}
                                                     onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} />
                                  )}
                                  readOnly={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(UserAccessName)}
                                  onKeyDown={(event) => handleEnter(event, buttonId)}
                                  onChange={changeInputs} />

              {!(accessSlice.isAdmin || accessSlice.userAccess?.includes(UserAccessName)) &&
                <Text color={'red'} cursor={'default'}>
                  {giveText(118)}
                </Text>
              }
            </Stack>
          )} />
  );
};
