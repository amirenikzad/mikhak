import { Center, For, HStack, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { handleEnter, convertImageToBase64 } from '../../Base/BaseFunction';
import { motion } from 'motion/react';
import { AvatarUpload } from '../../Base/UploadImage/AvatarUpload';
import { setCroppedImage } from '../../../store/features/cropImageSlice';
import { giveText } from '../../Base/MultiLanguages/HandleLanguage';
import FloatingLabelInput from '../../Base/CustomComponets/FloatingLabelInput.jsx';
import { UserOutlineIcon } from '../../Base/CustomIcons/UserOutlineIcon.jsx';
import Avatar from '@mui/material/Avatar';
import avatar1 from '../../../assets/icons/avatar1.png';
import avatar2 from '../../../assets/icons/avatar2.png';
import avatar3 from '../../../assets/icons/avatar3.png';
import avatar4 from '../../../assets/icons/avatar4.png';
import { Badge } from '@mui/material';
import { CircularCheckFillIcon } from '../../Base/CustomIcons/CircularCheckFillIcon.jsx';
import { useDispatch } from 'react-redux';

const Step1 = ({ registerForm, buttonId, changeInputs }) => {
  const [avatarIndexSelected, setAvatarIndexSelected] = useState(-1);
  const dispatch = useDispatch();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Stack gap={4}>
        <AvatarUpload editable={true}
                      removeDo={() => {
                        setAvatarIndexSelected(-1);
                      }}
                      setAvatarCroppedImage={(value) => {
                        dispatch(setCroppedImage(value));
                      }} />

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

        <FloatingLabelInput label={`${giveText(14)}`}
                            name={'username'}
                            dir={'ltr'}
                            mx={3}
                            value={registerForm.username.value}
                            type={'text'}
                            autoFocus
                            invalid={registerForm.username.isInvalid}
                            hasInputLeftElement={true}
                            InputLeftElementIcon={<UserOutlineIcon width={'1rem'} />}
                            onKeyDown={(event) => handleEnter(event, `${buttonId}_0`)}
                            onChange={changeInputs} />
      </Stack>
    </motion.div>
  );
};

export default Step1;
