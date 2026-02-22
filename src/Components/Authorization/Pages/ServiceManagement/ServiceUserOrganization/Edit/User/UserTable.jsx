import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, HStack, Text } from '@chakra-ui/react';
import { User } from '../../../../../../Base/Extensions.jsx';
import { Tooltip } from '../../../../../../ui/tooltip.jsx';
import {
  POST_SERVICE_USER_ORGANIZATION,
  DELETE_SERVICE_USER_ORGANIZATION,
} from '../../../../../../Base/UserAccessNames.jsx';
import { giveDir, giveText } from '../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { Switch } from '../../../../../../ui/switch.jsx';
import { CustomCircularProgress } from '../../../../../../Base/CustomComponets/CustomCircularProgress.jsx';
import { useSelector } from 'react-redux';
import { memo, useState } from 'react';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.row?.active === nextProps.row?.active) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const UserTable = memo(function UserTable({
                                            row,
                                            index,
                                            reactQueryItemName,
                                            removeServiceUserOrganizationAxios,
                                            addServiceUserOrganizationAxios,
                                          }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const [isLoadingSwitches, setIsLoadingSwitches] = useState([]);

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell component="th" scope="row">
        <User userInfo={{
          username: row?.name,
          profile_pic: row?.image,
          email: row?.email,
        }} />
      </TableCell>

      <TableCell component="th" scope="row">
        <HStack spacing={2}>
          <Tooltip showArrow colorPalette={'white'} dir={'rtl'} textAlign={'center'} borderRadius={5}
                   disabled={accessSlice.isAdmin ||
                     ((!row?.active && accessSlice.userAccess?.includes(POST_SERVICE_USER_ORGANIZATION))
                       || (row?.active && accessSlice.userAccess?.includes(DELETE_SERVICE_USER_ORGANIZATION))
                     )}
                   content={(
                     <Text dir={giveDir()} fontWeight={'500'} fontSize={'15px'}>
                       {giveText(118)}
                     </Text>
                   )}>
            <Box dir={giveDir()}>
              <Switch id={`row_${index}`}
                      checked={row?.active}
                      colorPalette="cyan"
                      size={'md'}
                      my={'auto'}
                      disabled={!accessSlice.isAdmin &&
                        (!accessSlice.userAccess?.includes(POST_SERVICE_USER_ORGANIZATION) && !accessSlice.userAccess?.includes(DELETE_SERVICE_USER_ORGANIZATION))
                        || isLoadingSwitches.includes(index)
                      }
                      onCheckedChange={() => {
                        if (row?.active && (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_SERVICE_USER_ORGANIZATION))) {
                          removeServiceUserOrganizationAxios({
                            reactQueryItemName,
                            service_user_organization_id: row?.service_user_organization_id,
                            index,
                            setIsLoadingSwitches,
                          });
                        } else if (!row?.active && (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_SERVICE_USER_ORGANIZATION))) {
                          addServiceUserOrganizationAxios({
                            reactQueryItemName,
                            setIsLoadingSwitches,
                            user_id: row?.id,
                            index,
                          });
                        }
                      }}
              />
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

export default UserTable;
