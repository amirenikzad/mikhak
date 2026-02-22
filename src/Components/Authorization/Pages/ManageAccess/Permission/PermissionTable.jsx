import { Box, Center, HStack, Text } from '@chakra-ui/react';
import { methodTagIconColor } from '../../../../Base/BaseFunction.jsx';
import { useSelector } from 'react-redux';
import { TableText } from '../../../../Base/Extensions.jsx';
import { memo } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { PUT_PERMISSIONS, DELETE_PERMISSIONS } from '../../../../Base/UserAccessNames.jsx';
import { CustomCircularProgress } from '../../../../Base/CustomComponets/CustomCircularProgress.jsx';
import { EditIcon, RemoveIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { CircularCrossIcon } from '../../../../Base/CustomIcons/CircularCrossIcon.jsx';
import { CircularCheckIcon } from '../../../../Base/CustomIcons/CircularCheckIcon.jsx';
import Checkbox from '@mui/material/Checkbox';
import { useColorMode } from '../../../../ui/color-mode.jsx';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.ids.has(prevProps.row?.id) === nextProps.ids.has(nextProps.row?.id)
    && (prevProps.isLoadingIsDefault.includes(prevProps.row.id) === nextProps.isLoadingIsDefault.includes(nextProps.row.id))
    && (prevProps.row?.action.value === nextProps.row?.action.value)
    && (prevProps.row?.method.value === nextProps.row?.method.value)
    && (prevProps.row?.path.value === nextProps.row?.path.value)
    && (prevProps.row?.description.value === nextProps.row?.description.value)
    && (prevProps.row?.is_default.value === nextProps.row?.is_default.value)
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const PermissionTable = memo(function PermissionTable({
                                                        row,
                                                        ids,
                                                        onChangeCheckbox,
                                                        hasAccessCheckbox,
                                                        isLoadingIsDefault,
                                                        setIsLoadingIsDefault,
                                                        editPermissionAxios,
                                                        setFormField,
                                                        setIsOpenEditModal,
                                                        setIsOpenRemoveModal,
                                                      }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const { colorMode } = useColorMode();

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
        <TableText text={row.action.value} maxLength={30} hasCenter={false} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <Center>
          <Box backgroundColor={methodTagIconColor(row.method.value, colorMode)}
               w={'65px'}
               borderRadius={5}
               pt={'2px'}>
            <Text color={'black'} cursor={'default'}>
              {row.method.value?.toString().toUpperCase()}
            </Text>
          </Box>
        </Center>
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText maxLength={20} text={row.path.value} hasCenter={false} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <Center>
          <HStack spacing={2}>
            <Box display={'inline-block'}
                 cursor={(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PERMISSIONS)) && !isLoadingIsDefault.includes(row.id) ? 'pointer' : 'default'}
                 onClick={() => {
                   if ((accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PERMISSIONS)) && !isLoadingIsDefault.includes(row.id)) {
                     setIsLoadingIsDefault((prevState) => [...prevState, row.id]);
                     editPermissionAxios({
                       permissionForm: {
                         ...row,
                         is_default: { value: !row.is_default.value },
                       },
                       index: row.id,
                       update: true,
                     });
                   }
                 }}>
              {row.is_default.value
                ? <CircularCheckIcon color={'green'} width={'1.6rem'} />
                : <CircularCrossIcon color={'red'} width={'1.6rem'} />
              }
            </Box>

            <Box my={'auto'} hidden={!isLoadingIsDefault.includes(row.id)} p={0}>
              <CustomCircularProgress />
            </Box>
          </HStack>
        </Center>
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText maxLength={40} text={row.description.value} hasCenter={false} />
      </TableCell>

      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PERMISSIONS) || accessSlice.userAccess?.includes(DELETE_PERMISSIONS)) &&
        <TableCell align={'center'} component="th" scope="row">
          <Center>
            <HStack spacing={2}>
              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PERMISSIONS)) &&
                <EditIcon onClick={() => {
                  setFormField(row);
                  setIsOpenEditModal(true);
                }} />
              }

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_PERMISSIONS)) &&
                <RemoveIcon onClick={() => {
                  setFormField(row);
                  setIsOpenRemoveModal(true);
                }} />
              }
            </HStack>
          </Center>
        </TableCell>
      }
    </TableRow>
  );
}, arePropsEqual);

export default PermissionTable;
