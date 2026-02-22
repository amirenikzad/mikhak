import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, HStack, Text } from '@chakra-ui/react';
import { User } from '../../../../../Base/Extensions.jsx';
import { Tooltip } from '../../../../../ui/tooltip.jsx';
import { DELETE_USER_ROLE, POST_USER_ROLE } from '../../../../../Base/UserAccessNames.jsx';
import { giveDir, giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { Switch } from '../../../../../ui/switch.jsx';
import { CustomCircularProgress } from '../../../../../Base/CustomComponets/CustomCircularProgress.jsx';
import { useSelector } from 'react-redux';
import { memo } from 'react';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.isLoadingSwitches.includes(prevProps.index) === nextProps.isLoadingSwitches.includes(nextProps.index)
    && prevProps.row?.status === nextProps.row?.status) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const UsersTable = memo(function UsersTable({
                                              row,
                                              index,
                                              isLoadingSwitches,
                                              removeRolePermissionAxios,
                                              addRolePermissionAxios,
                                            }) {
  const accessSlice = useSelector(state => state.accessSlice);

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell component="th" scope="row">
        <User dir={'ltr'}
              userInfo={{
                username: row?.username,
                profile_pic: row?.profile_pic,
                email: row?.email,
              }} />
      </TableCell>

      <TableCell component="th" scope="row">
        <HStack spacing={2}>
          <Tooltip showArrow colorPalette={'white'} dir={'rtl'} textAlign={'center'} borderRadius={5}
                   disabled={accessSlice.isAdmin ||
                     ((!row?.active && accessSlice.userAccess?.includes(POST_USER_ROLE))
                       || (row?.active && accessSlice.userAccess?.includes(DELETE_USER_ROLE))
                     )}
                   content={(
                     <Text dir={giveDir()} fontWeight={'500'} fontSize={'15px'}>
                       {giveText(118)}
                     </Text>
                   )}>
            <Box dir={giveDir()}>
              <Switch id={`row_${index}`}
                      dir={'rtl'}
                      checked={row?.status}
                      colorPalette={'cyan'}
                      size={'md'}
                      my={'auto'}
                      disabled={!accessSlice.isAdmin &&
                        (!accessSlice.userAccess?.includes(POST_USER_ROLE) && !accessSlice.userAccess?.includes(DELETE_USER_ROLE))
                        || isLoadingSwitches.includes(index)
                      }
                      onCheckedChange={() => {
                        if (row?.status && (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_USER_ROLE))) {
                          removeRolePermissionAxios(row?.user_role_id, index);
                        } else if (!row?.status && (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_USER_ROLE))) {
                          addRolePermissionAxios(row?.id, index);
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

export default UsersTable;
