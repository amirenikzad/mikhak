import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import {
  giveMessage,
  promiseToast,
  methodTagIconColor,
  updatePromiseToastError,
  checkStatus,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../../Base/BaseFunction.jsx';
import { useSelector } from 'react-redux';
import { giveDir, giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { DELETE_ROLES_PERMISSIONS, POST_ROLES_PERMISSIONS } from '../../../../../Base/UserAccessNames.jsx';
import { TableText } from '../../../../../Base/Extensions.jsx';
import { CustomCircularProgress } from '../../../../../Base/CustomComponets/CustomCircularProgress.jsx';
import { Tooltip } from '../../../../../ui/tooltip.jsx';
import { Switch } from '../../../../../ui/switch.jsx';
import { memo, useCallback, useState } from 'react';
import { useColorMode } from '../../../../../ui/color-mode.jsx';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { useQueryClient } from '@tanstack/react-query';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.row?.active === nextProps.row?.active) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const PermissionTable = memo(function PermissionTable({
                                                        index,
                                                        row,
                                                        reactQueryItemName,
                                                        selectedRole,
                                                      }) {
  const { colorMode } = useColorMode();
  const [isLoadingSwitches, setIsLoadingSwitches] = useState([]);
  const accessSlice = useSelector(state => state.accessSlice);
  const queryClient = useQueryClient();

  const addRolePermissionAxios = useCallback((permission_id, index) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ROLES_PERMISSIONS)) {
      const toastId = promiseToast();
      setIsLoadingSwitches((prevState) => [...prevState, index]);

      fetchWithAxios.post(`/role_permission?role_id=${selectedRole.role_id}&permission_id=${permission_id}`, {})
        .then((response) => {
          if (checkStatus({ status: response.data.status })) {
            queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
            setTimeout(() => {
              setIsLoadingSwitches((prevState) => prevState.filter(num => num !== index));
            }, 1000);
          }
          updatePromiseToastSuccessWarningInfo({ toastId, response });
          return {
            title: giveText(158),
            description: giveMessage(response.data.message),
            status: response.data.status,
          };
        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        });
    }
  }, [accessSlice.isAdmin, accessSlice.userAccess, reactQueryItemName, selectedRole.role_id]);

  const removeRolePermissionAxios = useCallback((roles_permissions_id, index) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ROLES_PERMISSIONS)) {
      const toastId = promiseToast();
      setIsLoadingSwitches((prevState) => [...prevState, index]);

      fetchWithAxios.delete(`/role_permission?id=${roles_permissions_id}`)
        .then((response) => {
          if (checkStatus({ status: response.data.status })) {
            queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
            setTimeout(() => {
              setIsLoadingSwitches((prevState) => prevState.filter(num => num !== index));
            }, 1000);
          }
          updatePromiseToastSuccessWarningInfo({ toastId, response });

        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        });
    }
  }, [accessSlice.isAdmin, accessSlice.userAccess, reactQueryItemName]);

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell component="th" scope="row">
        <Stack>
          <TableText text={`action: ${row?.action}`} maxLength={30} hasCenter={false} />
          <TableText text={`path: ${row?.path}`} maxLength={30} hasCenter={false}
                     color={methodTagIconColor(row?.method, colorMode)} />
        </Stack>
      </TableCell>

      <TableCell component="th" scope="row">
        <HStack spacing={2}>
          <Tooltip showArrow colorPalette={'white'} dir={'rtl'} textAlign={'center'}
                   borderRadius={5}
                   disabled={accessSlice.isAdmin ||
                     ((!row?.active && accessSlice.userAccess?.includes(POST_ROLES_PERMISSIONS))
                       || (row?.active && accessSlice.userAccess?.includes(DELETE_ROLES_PERMISSIONS))
                     )}
                   content={(
                     <Text dir={giveDir()} fontWeight={'500'} fontSize={'15px'}>
                       {giveText(118)}
                     </Text>
                   )}>
            <Box dir={giveDir()}>
              <Switch dir={'rtl'}
                      id={`edit_role_permission_${index}`}
                      checked={row?.active}
                      colorPalette={'cyan'}
                      size={'md'}
                      my={'auto'}
                      disabled={!accessSlice.isAdmin &&
                        (!accessSlice.userAccess?.includes(DELETE_ROLES_PERMISSIONS) && !accessSlice.userAccess?.includes(POST_ROLES_PERMISSIONS))
                        || isLoadingSwitches.includes(index)}
                      onCheckedChange={() => {
                        if (row?.active && (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ROLES_PERMISSIONS))) {
                          removeRolePermissionAxios(row?.roles_permissions_id, index);
                        } else if (!row?.active && (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ROLES_PERMISSIONS))) {
                          addRolePermissionAxios(row?.permission_id, index);
                        }
                      }} />
            </Box>
          </Tooltip>
          <Box my={'auto'} hidden={!isLoadingSwitches.includes(index)} p={0}>
            <CustomCircularProgress />
          </Box>
        </HStack>
      </TableCell>
    </TableRow>
  );
}, arePropsEqual);

export default PermissionTable;
