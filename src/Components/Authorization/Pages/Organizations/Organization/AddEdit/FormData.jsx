import { giveDir, giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { handleEnter } from '../../../../../Base/BaseFunction.jsx';
import FloatingLabelInput from '../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { Box, Button, Grid, GridItem, HStack, Stack, VStack } from '@chakra-ui/react';
import FloatingLabelTextArea from '../../../../../Base/CustomComponets/FloatingLabelTextArea.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  setHasExpandedMapFalse,
  setHasExpandedMapTrue,
} from '../../../../../../store/features/mapOrganizationSlice.jsx';
import { lazy, Suspense } from 'react';
import { Tooltip } from '../../../../../ui/tooltip.jsx';
import { RenameIcon } from '../../../../../Base/CustomIcons/RenameIcon.jsx';
import { LocationAddFillIcon } from '../../../../../Base/CustomIcons/LocationAddFillIcon.jsx';
import { LocationOffFillIcon } from '../../../../../Base/CustomIcons/LocationOffFillIcon.jsx';
import { MailOutlineIcon } from '../../../../../Base/CustomIcons/MailOutlineIcon.jsx';
import { PhoneOutlineIcon } from '../../../../../Base/CustomIcons/PhoneOutlineIcon.jsx';
import { TelephoneOutlineIcon } from '../../../../../Base/CustomIcons/TelephoneOutlineIcon.jsx';
import { UploadImage } from './Sections/UploadImage.jsx';
import { OrganizationName } from './Sections/OrganizationName.jsx';
import { OrganizationType } from './Sections/OrganizationType.jsx';
import { OrganizationParentName } from './Sections/OrganizationParentName.jsx';
import { OrganizationAdminName } from './Sections/OrganizationAdminName.jsx';
import { PlatformName } from './Sections/PlatformName.jsx';

const MapComponent = lazy(() => import('../../../../../Base/MapComponent'));

