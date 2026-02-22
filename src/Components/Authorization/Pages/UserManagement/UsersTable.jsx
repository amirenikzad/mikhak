import { Box, Center, HStack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { memo } from 'react';
import { TableText, User } from '../../../Base/Extensions.jsx';
import { EditIcon, RemoveIcon, SettingsIcon, UserActiveIcon, UserAdminIcon, UserDaemonIcon} from '../../../Base/IconsFeatures/Icons.jsx';
import { giveDir, giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {
  PUT_USER,
  DELETE_USER,
  GET_USER_ROLE,
  PUT_PASSWORD_ADMIN,
  GET_TRANSACTION_USERS_WALLET,
  GET_LOGIN_HISTORY,
} from '../../../Base/UserAccessNames.jsx';
import { CustomCircularProgress } from '../../../Base/CustomComponets/CustomCircularProgress.jsx';
import { ADMIN_ROUTE, TRANSACTION_ROUTE, USER_INFO_ROUTE, USERS_WALLET_ROUTE } from '../../../Base/BaseRouts.jsx';
import { Tooltip } from '../../../ui/tooltip.jsx';
import { TransactionIcon } from '../../../Base/CustomIcons/TransactionIcon.jsx';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router';
import { UsersManagementIcon } from '../../../Base/CustomIcons/UsersManagementIcon.jsx';
import { HistoryIcon } from '../../../Base/CustomIcons/HistoryIcon.jsx';
import { WalletIcon } from '../../../Base/CustomIcons/WalletIcon.jsx';
import { CustomIconGroup } from '../../../Base/CustomComponets/CustomIconGroup.jsx';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.ids?.has(prevProps.row?.id) === nextProps.ids?.has(nextProps.row?.id)
    && (prevProps.isLoadingActiveSwitches.includes(prevProps.index) === nextProps.isLoadingActiveSwitches.includes(nextProps.index))
    && (prevProps.isLoadingAdminSwitches.includes(prevProps.index) === nextProps.isLoadingAdminSwitches.includes(nextProps.index))
    && (prevProps.isLoadingDaemonSwitches.includes(prevProps.index) === nextProps.isLoadingDaemonSwitches.includes(nextProps.index))
    && (prevProps.row?.username === nextProps.row?.username)
    && (prevProps.row?.email === nextProps.row?.email)
    && (prevProps.row?.name === nextProps.row?.name)
    && (prevProps.row?.family === nextProps.row?.family)
    // && (prevProps.row?.description === nextProps.row?.description)
    && (prevProps.row?.creator === nextProps.row?.creator)
    && (prevProps.row?.admin === nextProps.row?.admin)
    && (prevProps.row?.daemon== nextProps.row?.daemon)
    && (prevProps.row?.disabled === nextProps.row?.disabled)
    && (prevProps.row?.profile_pic === nextProps.row?.profile_pic)
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const UsersTable = memo(function UsersTable({
                                              row,
                                              ids,
                                              index,
                                              onChangeCheckbox,
                                              hasAccessCheckbox,
                                              checkAccess,
                                              // updateOnTable,
                                              patchUserFlag,

                                              isLoadingActiveSwitches,
                                              setIsLoadingActiveSwitches,
                                              isLoadingAdminSwitches,
                                              isLoadingDaemonSwitches,
                                              setIsLoadingAdminSwitches,
                                              setIsLoadingDaemonSwitches,
                                              setUserList,
                                              setOpenUserRole,
                                              setOpenEdit,
                                              setOpenRemove,
                                            }) {
  const accessSlice = useSelector(state => state.accessSlice);
  // const navigate = useNavigate();

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

      <TableCell component="th" scope="row">
        <User dir={giveDir()}
              userInfo={{
                username: row?.username,
                profile_pic: row?.profile_pic,
                email: row?.email,
              }} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText text={row?.name} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText text={row?.family} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <Center>
          <HStack spacing={2}>
            <Tooltip showArrow content={giveText(5)} bg={'black'} color={'white'} fontWeight={'bold'}>
              <Box display={'inline-block'}
                   cursor={(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_USER)) && !isLoadingActiveSwitches.includes(index) ? 'pointer' : 'default'}
                   onClick={() => {
                     if (accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_USER)) {
                       setIsLoadingActiveSwitches((prevState) => [...prevState, index]);
                       if (!isLoadingActiveSwitches.includes(index)) {
                        //  updateOnTable({
                        //    disabled: !row?.disabled,
                        //    usersListValue: row,
                        //    index: index,
                        //  });
                        patchUserFlag({
                          url: '/activity',
                          active: !row?.disabled,
                          user_ids: [row.id],
                          accessName: PUT_USER,
                          index,
                          setLoading: setIsLoadingActiveSwitches,
                        });

                       }
                     }
                   }}>
                <UserActiveIcon isActive={!row?.disabled} />
              </Box>
            </Tooltip>
            <Box my={'auto'} hidden={!isLoadingActiveSwitches.includes(index)} p={0}>
              <CustomCircularProgress />
            </Box>
          </HStack>
        </Center>
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <Center>
          <HStack spacing={2}>
            <Tooltip showArrow content={giveText(6)} bg={'black'} color={'white'} fontWeight={'bold'}>
              <Box display={'inline-block'}
                   cursor={(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_USER)) && !isLoadingAdminSwitches.includes(index) ? 'pointer' : 'default'}
                   onClick={() => {
                     if (accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_USER)) {
                       setIsLoadingAdminSwitches((prevState) => [...prevState, index]);
                       if (!isLoadingAdminSwitches.includes(index)) {
                        //  updateOnTable({
                        //    admin: !row?.admin,
                        //    usersListValue: row,
                        //    index: index,
                        //  });
                        patchUserFlag({
                          url: '/admin',
                          active: !row?.admin,
                          user_ids: [row.id],
                          accessName: PUT_USER,
                          index,
                          setLoading: setIsLoadingAdminSwitches,
                        });

                       }
                     }
                   }}>
                <UserAdminIcon isAdmin={row?.admin} />
              </Box>
            </Tooltip>
            <Box my={'auto'} hidden={!isLoadingAdminSwitches.includes(index)} p={0}>
              <CustomCircularProgress />
            </Box>
          </HStack>
        </Center>
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <Center>
          <HStack spacing={2}>
            <Tooltip showArrow content={giveText(5)} bg={'black'} color={'white'} fontWeight={'bold'}>
              <Box display={'inline-block'}
                   cursor={(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_USER)) && !isLoadingDaemonSwitches.includes(index) ? 'pointer' : 'default'}
                   onClick={() => {
                     if (accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_USER)) {
                       setIsLoadingDaemonSwitches((prevState) => [...prevState, index]);
                       if (!isLoadingDaemonSwitches.includes(index)) {
                        //  updateOnTable({
                        //    daemon: !row?.daemon,
                        //    usersListValue: row,
                        //    index: index,
                        //  });
                        patchUserFlag({
                          url: '/daemon',
                          active: !row?.daemon,
                          user_ids: [row.id],
                          accessName: PUT_USER,
                          index,
                          setLoading: setIsLoadingDaemonSwitches,
                        });

                       }
                     }
                   }}>
                <UserDaemonIcon isDaemon={row?.daemon} />
              </Box>
            </Tooltip>
            <Box my={'auto'} hidden={!isLoadingDaemonSwitches.includes(index)} p={0}>
              <CustomCircularProgress />
            </Box>
          </HStack>
        </Center>
      </TableCell>

      {/* <TableCell align={'center'} component="th" scope="row">
        <TableText maxLength={15} text={row?.creator?.username} />
      </TableCell> */}
      <TableCell component="th" scope="row">
        <User dir={giveDir()}
              userInfo={{
                username: row?.creator?.username,
                profile_pic: row?.creator?.profile_pic,
                email: row?.creator?.name+' '+row?.creator?.name,
                // email: row?.creator?.family,
                // family: row?.creator?.family,
              }} />
      </TableCell>

      {checkAccess &&
        <TableCell align={'center'} component="th" scope="row">
          <Center>
            <HStack spacing={2}>
              
              {/* <CustomIconGroup value={row} /> */}

              {/* {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_LOGIN_HISTORY)) &&
                <SettingsIcon tooltipTitle={giveText(192)}
                              Icon={WalletIcon}
                              size={'lg'}
                              onClick={() => {
                                // navigate(`${ADMIN_ROUTE}${USERS_WALLET_ROUTE}?search=${row?.id}`);
                                navigate(`${ADMIN_ROUTE}${USERS_WALLET_ROUTE}?search=${row?.username}`);
                              }} />
              }

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_LOGIN_HISTORY)) &&
                <SettingsIcon tooltipTitle={giveText(427)}
                              Icon={HistoryIcon}
                              size={'lg'}
                              onClick={() => {
                                // navigate(`${ADMIN_ROUTE}${USER_INFO_ROUTE}?search=${row?.username}`);
                                // ?search_user_name=50111&search_user_id=1
                                // navigate(`${ADMIN_ROUTE}${USER_INFO_ROUTE}?search_user_name=${row?.username}?search_user_id=${row?.creator?.id}`);
                                navigate(`${ADMIN_ROUTE}${USER_INFO_ROUTE}?uname=${row?.username}&uid=${row?.id}`);
                              }} />
              }
              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_TRANSACTION_USERS_WALLET)) &&
                <SettingsIcon tooltipTitle={giveText(205)}
                              Icon={TransactionIcon}
                              size={'lg'}
                              onClick={() => {
                                navigate(`${ADMIN_ROUTE}${TRANSACTION_ROUTE}?uname=${row?.username}&uid=${row?.id}`);
                              }} />
              } */}

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_USER_ROLE) || accessSlice.userAccess?.includes(PUT_USER)) &&
                <SettingsIcon tooltipTitle={giveText(379)}
                              onClick={() => {
                                setUserList(row);
                                setOpenUserRole(true);
                              }} />
              }

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_USER) || accessSlice.userAccess?.includes(PUT_PASSWORD_ADMIN)) &&
                <EditIcon tooltipTitle={giveText(390)}
                          onClick={() => {
                            setUserList(row);
                            setOpenEdit(true);
                          }} />
              }

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_USER)) &&
                <RemoveIcon onClick={() => {
                  setUserList(row);
                  setOpenRemove(true);
                }} />
              }
              <CustomIconGroup value={row} />
            </HStack>
          </Center>
        </TableCell>
      }
    </TableRow>
  );
}, arePropsEqual);

export default UsersTable;
