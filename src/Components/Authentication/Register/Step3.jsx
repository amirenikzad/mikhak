import { HStack, Stack, Text } from '@chakra-ui/react';
import FloatingLabelInput from '../../Base/CustomComponets/FloatingLabelInput.jsx';
import { giveText } from '../../Base/MultiLanguages/HandleLanguage.jsx';
import { KeyIcon } from '../../Base/CustomIcons/KeyIcon.jsx';
import { EyeIconPassword } from '../../Base/CustomComponets/EyeIconPassword.jsx';
import { handleEnter } from '../../Base/BaseFunction.jsx';
import FloatingLabelTextArea from '../../Base/CustomComponets/FloatingLabelTextArea.jsx';
import { Switch } from '../../ui/switch.jsx';
import { GetCaptcha } from '../../Base/GetCaptcha.jsx';
import { motion } from 'motion/react';
import { useState } from 'react';

const Step3 = ({ showIsActive, showIsAdmin, registerForm, changeInputs, changeSwitch, buttonId }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Stack spacing={2}>
        <FloatingLabelInput name={'password'}
                            dir={'ltr'}
                            autoFocus
                            value={registerForm.password.value}
                            pr="4.5rem"
                            mx={3}
                            type={showPassword ? 'text' : 'password'}
                            label={giveText(15)}
                            invalid={registerForm.password.isInvalid}
                            hasInputLeftElement={true}
                            InputLeftElementIcon={<KeyIcon width={'1rem'} />}
                            hasInputRightElement={true}
                            InputRightElement={(
                              <EyeIconPassword isOn={showPassword}
                                               onClick={() => setShowPassword(!showPassword)} />
                            )}
                            onKeyDown={(event) => handleEnter(event, `${buttonId}_2`)}
                            onChange={changeInputs} />

        <FloatingLabelInput name={'confirmPassword'}
                            dir={'ltr'}
                            value={registerForm.confirmPassword.value}
                            pr={'4.5rem'}
                            mx={3}
                            label={giveText(16)}
                            type={showConfirmPassword ? 'text' : 'password'}
                            invalid={registerForm.confirmPassword.isInvalid}
                            hasInputLeftElement={true}
                            InputLeftElementIcon={<KeyIcon width={'1rem'} />}
                            hasInputRightElement={true}
                            InputRightElement={(
                              <EyeIconPassword isOn={showConfirmPassword}
                                               onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                            )}
                            onKeyDown={(event) => handleEnter(event, `${buttonId}_2`)}
                            onChange={changeInputs} />

        {(showIsActive || showIsAdmin) &&
          <HStack spacing={1} my={3}>
            {showIsActive &&
              <HStack spacing={1}>
                <Text my={'auto'}>{giveText(20)}</Text>
                <Switch name={'isEnable'}
                        colorPalette="cyan"
                        checked={registerForm.isEnable.value}
                        onCheckedChange={(e) => {
                          changeSwitch({ target: { name: 'isEnable', checked: e.checked } });
                        }} />
              </HStack>
            }

            {showIsAdmin &&
              <HStack spacing={1}>
                <Text my={'auto'}>{giveText(3)}</Text>
                <Switch name={'admin'}
                        colorPalette="cyan"
                        checked={registerForm.admin.value}
                        onCheckedChange={(e) => {
                          changeSwitch({ target: { name: 'admin', checked: e.checked } });
                        }} />
              </HStack>
            }
          </HStack>
        }

        <GetCaptcha buttonId={`${buttonId}_2`} />
      </Stack>
    </motion.div>
  );
};

export default Step3;
