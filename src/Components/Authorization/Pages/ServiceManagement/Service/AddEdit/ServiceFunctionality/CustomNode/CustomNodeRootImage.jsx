import { Image } from '@chakra-ui/react';
import { Handle } from '@xyflow/react';
import {
  PopoverRoot,
  PopoverBody,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from '../../../../../../../ui/popover.jsx';
import { useColorMode } from '../../../../../../../ui/color-mode.jsx';
import { giveDir } from '../../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { DescriptionTableService } from './DescriptionTableService.jsx';
import no_image_light from '../../../../../../../../assets/images/no_image_light.png';
import no_image_dark from '../../../../../../../../assets/images/no_image_dark.png';

const CustomNodeRootImage = ({ data = {} }) => {
  const { colorMode } = useColorMode();

  return (
    <PopoverRoot lazyMount positioning={{ placement: giveDir() === 'rtl' ? 'right' : 'left' }}>
      <PopoverTrigger asChild>
        <Image width={'auto'} height={'100px'} src={colorMode === 'light'
          ? data?.light_icon ? data?.light_icon : no_image_light
          : data?.dark_icon ? data?.dark_icon : no_image_dark
        } />
      </PopoverTrigger>
      <PopoverContent className={'box_shadow'} w={'400px'}>
        <PopoverArrow />

        <PopoverBody zIndex={'9999 !important'}>
          <DescriptionTableService service={data} />
        </PopoverBody>
      </PopoverContent>

      <Handle type="source" position="bottom" style={{ background: 'green' }} />
    </PopoverRoot>
  );
};

export default CustomNodeRootImage;
