import { Box } from '@chakra-ui/react';
import { Handle } from '@xyflow/react';
import { RemoveIcon } from '../../../../../../../Base/IconsFeatures/Icons.jsx';
import { methodTagIconColor } from '../../../../../../../Base/BaseFunction.jsx';
import {
  PopoverRoot,
  PopoverBody,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from '../../../../../../../ui/popover.jsx';
import { useColorMode } from '../../../../../../../ui/color-mode.jsx';
import { POST_SERVICE_COMPONENT_MICROSERVICE } from '../../../../../../../Base/UserAccessNames.jsx';
import { useSelector } from 'react-redux';
import { lazy, Suspense } from 'react';

const DescriptionTableAPI = lazy(() => import('./DescriptionTableFunctionality'));

const CustomNodeFunctionality = ({ id, data = {} }) => {
  const accessSlice = useSelector((state) => state.accessSlice);
  const { colorMode } = useColorMode();

  return (
    <PopoverRoot lazyMount positioning={{ placement: 'bottom' }}>
      <PopoverTrigger asChild>
        <Box cursor="pointer"
             padding="10px"
             borderColor={methodTagIconColor(data?.method, colorMode)}
             borderWidth={3}
             backgroundColor={'white'}
             className={'box_shadow'}
             color="black"
             borderRadius="8px"
             textAlign="center"
             display="flex"
             alignItems="center"
             justifyContent="space-between"
             position="relative">
          {/* <span>{data?.name}</span> */}
          <span>{data?.api}</span>
          {(accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_SERVICE_COMPONENT_MICROSERVICE)) &&
            <RemoveIcon ml={1} size={'1.3rem'}
                        onClick={() => {
                          data?.onDelete(id);
                          data?.setApisDropped(prevState => {
                            return prevState.filter(item => item.toString() !== id.toString());
                          });
                        }} />
          }
        </Box>
      </PopoverTrigger>
      <PopoverContent className={'box_shadow'} w={'400px'}>
        <PopoverArrow />

        <PopoverBody zIndex={'9999 !important'}>
          <Suspense fallback={'loading...'}>
            <DescriptionTableAPI api={data} />
          </Suspense>
        </PopoverBody>
      </PopoverContent>

      <Handle type="target" position="top" style={{ background: 'green' }} />
    </PopoverRoot>
  );
};

export default CustomNodeFunctionality;
