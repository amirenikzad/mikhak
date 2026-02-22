import { giveDir, giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { handleEnter } from '../../../../../Base/BaseFunction.jsx';
import FloatingLabelInput from '../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import {
  setServiceCroppedImageDark,
  setServiceCroppedImageLight,
} from '../../../../../../store/features/cropImageSlice.jsx';
import { AvatarUpload } from '../../../../../Base/UploadImage/AvatarUpload.jsx';
import { useDispatch } from 'react-redux';
import { Grid, GridItem, Stack, Tabs, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Button } from '../../../../../ui/button.jsx';
import FloatingLabelEditorJs from '../../../../../Base/CustomComponets/FloatingLabelEditorJs.jsx';
import { RenameIcon } from '../../../../../Base/CustomIcons/RenameIcon.jsx';
import { ImageOutlineIcon } from '../../../../../Base/CustomIcons/ImageOutlineIcon.jsx';
import { ImageFillIcon } from '../../../../../Base/CustomIcons/ImageFillIcon.jsx';
import { LanguageIcon } from '../../../../../Base/CustomIcons/LanguageIcon.jsx';
import no_image_light from '../../../../../../assets/images/no_image.jpeg';
import { Switch } from '../../../../../ui/switch.jsx';
import FloatingEdition from '../../../../../Base/CustomComponets/FloatingEdition.jsx';
import FloatingCategory from '../../../../../Base/CustomComponets/FloatingCategory.jsx';

import { HStack, IconButton, VStack } from '@chakra-ui/react';
import { AddIcon } from '../../../../../Base/CustomIcons/AddIcon.jsx';
import { MinusIcon } from '../../../../../Base/CustomIcons/MinusIcon.jsx';
import { useState } from 'react';
import { showToast } from '../../../../../Base/BaseFunction.jsx';