export const FormData = ({
                           organizationForm = {},
                           setOrganizationForm,
                           buttonId,
                           changeInputs,
                           onCloseModal,
                           submitFunc,
                           isLoadingSubmitButton,
                           editing = false,
                           organizationList = [],
                         }) => {
  const mapOrganizationSlice = useSelector(state => state.mapOrganizationSlice);
  const dispatch = useDispatch();

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={5}>
      <GridItem colSpan={mapOrganizationSlice.hasExpandedMap ? 1 : 2}>
        <Stack spacing={2}>
          <UploadImage organizationForm={organizationForm} setOrganizationForm={setOrganizationForm} />

          <OrganizationName organizationForm={organizationForm}
                            setOrganizationForm={setOrganizationForm}
                            editing={editing} />

          

          <OrganizationAdminName organizationForm={organizationForm}
                                 setOrganizationForm={setOrganizationForm}
                                 editing={editing} />

          <PlatformName organizationForm={organizationForm}
                                 setOrganizationForm={setOrganizationForm}
                                 editing={editing} />

          <FloatingLabelInput label={giveText(282)}
                              name={'number'}
                              value={organizationForm.number.value}
                              invalid={organizationForm.number.isInvalid}
                              dir={'ltr'}
                              type={'text'}
                              mx={3}
                              hasInputLeftElement={true}
                              InputLeftElementIcon={<TelephoneOutlineIcon width={'1rem'} />}
                              onKeyDown={(event) => handleEnter(event, buttonId)}
                              onChange={changeInputs} />

          <FloatingLabelInput label={giveText(284)}
                              name={'phone_number'}
                              value={organizationForm.phone_number.value}
                              invalid={organizationForm.phone_number.isInvalid}
                              dir={'ltr'}
                              type={'text'}
                              mx={3}
                              hasInputLeftElement={true}
                              InputLeftElementIcon={<PhoneOutlineIcon width={'1rem'} />}
                              onKeyDown={(event) => handleEnter(event, buttonId)}
                              onChange={changeInputs} />

          <FloatingLabelInput label={giveText(18)}
                              name={'email'}
                              value={organizationForm.email.value}
                              invalid={organizationForm.email.isInvalid}
                              dir={'ltr'}
                              type={'text'}
                              mx={3}
                              hasInputLeftElement={true}
                              InputLeftElementIcon={<MailOutlineIcon width={'1rem'} />}
                              onKeyDown={(event) => handleEnter(event, buttonId)}
                              onChange={changeInputs} />

          <OrganizationType organizationForm={organizationForm}
                            setOrganizationForm={setOrganizationForm}
                            editing={editing} />
                            
          <OrganizationParentName organizationForm={organizationForm}
                                  setOrganizationForm={setOrganizationForm}
                                  baseOrganizationList={organizationList} />

          <FloatingLabelTextArea label={giveText(35)}
                                 name={'address'}
                                 maxH={'180px'}
                                 minH={'130px'}
                                 value={organizationForm.address.value}
                                 type={'text'}
                                 onChange={changeInputs} />

          <HStack>
            <VStack spacing={2} w={'full'} align="flex-start">
              <FloatingLabelInput label={giveText(137)}
                                  name={'lat'}
                                  disabled={true}
                                  minW={'550px'}
                                  value={organizationForm.lat.value}
                                  invalid={organizationForm.lat.isInvalid}
                                  type={'text'}
                                  mx={3}
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<RenameIcon width={'1rem'} />}
                                  onChange={changeInputs} />

              <FloatingLabelInput label={giveText(138)}
                                  name={'long'}
                                  disabled={true}
                                  minW={'550px'}
                                  value={organizationForm.long.value}
                                  invalid={organizationForm.long.isInvalid}
                                  type={'text'}
                                  mx={3}
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<RenameIcon width={'1rem'} />}
                                  onChange={changeInputs} />
            </VStack>

            <VStack spacing={2}>
              <Tooltip showArrow content={giveText(140)} bg={'black'} color={'white'}
                       fontWeight={'bold'}>
                <Button bgColor={'green'} p={0}
                        onClick={() => {
                          if (mapOrganizationSlice.hasExpandedMap) {
                            dispatch(setHasExpandedMapFalse());
                          } else {
                            dispatch(setHasExpandedMapTrue());
                          }
                        }}>
                  <LocationAddFillIcon width={'1rem'} />
                </Button>
              </Tooltip>

              <Tooltip showArrow content={giveText(141)} bg={'black'} color={'white'} fontWeight={'bold'}>
                <Button colorPalette={'red'} p={0}
                        onClick={() => {
                          changeInputs({ target: { name: 'long', value: '' } });
                          changeInputs({ target: { name: 'lat', value: '' } });
                        }}>
                  <LocationOffFillIcon width={'1rem'} />
                </Button>
              </Tooltip>
            </VStack>
          </HStack>

          <HStack w={'100%'}>
            <Button size={'xs'} w={'50%'}
                    colorPalette={'red'}
                    onClick={onCloseModal}>
              {giveText(31)}
            </Button>

            <Tooltip showArrow
                     disabled={organizationForm.organization_type.value}
                     content={giveText(411)}
                     bg={'black'}
                     color={'white'}
                     fontWeight={'bold'}
                     positioning={{ placement: giveDir() === 'rtl' ? 'left' : 'right' }}>
              <Box w={'50%'}>
                <Button id={buttonId}
                        size={'xs'}
                        w={'100%'}
                        colorPalette={'blue'}
                        disabled={!organizationForm.organization_type.value}
                        onClick={organizationForm.organization_type.value ? submitFunc : null}
                        loading={isLoadingSubmitButton}
                        loadingText={giveText(116)}>
                  {giveText(17)}
                </Button>
              </Box>
            </Tooltip>
          </HStack>
        </Stack>
      </GridItem>

      <GridItem colSpan={mapOrganizationSlice.hasExpandedMap ? 0 : 1} hidden={!mapOrganizationSlice.hasExpandedMap}>
        <Stack spacing={1}>
          {mapOrganizationSlice.hasExpandedMap &&
            <Suspense fallback={'loading...'}>
              <MapComponent height={'620px'}
                            location={organizationForm.lat.value ? [organizationForm.lat.value, organizationForm.long.value] : [false, false]}
                            onChange={changeInputs} />
            </Suspense>
          }
        </Stack>
      </GridItem>
    </Grid>
  );
};
