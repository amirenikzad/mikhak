import { Center, Image, Stack, Text } from '@chakra-ui/react';
import { giveDir } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { useColorMode } from '../../../../../ui/color-mode.jsx';
import FloatingLabelEditorJs from '../../../../../Base/CustomComponets/FloatingLabelEditorJs.jsx';
import no_image_light from '../../../../../../assets/images/no_image_light.png';
import no_image_dark from '../../../../../../assets/images/no_image_dark.png';

export default function ShowService({ service }) {
  const { colorMode } = useColorMode();

  return (
    <Stack spacing={3} w={'100%'} px={8} cursor={'default'} dir={giveDir()}>
      <Center>
        <Image loading="lazy"
               width={'70%'}
               height={'auto'}
               src={colorMode === 'light'
                 ? service.light_icon ? service.light_icon : no_image_light
                 : service.dark_icon ? service.dark_icon : no_image_dark
               } />
      </Center>

      <>
        <Text fontSize={'20px'} fontWeight={'800'}>{giveDir() === 'rtl' ? service.fa_name : service.en_name}</Text>

        <FloatingLabelEditorJs readOnly={true}
                               editorType={'inline'}
                               maxH={'auto'}
                               minH={0}
                               dir={giveDir()}
                               value={giveDir() === 'rtl' ? service?.fa_description : service?.en_description} />
      </>
    </Stack>
  );
};
