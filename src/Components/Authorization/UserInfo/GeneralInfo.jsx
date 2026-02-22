import { Center, For, Grid, GridItem, HStack, Stack } from '@chakra-ui/react';
import {
  showToast,
  handleEnter,
  checkStatus,
  handleErrors,
  promiseToast,
  giveMeCaptcha,
  validateEmail,
  convertImageToBase64,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../Base/BaseFunction.jsx';
import { useEffect, useMemo, useState } from 'react';
import { Base } from '../../Authentication/Base.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setHasUpdatedLoginUser } from '../../../store/features/updatedSlice.jsx';
import { AvatarUpload } from '../../Base/UploadImage/AvatarUpload.jsx';
import { setCroppedImage, setCroppedImageFileType } from '../../../store/features/cropImageSlice.jsx';
import { giveText } from '../../Base/MultiLanguages/HandleLanguage.jsx';
import { fetchWithAxios } from '../../Base/axios/FetchAxios.jsx';
import FloatingLabelInput from '../../Base/CustomComponets/FloatingLabelInput.jsx';
import { setIsFetchingUserInfo } from '../../../store/features/isLoadingSlice.jsx';
import FloatingLabelTextArea from '../../Base/CustomComponets/FloatingLabelTextArea.jsx';
import { RenameIcon } from '../../Base/CustomIcons/RenameIcon.jsx';
import { EmailIcon } from '../../Base/CustomIcons/EmailIcon.jsx';
import { UserOutlineIcon } from '../../Base/CustomIcons/UserOutlineIcon.jsx';
import avatar1 from '../../../assets/icons/avatar1.png';
import avatar2 from '../../../assets/icons/avatar2.png';
import avatar3 from '../../../assets/icons/avatar3.png';
import avatar4 from '../../../assets/icons/avatar4.png';
import { Badge } from '@mui/material';
import { CircularCheckFillIcon } from '../../Base/CustomIcons/CircularCheckFillIcon.jsx';
import Avatar from '@mui/material/Avatar';

export const GeneralInfo = ({
                              usersList = {},
                              closeModal,
                              url,
                              UserAccessName,
                              minW = 'auto',
                              w = 'auto',
                              update = () => null,
                            }) => {
  const cropImageSlice = useSelector(state => state.cropImageSlice);
  const updatedSlice = useSelector(state => state.updatedSlice);
  const accessSlice = useSelector(state => state.accessSlice);
  const isLoadingSlice = useSelector(state => state.isLoadingSlice);
  const [avatarIndexSelected, setAvatarIndexSelected] = useState(-1);
  const [userInfoForm, setUserInfoForm] = useState(usersList && {
    username: { value: usersList.username, isInvalid: false },
    email: { value: usersList.email, isInvalid: false },
    name: { value: usersList.name, isInvalid: false },
    family: { value: usersList.family, isInvalid: false },
    description: { value: usersList.description, isInvalid: false },
    enable: { value: !usersList.disabled, isInvalid: false },
    admin: { value: usersList.admin, isInvalid: false },
    profile_pic: { value: usersList.profile_pic, isInvalid: false },
    profile_pic_file_type: { value: usersList.extension, isInvalid: false },
  });
  const dispatch = useDispatch();
  const buttonId = useMemo(() => 'general_info_submit_id', []);

  useEffect(() => {
    dispatch(setCroppedImage(null));
    dispatch(setCroppedImageFileType(null));
  }, []);

  const updateUserAxios = () => {
    if (userInfoForm.username.value === '' || userInfoForm.email.value === '' || userInfoForm.name.value === '' || userInfoForm.family.value === '') {
      showToast({
        title: giveText(30),
        description: giveText(26),
        status: 2,
      });
      handleErrors(userInfoForm, setUserInfoForm, ['username', 'email', 'name', 'family']);

    } else if (validateEmail(userInfoForm.email.value)) {
      showToast({
        title: giveText(30),
        description: giveText(27),
        status: 2,
      });
      handleErrors(userInfoForm, setUserInfoForm, ['email'], true);

    } else if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(UserAccessName)) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });

    } else {
      const toastId = promiseToast();
      dispatch(setIsFetchingUserInfo(true));

      fetchWithAxios.put(url, {
          'user_id': usersList.id,
          'username': userInfoForm.username.value,
          'email': userInfoForm.email.value,
          'name': userInfoForm.name.value,
          'family': userInfoForm.family.value,
          'disabled': !userInfoForm.enable.value,
          'description': userInfoForm.description.value,
          'admin': userInfoForm.admin.value,
          'profile_pic': cropImageSlice.croppedImage ? cropImageSlice.croppedImage : userInfoForm.profile_pic.value,
          'extension': cropImageSlice.croppedImageFileType ? cropImageSlice.croppedImageFileType : userInfoForm.profile_pic_file_type.value,
        },
      ).then((response) => {
        if (checkStatus({ status: response.data.status })) {
          dispatch(setHasUpdatedLoginUser(!updatedSlice.hasUpdatedLoginUser));
          dispatch(setCroppedImage(null));
          dispatch(setCroppedImageFileType(null));
          closeModal();
          update();
        }
        updatePromiseToastSuccessWarningInfo({ toastId, response });

      }).catch((error) => {
        giveMeCaptcha(dispatch);
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        dispatch(setIsFetchingUserInfo(false));
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
          w={w}
          ml={'0'}
          mr={'0'}
          px={0}
          box_shadow={false}
          p={0}
          submitFunc={updateUserAxios}
          hasCancelButton={false}
          backNone={false}
          hasTitle={false}
          minW={minW}
          onCloseModal={closeModal}
          hasSubmitButton={accessSlice.isAdmin || accessSlice.userAccess?.includes(UserAccessName)}
          isLoadingSubmitButton={isLoadingSlice.isFetchingUserInfo}
          Content={(
            <Stack mt={3}>
              <Center>
                <AvatarUpload image={userInfoForm.profile_pic.value}
                              editable={accessSlice.isAdmin || accessSlice.userAccess?.includes(UserAccessName)}
                              setAvatarCroppedImage={(value) => {
                                dispatch(setCroppedImage(value));
                              }}
                              removeDo={() => {
                                setUserInfoForm(prevState => {
                                  return {
                                    ...prevState,
                                    profile_pic: { value: '', isInvalid: prevState['isInvalid'] },
                                    profile_pic_file_type: { value: '', isInvalid: prevState['isInvalid'] },
                                  };
                                });
                              }} />
              </Center>

              <Center>
                <HStack>
                  <For each={[avatar1, avatar2, avatar3, avatar4]}>
                    {(item, index) => (
                      <Badge overlap={'circular'}
                             anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                             badgeContent={
                               avatarIndexSelected === index
                                 ? <CircularCheckFillIcon color={'green.700'} width={'2rem'} />
                                 : <></>
                             }>
                        <Avatar sx={{ width: '90px', height: '90px', cursor: 'pointer' }}
                                src={item}
                                className={'box_shadow'}
                                onClick={() => {
                                  convertImageToBase64(item, (dataURL) => dispatch(setCroppedImage(dataURL)));
                                  setAvatarIndexSelected(index);
                                }} />
                      </Badge>
                    )}
                  </For>
                </HStack>
              </Center>

              <Stack spacing={2} mt={5} w={'100%'}>
                <FloatingLabelInput label={giveText(14)}
                                    name={'username'}
                                    dir={'ltr'}
                                    value={userInfoForm.username.value}
                                    type={'text'}
                                    mx={3}
                                    autoFocus
                                    hasInputLeftElement={true}
                                    InputLeftElementIcon={<UserOutlineIcon width={'1rem'} />}
                                    readOnly={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(UserAccessName)}
                                    onKeyDown={(event) => handleEnter(event, buttonId)}
                                    onChange={changeInputs} />

                <FloatingLabelInput label={giveText(18)}
                                    name={'email'}
                                    dir={'ltr'}
                                    mx={3}
                                    value={userInfoForm.email.value}
                                    readOnly={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(UserAccessName)}
                                    type={'Email'}
                                    onKeyDown={(event) => handleEnter(event, buttonId)}
                                    onChange={changeInputs}
                                    hasInputLeftElement={true}
                                    InputLeftElementIcon={<EmailIcon width={'1rem'} />} />

                <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                  <GridItem colSpan={1} my={'auto'}>
                    <FloatingLabelInput label={giveText(151)}
                                        name={'name'}
                                        dir={'ltr'}
                                        mx={3}
                                        value={userInfoForm.name.value}
                                        readOnly={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(UserAccessName)}
                                        onKeyDown={(event) => handleEnter(event, buttonId)}
                                        onChange={changeInputs}
                                        hasInputLeftElement={true}
                                        InputLeftElementIcon={<RenameIcon width={'1rem'} />} />


                  </GridItem>

                  <GridItem colSpan={1} my={'auto'}>
                    <FloatingLabelInput label={giveText(152)}
                                        name={'family'}
                                        dir={'ltr'}
                                        mx={3}
                                        value={userInfoForm.family.value}
                                        readOnly={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(UserAccessName)}
                                        onKeyDown={(event) => handleEnter(event, buttonId)}
                                        onChange={changeInputs}
                                        hasInputLeftElement={true}
                                        InputLeftElementIcon={<RenameIcon width={'1rem'} />} />
                  </GridItem>
                </Grid>

                <FloatingLabelTextArea label={giveText(153)}
                                       name={'description'}
                                       maxH={'180px'}
                                       minH={'130px'}
                                       value={userInfoForm.description.value}
                                       type={'text'}
                                       onChange={changeInputs} />
              </Stack>
            </Stack>
          )} />
  );
};