export const FormData = ({
                           form = {},
                           buttonId,
                           changeInputs,
                           changeSwitch,
                           setForm,
                           submitTitle,
                           submitFunc,
                           isLoadingSubmitButton,
                         }) => {
  const dispatch = useDispatch();
  console.log("FormDate:", form); 

  useEffect(() => {
    dispatch(setServiceCroppedImageLight(null));
    dispatch(setServiceCroppedImageDark(null));
  }, []);

  const increaseCount = (key, amount = 1) => {
    const current = Number(form[key]?.value ?? 0);
    const newValue = current + amount;

    setForm(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: newValue,
        isInvalid: false,
      }
    }));
  };

  // const decreaseCount = (key, amount = 1) => {
  //   const current = Number(form[key]?.value ?? 0);
  //   const newValue = current - amount;

  //   setForm(prev => ({
  //     ...prev,
  //     [key]: {
  //       ...prev[key],
  //       value: newValue,
  //       isInvalid: false,
  //     }
  //   }));
  // };
  const decreaseCount = (key, amount = 1) => {
    const current = Number(form[key]?.value ?? 0);
    const newValue = current - amount;

    if (newValue < 0) {
      showToast({
        title: giveText(30),        
        description: giveText(449), 
        status: 1,                  
      });
      return;
    }

    
    setForm(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: newValue,
        isInvalid: false,
      }
    }));
  };

  // const isEditionSelected = () => {
  //   return (
  //     form.edition?.value !== null &&
  //     form.edition?.value !== undefined &&
  //     form.edition?.label &&
  //     form.edition.label !== 'بدون نوع محصول'
  //   );
  // };
  const isEditionSelected = () => {
    return (
            form.edition_label.value !== 'بدون نوع محصول'
            ||
            (form.edition?.value !== null &&
            form.edition?.value !== undefined &&
            form.edition?.label &&
            form.edition.label !== 'بدون نوع محصول')
    );
  };

  const handleSubmitWithEditionCheck = () => {
    if (!isEditionSelected()) {
      showToast({
        title: giveText(30),         
        description: giveText(450),  
        status: 1,                   
      });

      
      setForm(prev => ({
        ...prev,
        edition: {
          ...prev.edition,
          isInvalid: true,
        },
      }));

      return;
    }

    
    submitFunc();
  };



  return (
    <Grid templateColumns="repeat(10, 1fr)" gap={4} dir={giveDir()}>
      <GridItem colSpan={4}>
        <Stack>
          <Tabs.Root defaultValue="english">
            <Tabs.List p="1">
              <Tabs.Trigger w={'100%'} value={'english'}>
                <ImageOutlineIcon width={'1rem'} />
                {giveText(237)}
              </Tabs.Trigger>
              <Tabs.Trigger w={'100%'} value={'persian'}>
                <ImageFillIcon width={'1rem'} />
                {giveText(236)}
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="english" py={4}>
              <AvatarUpload image={form.light_icon.value}
                            aspect={1 / 1}
                            avatarCroppedImage={'serviceCroppedImageLight'}
                            setAvatarCroppedImage={(value) => {
                              dispatch(setServiceCroppedImageLight(value));
                            }}
                            noImage={no_image_light}
                            circular={false}
                            editable={true}
                            imageWidth={'550px'}
                            imageHeight={'380px'}
                            removeDo={() => {
                              setForm(prevState => {
                                return {
                                  ...prevState,
                                  light_icon: { value: '', isInvalid: prevState['isInvalid'] },
                                };
                              });
                            }} />
            </Tabs.Content>
            <Tabs.Content value="persian" py={4}>
              <AvatarUpload image={form.dark_icon.value}
                            aspect={1 / 1}
                            avatarCroppedImage={'serviceCroppedImageDark'}
                            setAvatarCroppedImage={(value) => {
                              dispatch(setServiceCroppedImageDark(value));
                            }}
                            noImage={no_image_light}
                            circular={false}
                            editable={true}
                            imageWidth={'550px'}
                            imageHeight={'380px'}
                            removeDo={() => {
                              setForm(prevState => {
                                return {
                                  ...prevState,
                                  dark_icon: { value: '', isInvalid: prevState['isInvalid'] },
                                };
                              });
                            }} />
            </Tabs.Content>
          </Tabs.Root>

          <HStack spacing={3} align="center">
            <FloatingLabelInput label={giveText(239)}
                                name={'ui_path'}
                                dir={'ltr'}
                                mx={3}
                                value={form.ui_path.value}
                                invalid={form.ui_path.isInvalid} type={'text'}
                                hasInputLeftElement={true}
                                InputLeftElementIcon={<RenameIcon width={'1rem'} />}
                                onKeyDown={(event) => handleEnter(event, buttonId)}
                                onChange={changeInputs}
                                minW2="50%" />
              <Text fontSize='sm'  mr={'10px'} >
                {giveText(448)}
              </Text>
              <HStack spacing={3} align="center">
                {/* <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="green"
                  p={1}
                  minW="36px"
                  h="36px"
                  onClick={() => increaseCount('maximum_user', 1)}
                >
                  <AddIcon width="1.4rem" height="1.4rem"  color={"#0891B2FF"} />
                </Button> */}
                <Stack align="center">
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="green"
                    h="11px"
                    onClick={() => increaseCount('maximum_user', 1)}
                  >
                    <AddIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  <Button
                    variant="ghost"
                    h="11px"
                    onClick={() => decreaseCount('maximum_user', 1)}
                  >
                    <MinusIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  </Stack>

                <Text fontSize="lg"  textAlign="center" border="1px solid" borderColor="gray.300" borderRadius="8px"px={3} py={1} marginRight={'-15px'} >
                  {form.maximum_user?.value ?? 0}
                </Text>
              </HStack>  
              
            </HStack>                

            <HStack spacing={6} align="center">
                <Text fontSize='sm' marginRight={'30px'}>
                  {giveText(447)}
                </Text>
                <HStack align="center">
                  <Stack align="center">
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="green"
                    h="11px"
                    onClick={() => increaseCount('patch', 1)}
                  >
                    <AddIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  <Button
                    variant="ghost"
                    h="11px"
                    onClick={() => decreaseCount('patch', 1)}
                  >
                    <MinusIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  </Stack>

                  <Text fontSize='lg'  textAlign="center" border="1px solid" borderColor="gray.300" borderRadius="8px"px={2} py={1} marginRight={'-17px'} >
                    {form.patch?.value ?? 0}
                  </Text>
                </HStack>

                <Text fontSize="2xl" color="gray.500" mt={'20px'}>•</Text>

                <HStack  align="center">
                  <Stack align="center">
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="green"
                    h="11px"
                    onClick={() => increaseCount('minor', 1)}
                  >
                    <AddIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  <Button
                    variant="ghost"
                    h="11px"
                    onClick={() => decreaseCount('minor', 1)}
                  >
                    <MinusIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  </Stack>

                  <Text fontSize='lg' minW="0px" textAlign="center" border="1px solid" borderColor="gray.300" borderRadius="8px"px={2} py={1} marginRight={'-17px'} >
                    {form.minor?.value ?? 0}
                  </Text>
                </HStack>

                <Text fontSize="2xl" color="gray.500" mt={'20px'}>•</Text>

                <HStack  align="center">
                  <Stack align="center">
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="green"
                    h="11px"
                    onClick={() => increaseCount('major', 1)}
                  >
                    <AddIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  <Button
                    variant="ghost"
                    h="11px"
                    onClick={() => decreaseCount('major', 1)}
                  >
                    <MinusIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  </Stack>

                  <Text  fontSize='lg'  textAlign="center" border="1px solid" borderColor="gray.300" borderRadius="8px"px={2} py={1} marginRight={'-17px'} >
                    {form.major?.value ?? 0}
                  </Text>
                </HStack>
              </HStack>

            {/* <Stack w={'180px'}>
              <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                <GridItem colSpan={1}>
                  <Text fontSize={'14px'} cursor={'default'}>
                    {giveText(2)}:
                  </Text>
                </GridItem>

                <GridItem colSpan={1} textAlign={giveDir() === 'ltr' ? 'right' : 'left'}>
                  <Switch name={'active'}
                          dir={'rtl'}
                          checked={form?.active.value}
                          colorPalette={'cyan'}
                          size={'sm'}
                          onCheckedChange={({ checked }) => {
                            changeSwitch({ target: { name: 'active', checked: checked } });
                          }} />
                </GridItem>
              </Grid>

              <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                <GridItem colSpan={1}>
                  <Text fontSize={'14px'} cursor={'default'}>
                    {giveText(22)}:
                  </Text>
                </GridItem>

                <GridItem colSpan={1} textAlign={giveDir() === 'ltr' ? 'right' : 'left'}>

                  <Switch name={'show'}
                          dir={'rtl'}
                          checked={form?.show.value}
                          colorPalette={'cyan'}
                          size={'sm'}
                          onCheckedChange={({ checked }) => {
                            changeSwitch({ target: { name: 'show', checked: checked } });
                          }} />
                </GridItem>
              </Grid>

              <Grid templateColumns={'repeat(4, 1fr)'} gap={4}>
                <GridItem colSpan={3}>
                  <Text fontSize={'14px'} cursor={'default'}>
                    {giveText(408)}:
                  </Text>
                </GridItem>

                <GridItem colSpan={1} textAlign={giveDir() === 'ltr' ? 'right' : 'left'}>
                  <Switch name={'for_sell'}
                          dir={'rtl'}
                          checked={form?.for_sell.value}
                          colorPalette={'cyan'}
                          size={'sm'}
                          onCheckedChange={({ checked }) => {
                            changeSwitch({ target: { name: 'for_sell', checked: checked } });
                          }} />
                </GridItem>
              </Grid>
            </Stack> */}

          <Button onClick={handleSubmitWithEditionCheck} colorPalette={'cyan'} size={'xs'} loading={isLoadingSubmitButton} marginTop={'20px'} >
            {submitTitle}
          </Button>
        </Stack>
      </GridItem>

      <GridItem colSpan={6}>
        <Tabs.Root defaultValue="persian">
          <Tabs.List p="1">
            <Tabs.Trigger w={'100%'} value="english">
              <LanguageIcon width={'1rem'} />
              {giveText(235)}
            </Tabs.Trigger>
            <Tabs.Trigger w={'100%'} value="persian">
              <LanguageIcon width={'1rem'} />
              {giveText(234)}
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="english" py={2}>
            <Stack spacing={2}>
              <FloatingLabelInput label={giveText(233)}
                                  name={'en_name'}
                                  dir={'ltr'}
                                  mx={3}
                                  value={form.en_name.value}
                                  invalid={form.en_name.isInvalid} type={'text'}
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<RenameIcon width={'1rem'} />}
                                  onKeyDown={(event) => handleEnter(event, buttonId)}
                                  onChange={changeInputs} />

              <FloatingLabelEditorJs name={'en_description'}
                                     readOnly={false}
                                     dir={'ltr'}
                                     value={form.en_description.value}
                                     onChange={changeInputs} />
            </Stack>
          </Tabs.Content>
          <Tabs.Content value="persian" py={2}>
            <Stack spacing={2}>
              <FloatingLabelInput label={giveText(232)}
                                  name={'fa_name'}
                                  dir={'rtl'}
                                  mx={3}
                                  value={form.fa_name.value}
                                  invalid={form.fa_name.isInvalid} type={'text'}
                                  hasInputLeftElement={true}
                                  InputLeftElementIcon={<RenameIcon width={'1rem'} />}
                                  onKeyDown={(event) => handleEnter(event, buttonId)}
                                  onChange={changeInputs} />

              <FloatingLabelEditorJs name={'fa_description'}
                                     readOnly={false}
                                     dir={'rtl'}
                                     value={form.fa_description.value}
                                     onChange={changeInputs} 
                                     onKeyDown={(event) => handleEnter(event, buttonId)}
                                     />

            </Stack>
          </Tabs.Content>

            <HStack justify="space-between" align="center" wrap="wrap" w="100%">
              <FloatingEdition
                // value={
                //   form.edition?.label && form.edition.label !== 'بدون نوع محصول'
                //   // form.minor?.value
                //     ? { id: form.edition.value, name: form.edition.label }
                //     : null
                // }
                // value={
                //   form.edition_name?.label && form.edition_name.label !== 'بدون نوع محصول'
                //     ? { id: form.edition_name.value, name: form.edition_name.label }
                //     : null
                // }
                // value={
                //   form.edition_label.value
                // }
                value={
                  form.edition_label.value && form.edition_label.value !== 'بدون نوع محصول'
                    ? { id: form.edition_label.value, name: form.edition_label.value }
                    : null
                }
                value2={
                  form.edition_label.value
                }
                invalid={form.edition.isInvalid}
                // invalid={form.edition_name.isInvalid}
                buttonId={buttonId}
                onKeyDown={(event) => handleEnter(event, buttonId)}
                name={'edition'}
                onChange={(edition) => {
                  setForm(prev => ({
                    ...prev,
                    edition: {
                      value: edition?.id ?? null,
                      label: edition?.name || '',
                      isInvalid: false,
                    }
                  }));
                }}
              />
              <FloatingCategory
                value={
                  form.category_label.value && form.category_label.value !== 'بدون دسته بندی'
                    ? { id: form.category_label.value, name: form.category_label.value }
                    : null
                }
                value2={
                  form.category_label.value
                }
                invalid={form.category.isInvalid}
                // invalid={form.category_name.isInvalid}
                buttonId={buttonId}
                onKeyDown={(event) => handleEnter(event, buttonId)}
                name={'category'}
                onChange={(category) => {
                  setForm(prev => ({
                    ...prev,
                    category: {
                      value: category?.id ?? null,
                      label: category?.category_name || '',
                      isInvalid: false,
                    }
                  }));
                }}
              />

              {/* <HStack spacing={6} align="center">
                <Text fontSize='sm' color="gray.900" >
                  {giveText(447)}
                </Text>
                <HStack align="center">
                  <Stack align="center">
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="green"
                    h="11px"
                    onClick={() => increaseCount('patch', 1)}
                  >
                    <AddIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  <Button
                    variant="ghost"
                    h="11px"
                    onClick={() => decreaseCount('patch', 1)}
                  >
                    <MinusIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  </Stack>

                  <Text fontSize='lg'  textAlign="center" border="1px solid" borderColor="gray.300" borderRadius="8px"px={2} py={1} marginRight={'-17px'} >
                    {form.patch?.value ?? 0}
                  </Text>
                </HStack>

                <Text fontSize="2xl" color="gray.500" mt={'20px'}>•</Text>

                <HStack  align="center">
                  <Stack align="center">
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="green"
                    h="11px"
                    onClick={() => increaseCount('minor', 1)}
                  >
                    <AddIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  <Button
                    variant="ghost"
                    h="11px"
                    onClick={() => decreaseCount('minor', 1)}
                  >
                    <MinusIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  </Stack>

                  <Text fontSize='lg' minW="0px" textAlign="center" border="1px solid" borderColor="gray.300" borderRadius="8px"px={2} py={1} marginRight={'-17px'} >
                    {form.minor?.value ?? 0}
                  </Text>
                </HStack>

                <Text fontSize="2xl" color="gray.500" mt={'20px'}>•</Text>

                <HStack  align="center">
                  <Stack align="center">
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="green"
                    h="11px"
                    onClick={() => increaseCount('major', 1)}
                  >
                    <AddIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  <Button
                    variant="ghost"
                    h="11px"
                    onClick={() => decreaseCount('major', 1)}
                  >
                    <MinusIcon width="1.13rem" height="1.13rem"  color={"#0891B2FF"} />
                  </Button>
                  </Stack>

                  <Text  fontSize='lg'  textAlign="center" border="1px solid" borderColor="gray.300" borderRadius="8px"px={2} py={1} marginRight={'-17px'} >
                    {form.major?.value ?? 0}
                  </Text>
                </HStack>
              </HStack> */}
            </HStack>

            {/* <FloatingCategory
                value={
                  form.category_label.value && form.category_label.value !== 'بدون دسته بندی'
                    ? { id: form.category_label.value, name: form.category_label.value }
                    : null
                }
                value2={
                  form.category_label.value
                }
                invalid={form.category.isInvalid}
                // invalid={form.category_name.isInvalid}
                buttonId={buttonId}
                onKeyDown={(event) => handleEnter(event, buttonId)}
                name={'category'}
                onChange={(category) => {
                  setForm(prev => ({
                    ...prev,
                    category: {
                      value: category?.id ?? null,
                      label: category?.category_name || '',
                      isInvalid: false,
                    }
                  }));
                }}
              /> */}


        </Tabs.Root>
      </GridItem>
    </Grid>
  );
};
