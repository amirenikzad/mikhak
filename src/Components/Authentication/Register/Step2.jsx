import { Stack } from '@chakra-ui/react';
import { handleEnter } from '../../Base/BaseFunction';
import { motion } from 'motion/react';
import { giveText } from '../../Base/MultiLanguages/HandleLanguage';
import FloatingLabelInput from '../../Base/CustomComponets/FloatingLabelInput.jsx';
import { EmailIcon } from '../../Base/CustomIcons/EmailIcon.jsx';
import { RenameIcon } from '../../Base/CustomIcons/RenameIcon.jsx';
import FloatingLabelTextArea from '../../Base/CustomComponets/FloatingLabelTextArea.jsx';

const Step2 = ({ registerForm, changeInputs, buttonId }) => {

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Stack spacing={2}>
        <FloatingLabelInput name={'email'}
                            dir={'ltr'}
                            value={registerForm.email.value}
                            type={'Email'}
                            mx={3}
                            autoFocus
                            label={giveText(18)}
                            invalid={registerForm.email.isInvalid}
                            hasInputLeftElement={true}
                            InputLeftElementIcon={<EmailIcon width={'1rem'} />}
                            onKeyDown={(event) => handleEnter(event, `${buttonId}_1`)}
                            onChange={changeInputs} />

        <FloatingLabelInput name={'firstName'}
                            value={registerForm.firstName.value}
                            invalid={registerForm.firstName.isInvalid}
                            type={'text'}
                            mx={3}
                            label={giveText(151)}
                            hasInputLeftElement={true}
                            InputLeftElementIcon={<RenameIcon width={'1rem'} />}
                            onKeyDown={(event) => handleEnter(event, `${buttonId}_1`)}
                            onChange={changeInputs} />

        <FloatingLabelInput name={'lastName'}
                            value={registerForm.lastName.value}
                            invalid={registerForm.lastName.isInvalid}
                            type={'text'}
                            mx={3}
                            label={giveText(152)}
                            hasInputLeftElement={true}
                            InputLeftElementIcon={<RenameIcon width={'1rem'} />}
                            onKeyDown={(event) => handleEnter(event, `${buttonId}_1`)}
                            onChange={changeInputs} />

        <FloatingLabelTextArea label={giveText(153)}
                               name={'description'}
                               maxH={'180px'}
                               minH={'130px'}
                               value={registerForm.description.value}
                               type={'text'}
                               onChange={changeInputs} />
      </Stack>
    </motion.div>
  );
};

export default Step2;
