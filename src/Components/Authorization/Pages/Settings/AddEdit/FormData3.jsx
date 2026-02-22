import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { handleEnter } from '../../../../Base/BaseFunction.jsx';
import FloatingLabelInput from '../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { RenameIcon } from '../../../../Base/CustomIcons/RenameIcon.jsx';

export const FormData3 = ({ registerForm = {}, buttonId, changeInputs }) => (
  <FloatingLabelInput label={giveText(454)}
                      name={'category_name'}
                      value={registerForm.category_name.value}
                      autoFocus
                      invalid={registerForm.category_name.isInvalid}
                      type={'text'}
                      mx={3}
                      hasInputLeftElement={true}
                      InputLeftElementIcon={<RenameIcon width={'1rem'} />}
                      onKeyDown={(event) => handleEnter(event, buttonId)}
                      onChange={changeInputs} />
);
