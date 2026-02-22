import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { handleEnter } from '../../../../Base/BaseFunction.jsx';
import FloatingLabelInput from '../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { RenameIcon } from '../../../../Base/CustomIcons/RenameIcon.jsx';

export const FormData2 = ({ registerForm = {}, buttonId, changeInputs }) => (
  <FloatingLabelInput label={giveText(445)}
                      name={'edition_name'}
                      value={registerForm.edition_name.value}
                      autoFocus
                      invalid={registerForm.edition_name.isInvalid}
                      type={'text'}
                      mx={3}
                      hasInputLeftElement={true}
                      InputLeftElementIcon={<RenameIcon width={'1rem'} />}
                      onKeyDown={(event) => handleEnter(event, buttonId)}
                      onChange={changeInputs} />
);
