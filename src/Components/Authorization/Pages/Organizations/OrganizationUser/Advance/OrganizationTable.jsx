import { useSelector } from 'react-redux';
import { memo } from 'react';
import TableCell from '@mui/material/TableCell';
import { User } from '../../../../../Base/Extensions.jsx';
import { Box, HStack, Text } from '@chakra-ui/react';
import { Tooltip } from '../../../../../ui/tooltip.jsx';
import { DELETE_ORGANIZATION_USER, POST_ORGANIZATION_USER } from '../../../../../Base/UserAccessNames.jsx';
import { giveDir, giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { Switch } from '../../../../../ui/switch.jsx';
import { CustomCircularProgress } from '../../../../../Base/CustomComponets/CustomCircularProgress.jsx';
import TableRow from '@mui/material/TableRow';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.isLoadingSwitches.includes(prevProps.index) === nextProps.isLoadingSwitches.includes(nextProps.index)
    && prevProps.row?.status === nextProps.row?.status
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const OrganizationTable = memo(function OrganizationTable({
                                                            row,
                                                            index,
                                                            isLoadingSwitches,
                                                            removeOrganizationRoleAxios,
                                                            addOrganizationRolesAxios,
                                                          }) {
  const accessSlice = useSelector(state => state.accessSlice);

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell component="th" scope="row">
        <User userInfo={{
          username: row?.name,
          profile_pic: row?.image,
          email: row?.mission,
        }} />
      </TableCell>
      <TableCell component="th" scope="row">
        <HStack spacing={2}>
          <Tooltip showArrow colorPalette={'white'} dir={'rtl'} textAlign={'center'} borderRadius={5}
                   disabled={accessSlice.isAdmin ||
                     ((!row?.status && accessSlice.userAccess?.includes(POST_ORGANIZATION_USER))
                       || (row?.status && accessSlice.userAccess?.includes(DELETE_ORGANIZATION_USER))
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
                      colorPalette="cyan"
                      size={'md'}
                      my={'auto'}
                      disabled={!accessSlice.isAdmin &&
                        (!accessSlice.userAccess?.includes(POST_ORGANIZATION_USER) && !accessSlice.userAccess?.includes(DELETE_ORGANIZATION_USER))
                        || isLoadingSwitches.includes(index)
                      }
                      onCheckedChange={() => {
                        if (row?.status && (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ORGANIZATION_USER))) {
                          removeOrganizationRoleAxios(row?.org_user_id, index);
                        } else if (!row?.status && (accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_ORGANIZATION_USER))) {
                          addOrganizationRolesAxios(row?.id, index);
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

export default OrganizationTable;
