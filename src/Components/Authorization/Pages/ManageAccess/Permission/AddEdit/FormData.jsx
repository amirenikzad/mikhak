import { Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { handleEnter } from '../../../../../Base/BaseFunction.jsx';
import FloatingLabelInput from '../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import FloatingLabelTextArea from '../../../../../Base/CustomComponets/FloatingLabelTextArea.jsx';
import FloatingLabelSelect from '../../../../../Base/CustomComponets/FloatingLabelSelect.jsx';
import { Switch } from '../../../../../ui/switch.jsx';
import { RenameIcon } from '../../../../../Base/CustomIcons/RenameIcon.jsx';

export const FormData = ({ setPermissionForm, options, permissionForm = {}, changeInputs, buttonId, changeSwitch }) => {

  return <>
    <Grid templateColumns="repeat(7, 1fr)" gap={4}>
      <GridItem colSpan={6} my={'auto'}>
        <FloatingLabelInput label={giveText(40)}
                            name={'action'}
                            value={permissionForm.action.value}
                            invalid={permissionForm.action.isInvalid}
                            type={'text'}
                            mx={3}
                            hasInputLeftElement={true}
                            InputLeftElementIcon={<RenameIcon width={'1rem'} />}
                            onKeyDown={(event) => handleEnter(event, buttonId)}
                            onChange={changeInputs} />
      </GridItem>

      <GridItem colSpan={1} my={'auto'}>
        <HStack spacing={1}>
          <Text cursor={'default'} my={'auto'}>{giveText(92)}:</Text>
          <Switch colorPalette="cyan"
                  checked={permissionForm.is_default.value}
                  onCheckedChange={(e) => {
                    changeSwitch({ target: { name: 'is_default', checked: e.checked } });
                  }} />
        </HStack>
      </GridItem>
    </Grid>

    <Grid templateColumns="repeat(5, 1fr)" gap={2} dir={'ltr'}>
      <GridItem colSpan={1} my={'auto'}>
        <FloatingLabelSelect name={'method'}
                             options={options}
                             autoFocus
                             placeholder={''}
                             label={giveText(36)}
                             value={permissionForm.method.value || []}
                             onChange={(event) => {
                               setPermissionForm((prev) => ({
                                 ...prev, method: {
                                   value: event.value,
                                   isInvalid: prev.isInvalid,
                                 },
                               }));
                             }} />
      </GridItem>

      <GridItem colSpan={4} my={'auto'} dir={'ltr'}>
        <FloatingLabelInput label={`${giveText(41)}: /add/...`}
                            name={'path'}
                            dir={'ltr'}
                            mx={3}
                            value={permissionForm.path.value}
                            invalid={permissionForm.path.isInvalid}
                            type={'text'}
                            onKeyDown={(event) => handleEnter(event, buttonId)}
                            onChange={changeInputs} />
      </GridItem>
    </Grid>

    <FloatingLabelTextArea name={'description'} maxH={'180px'} label={giveText(38)} minH={'130px'}
                           value={permissionForm.description.value} type={'text'}
                           onKeyDown={(event) => handleEnter(event, buttonId)}
                           onChange={changeInputs} />
  </>;
};
