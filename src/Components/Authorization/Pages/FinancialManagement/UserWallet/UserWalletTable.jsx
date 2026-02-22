import { Box, Center, HStack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { TableText, User } from '../../../../Base/Extensions.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { memo } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { PUT_AMOUNT, PUT_SUSPEND } from '../../../../Base/UserAccessNames.jsx';
import { SettingsIcon, WalletSuspendIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { CustomCircularProgress } from '../../../../Base/CustomComponets/CustomCircularProgress.jsx';
import { commaForEvery3Digit } from '../../../../Base/BaseFunction.jsx';
import { Tooltip } from '../../../../ui/tooltip.jsx';
import { MoneyBagIcon } from '../../../../Base/CustomIcons/MoneyBagIcon.jsx';
import Checkbox from '@mui/material/Checkbox';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.ids.has(prevProps.row?.user_id) === nextProps.ids.has(nextProps.row?.user_id)
    && (prevProps.isLoadingSuspendSwitches.includes(prevProps.index) === nextProps.isLoadingSuspendSwitches.includes(nextProps.index))
    && (prevProps.row?.amount === nextProps.row?.amount)
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const UserWalletTable = memo(function UserWalletTable({
                                                        row,
                                                        ids,
                                                        index,
                                                        onChangeCheckbox,
                                                        hasAccessCheckbox,
                                                        isLoadingSuspendSwitches,
                                                        setIsLoadingSuspendSwitches,
                                                        suspendAxios,
                                                        checkAccess,
                                                        setFormField,
                                                        setIsOpenAddPrice,
                                                      }) {
  const accessSlice = useSelector(state => state.accessSlice);

  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1}>
        {hasAccessCheckbox &&
          <TableCell component="th" scope="row">
            <Center>
              <Checkbox sx={{ color: 'gray' }}
                        color="primary"
                        checked={ids.has(row?.user_id)}
                        onChange={() => onChangeCheckbox(row.user_id)}
                        inputProps={{ 'aria-labelledby': 'checkbox' }} />
            </Center>
          </TableCell>
        }

        <TableCell align={'center'} component="th" scope="row">
          <User userInfo={{
            username: row.username,
            profile_pic: row.profile_pic,
            email: row.email,
          }} />
        </TableCell>

        <TableCell align={'center'} component="th" scope="row">
          <TableText cursor={'default'} text={row.wallet_number} maxLength={20} />
        </TableCell>

        <TableCell align={'center'} component="th" scope="row">
          <TableText cursor={'default'}
                     text={`${commaForEvery3Digit(row?.amount)} ` + giveText(213)}
                     maxLength={30} />
        </TableCell>

        <TableCell align={'center'} component="th" scope="row">
          <Center>
            <HStack spacing={2}>
              <Tooltip showArrow content={giveText(5)} bg={'black'} color={'white'}
                       fontWeight={'bold'}>
                <Box display={'inline-block'}
                     cursor={(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SUSPEND)) && !isLoadingSuspendSwitches.includes(index) ? 'pointer' : 'default'}
                     onClick={() => {
                       if (accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SUSPEND)) {
                         setIsLoadingSuspendSwitches((prevState) => [...prevState, index]);

                         if (row.suspend) {
                           suspendAxios({
                             status: false,
                             suspend_user_ids: [row.user_id],
                             index: index,
                           });
                         } else {
                           suspendAxios({
                             status: true,
                             suspend_user_ids: [row.user_id],
                             index: index,
                           });
                         }
                       }
                     }}>
                  <WalletSuspendIcon isSuspend={row.suspend} />
                </Box>
              </Tooltip>
              <Box my={'auto'} hidden={!isLoadingSuspendSwitches.includes(index)} p={0}>
                <CustomCircularProgress />
              </Box>
            </HStack>
          </Center>
        </TableCell>

        {checkAccess &&
          <TableCell align={'center'} component="th" scope="row">
            <Center>
              <HStack spacing={2}>
                {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_AMOUNT)) &&
                  <SettingsIcon Icon={MoneyBagIcon}
                                tooltipTitle={giveText(186)}
                                onClick={() => {
                                  setFormField(row);
                                  setIsOpenAddPrice(true);
                                }} />
                }
              </HStack>
            </Center>
          </TableCell>
        }
      </TableRow>
    </>
  );
}, arePropsEqual);

export default UserWalletTable;
