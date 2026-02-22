import { Box, Text, Button, Center, Input, HStack, Stack, VStack, Image as ChakraUiImage } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCroppedImg, getRotatedImage } from './CanvasUtils';
import { getOrientation } from 'get-orientation/browser';
import Cropper from 'react-easy-crop';
import { useDispatch, useSelector } from 'react-redux';
import { convertFileToBase642, showToast } from '../BaseFunction';
import { giveText } from '../MultiLanguages/HandleLanguage';
import Avatar from '@mui/material/Avatar';
import { useColorMode } from '../../ui/color-mode.jsx';
import { Slider } from '../../ui/slider.jsx';
import { Tooltip } from '../../ui/tooltip.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../ui/dialog.jsx';
import { CameraIcon } from '../CustomIcons/CameraIcon.jsx';
import { CameraXIcon } from '../CustomIcons/CameraXIcon.jsx';
import { setCroppedImageFileType } from '../../../store/features/cropImageSlice.jsx';

export const AvatarUpload = ({
                               image,
                               removeDo = null,
                               editable,
                               setAvatarCroppedImage,
                               avatarCroppedImage = 'croppedImage',
                               additionalText,
                               aspect = 4 / 4,
                               imageWidth = '550px',
                               imageHeight = '180px',
                               circular = true,
                               noImage,
                             }) => {
  const cropImageSlice = useSelector(state => state.cropImageSlice);
  const [imageSrc, setImageSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [hasHovered, setHasHovered] = useState(false);
  const { colorMode } = useColorMode();
  const inputImageRef = useRef(null);
  const [isOpenModalImageCropper, setIsOpenModalImageCropper] = useState(false);
  const dispatch = useDispatch();

  const readFile = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }, []);

  const ORIENTATION_TO_ANGLE = useMemo(() => {
    return {
      '3': 180,
      '6': 90,
      '8': -90,
    };
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      const base64Image = await convertFileToBase642(croppedImage);
      setAvatarCroppedImage(base64Image);
      setIsOpenModalImageCropper(false);
      setImageSrc(null);
      setCroppedAreaPixels(null);
      inputImageRef.current.value = null;
    } catch (e) {
      showToast({
        title: giveText(30),
        description: e?.message || String(e),
        status: 1,
      });
    }
  };

  useEffect(() => {
    // setAvatarCroppedImage(null);
    setImageSrc(null);
    setCroppedAreaPixels(null);
    inputImageRef.current.value = null;
  }, []);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      dispatch(setCroppedImageFileType(file.type.toString().split('/')[1]));

      const maxSize = 2 * 1024 * 1024; // 2MB
      const maxWidth = 2000; // Max width in pixels
      const maxHeight = 2000; // Max height in pixels

      if (file.size > maxSize) {
        showToast({
          title: giveText(93),
          description: giveText(94),
          status: 1,
        });
        return;
      }

      let imageDataUrl = await readFile(file);
      const img = new Image();
      img.src = imageDataUrl;
      img.onload = async () => {
        if (img.width > maxWidth || img.height > maxHeight) {
          showToast({
            title: giveText(95),
            description: giveText(96),
            status: 1,
          });
          return;
        }

        try {
          const orientation = await getOrientation(file);
          const rotation = ORIENTATION_TO_ANGLE[orientation];
          if (rotation) {
            imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
          }
        } catch (_) {
          showToast({
            title: giveText(30),
            description: giveText(70),
            status: 1,
          });
        }

        setImageSrc(imageDataUrl);
        setIsOpenModalImageCropper(true);
      };
    }
  };

  return <>
    <Center>
      <VStack spacing={0}>
        <Center>
          {circular ? (
            <Avatar sx={{ width: '150px', height: '150px' }}
                    src={cropImageSlice[avatarCroppedImage] ?
                      cropImageSlice[avatarCroppedImage] :
                      image ? image : noImage
                    }
                    className={'box_shadow'}
                    onMouseEnter={() => setHasHovered(true)}
                    onMouseLeave={() => setHasHovered(false)} />
          ) : (
            <Box borderWidth={2} borderRadius={4}>
              <ChakraUiImage w={imageWidth}
                             h={imageHeight}
                             src={cropImageSlice[avatarCroppedImage] ?
                               cropImageSlice[avatarCroppedImage] :
                               image ? image : noImage
                             }
                             boxShadow={'md'}
                             onMouseEnter={() => setHasHovered(true)}
                             onMouseLeave={() => setHasHovered(false)} />
            </Box>
          )}

          {(editable && (cropImageSlice[avatarCroppedImage] || image)) ? (
            <Tooltip showArrow content={giveText(90)} bg={'black'} color={'white'} fontWeight={'bold'}>
              <CameraXIcon position={'absolute'}
                           hidden={!hasHovered}
                           cursor={'pointer'}
                           onMouseEnter={() => setHasHovered(true)}
                           onMouseLeave={() => setHasHovered(false)}
                           onClick={() => {
                             setAvatarCroppedImage(null);
                             setImageSrc(null);
                             setCroppedAreaPixels(null);
                             inputImageRef.current.value = null;
                             removeDo && removeDo();
                           }}
                           width={'110px'}
                           boxSize={'110px'}
                           color={'rgb(255,2,2)'} />
            </Tooltip>
          ) : (editable &&
            <Tooltip showArrow content={giveText(71)} bg={'black'} color={'white'} fontWeight={'bold'}>
              <CameraIcon position={'absolute'}
                          hidden={!hasHovered} cursor={'pointer'}
                          onMouseEnter={() => setHasHovered(true)}
                          onMouseLeave={() => setHasHovered(false)}
                          onClick={() => inputImageRef.current.click()}
                          width={'130px'}
                          color={'rgb(13,46,1)'} />
            </Tooltip>
          )}
        </Center>

        <VStack mt={1} gap={0} fontSize={'14px'}>
          {additionalText &&
            <Text cursor={'default'} color={colorMode === 'light' ? 'black' : 'white'}>{additionalText}</Text>
          }
          <Text cursor={'default'} color={colorMode === 'light' ? 'black' : 'white'}>{giveText(179)}</Text>
          <Text cursor={'default'} color={colorMode === 'light' ? 'black' : 'white'}>{giveText(180)}</Text>
        </VStack>
      </VStack>

      <Input ref={inputImageRef} type={'file'} hidden={true} onChange={onFileChange} accept={'image/*'} />
    </Center>

    <DialogRoot lazyMount
                placement={'center'}
                size={'lg'}
                open={isOpenModalImageCropper}
                onOpenChange={(e) => setIsOpenModalImageCropper(e.open)}>
      <DialogContent>
        <DialogBody p={2}>
          <Stack gap={3} w={'100%'}>
            <Box position={'relative'} width={'100%'} height={300} bgColor={'#333'}>
              <Cropper image={imageSrc}
                       crop={crop}
                       rotation={rotation}
                       zoom={zoom}
                       aspect={aspect}
                       onCropChange={setCrop}
                       onRotationChange={setRotation}
                       onCropComplete={onCropComplete}
                       onZoomChange={setZoom} />
            </Box>

            <HStack w={'full'}>
              <Text cursor={'default'} color={colorMode === 'light' ? 'black' : 'white'}>
                {giveText(72)}
              </Text>

              <Slider w={'100%'}
                      min={1}
                      max={3}
                      step={0.1}
                      value={[zoom]}
                      variant={'outline'}
                      colorPalette={'blue'}
                      cursor={'pointer'}
                      onValueChange={(val) => setZoom(val.value)} />
            </HStack>

            <HStack w={'full'}>
              <Text cursor={'default'}>{giveText(73)}</Text>

              <Slider w={'100%'}
                      min={0}
                      max={360}
                      step={1}
                      value={[rotation]}
                      variant={'outline'}
                      colorPalette={'blue'}
                      cursor={'pointer'}
                      onValueChange={(val) => setRotation(...val.value)} />
            </HStack>

            <Button onClick={showCroppedImage} colorPalette="blue">{giveText(17)}</Button>
          </Stack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  </>;
};
