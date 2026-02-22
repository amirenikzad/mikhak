import { Box, Button, Center, HStack, Image, Link } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { giveDir, giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, memo, Suspense } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {
  PUT_ORGANIZATION,
  DELETE_ORGANIZATION,
  GET_ORGANIZATION_HIERARCHY,
} from '../../../../Base/UserAccessNames.jsx';
import { MENU_BACKGROUND_DARK } from '../../../../Base/BaseColor.jsx';
import { TableText, User } from '../../../../Base/Extensions.jsx';
import { EditIcon, ProfilingIcon, RemoveIcon, SettingsIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { setHasExpandedMapTrue } from '../../../../../store/features/mapOrganizationSlice.jsx';
import map_icon from '../../../../../assets/icons/map.webp';
import { motion } from 'motion/react';
import { useColorMode } from '../../../../ui/color-mode.jsx';
import { PopoverContent, PopoverRoot, PopoverTrigger } from '../../../../ui/popover.jsx';
import { HierarchyVerticalIcon } from '../../../../Base/CustomIcons/HierarchyVerticalIcon.jsx';
import Checkbox from '@mui/material/Checkbox';

const MapComponent = lazy(() => import('../../../../Base/MapComponent'));

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.ids.has(prevProps.row?.id) === nextProps.ids.has(nextProps.row?.id)
    && (prevProps.row?.image === nextProps.row?.image)
    && (prevProps.row?.lat === nextProps.row?.lat)
    && (prevProps.row?.long === nextProps.row?.long)
    && (prevProps.row?.address === nextProps.row?.address)
    && (prevProps.row?.number === nextProps.row?.number)
    && (prevProps.row?.phone_number === nextProps.row?.phone_number)
    && (prevProps.row?.email === nextProps.row?.email)
    && (prevProps.row?.name === nextProps.row?.name)
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const OrganizationTable = memo(function OrganizationTable({
                                                            row,
                                                            ids,
                                                            onChangeCheckbox,
                                                            hasAccessCheckbox,
                                                            hasAccessToAddEdit,
                                                            setOrganization,
                                                            setIsOpenEditOrganization,
                                                            setIsOpenHierarchyNodeModal,
                                                            setIsOpenRemoveOrganization,
                                                          }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();

  const MapTooltip = memo(function MapToolkit({ position }) {
    return (
      <PopoverRoot lazyMount positioning={{ placement: giveDir() === 'rtl' ? 'left' : 'right' }}>
        <PopoverTrigger asChild>
          <Button backgroundColor={'transparent'} _hover={{ backgroundColor: 'transparent' }}>
            <motion.div whileHover={{ rotate: [null, 15, -5] }} transition={{ duration: 0.3 }}>
              <Image loading="lazy" w={'30px'} src={map_icon} />
            </motion.div>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Box w={'400px'}
               backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}
               className={'box_shadow'}
               color={colorMode === 'light' ? 'black' : 'white'}>
            <Suspense fallback={'loading...'}>
              <MapComponent zoom={6} selectable={false} location={position} height={'400px'} />
            </Suspense>
          </Box>
        </PopoverContent>
      </PopoverRoot>
    );
  });

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      {hasAccessCheckbox &&
        <TableCell component="th" scope="row">
          <Center>
            <Checkbox sx={{ color: 'gray' }}
                      color="primary"
                      checked={ids.has(row?.id)}
                      onChange={() => onChangeCheckbox(row.id)}
                      inputProps={{ 'aria-labelledby': 'checkbox' }} />
          </Center>
        </TableCell>
      }

      <TableCell align={'center'} component="th" scope="row">
        <User userInfo={{
          username: row?.name,
          profile_pic: row?.image,
          email: row?.email,
        }} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        {row?.lat && <MapTooltip position={[row?.lat, row?.long]} />}
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText text={row?.address} maxLength={30} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText dir={'ltr'} text={row?.phone_number} maxLength={30} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText dir={'ltr'} text={row?.number} maxLength={30} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <Center>
          <HStack spacing={2}>
            {hasAccessToAddEdit(PUT_ORGANIZATION) &&
              <EditIcon onClick={() => {
                setOrganization(row);
                dispatch(setHasExpandedMapTrue());
                setIsOpenEditOrganization(true);
              }} />
            }

            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ORGANIZATION)) &&
              <RemoveIcon onClick={() => {
                setOrganization(row);
                setIsOpenRemoveOrganization(true);
              }} />
            }

            <Link href={`https://kando.hfz/qamus/${row?.profiling_id}`} target="_blank">
              <ProfilingIcon width={'1rem'} />
            </Link>

            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ORGANIZATION_HIERARCHY)) &&
              <SettingsIcon Icon={HierarchyVerticalIcon}
                            fontSize={'1.4rem'}
                            onClick={() => {
                              setOrganization(row);
                              setIsOpenHierarchyNodeModal(true);
                            }}
                            tooltipTitle={giveText(286)} />
            }
          </HStack>
        </Center>
      </TableCell>
    </TableRow>
  );
}, arePropsEqual);

export default OrganizationTable;
