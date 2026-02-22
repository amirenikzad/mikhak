import { memo, useCallback } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { hasPersianText } from '../../../BaseFunction.jsx';
import { TableText, User } from '../../../Extensions.jsx';
import { useSelector } from 'react-redux';
import { giveDir, giveText } from '../../../MultiLanguages/HandleLanguage.jsx';
import { Button, Center, HStack, Stack, Text } from '@chakra-ui/react';
import { SettingsIcon } from '../../../IconsFeatures/Icons.jsx';
import { ChatBubblesIcon } from '../../../CustomIcons/ChatBubblesIcon.jsx';
import { TicketXIcon } from '../../../CustomIcons/TicketXIcon.jsx';
import { PopoverBody, PopoverRoot, PopoverArrow, PopoverContent, PopoverTrigger } from '../../../../ui/popover.jsx';
import { GET_TICKET_CHAT, GET_TICKET_CLOSE } from '../../../UserAccessNames.jsx';
import { setReloadAgainCounts } from '../../../../../store/features/ticketSlice.jsx';
import { Tag } from '../../../../ui/tag.jsx';
import { useColorMode } from '../../../../ui/color-mode.jsx';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.row?.status === nextProps.row?.status) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const TicketTableRow = memo(function TicketTableRow({
                                                      row,
                                                      showClosedTime,
                                                      clickOnTicketChat,
                                                      closeable,
                                                      closeTicketAxios,
                                                    }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const { colorMode } = useColorMode();

  const statusTitle = useCallback((index, last_message_by_user) => {
    switch (index) {
      case 0:
        return (
          <Tag cursor={'default'} colorPalette={'green'} m={1}>
            <TableText text={giveText(9)} p={1} maxLength={30} copyable={false} />
          </Tag>
        );
      case 1:
        return last_message_by_user ? (
          <Tag cursor={'default'} colorPalette={'orange'} m={1}>
            <TableText text={giveText(350)} p={1} maxLength={30} copyable={false} />
          </Tag>
        ) : (
          <Tag cursor={'default'} colorPalette={'blue'} m={1}>
            <TableText text={giveText(351)} p={1} maxLength={30} copyable={false} />
          </Tag>
        );
      case 2:
        return (
          <Tag cursor={'default'} colorPalette={'red'} m={1}>
            <TableText text={giveText(352)} p={1} maxLength={30} copyable={false} />
          </Tag>
        );
    }
  }, []);

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell dir={hasPersianText(row?.subject) ? 'rtl' : 'ltr'} component="th" scope="row">
        <TableText text={row?.subject} maxLength={30} hasCenter={false} />
      </TableCell>

      <TableCell component="th" scope="row">
        <User gap={0}
              userInfo={{
                username: row?.user.username,
                profile_pic: row?.user.profile_pic,
              }} />
      </TableCell>

      <TableCell component="th" scope="row">
        {row?.service &&
          <User gap={0}
                userInfo={{
                  username: giveDir() === 'rtl' ? row?.service?.fa_name : row?.service?.en_name,
                  profile_pic: colorMode === 'light' ? row?.service?.light_icon : row?.service?.dark_icon,
                }} />
        }
      </TableCell>

      <TableCell component="th" scope="row">
        <TableText text={row?.category} maxLength={30} />
      </TableCell>

      <TableCell component="th" scope="row">
        <Center>
          {statusTitle(row?.status, row?.last_message_by_user)}
        </Center>
      </TableCell>

      <TableCell component="th" scope="row">
        <TableText text={row?.created_time} maxLength={30} />
      </TableCell>

      {showClosedTime &&
        <TableCell component="th" scope="row">
          <TableText text={row?.closed_time} maxLength={30} />
        </TableCell>
      }

      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_TICKET_CHAT) || (accessSlice.userAccess?.includes(GET_TICKET_CLOSE) && closeable)) &&
        <TableCell align={'center'} component="th" scope="row">
          <Center>
            <HStack>
              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_TICKET_CHAT)) &&
                <SettingsIcon tooltipTitle={giveText(347)}
                              Icon={ChatBubblesIcon}
                              onClick={() => {
                                clickOnTicketChat(row);
                              }} />
              }

              {(closeable && (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_TICKET_CLOSE))) &&
                <PopoverRoot lazyMount positioning={{ placement: giveDir() === 'rtl' ? 'right' : 'left' }}>
                  <PopoverTrigger asChild>
                    <SettingsIcon tooltipTitle={giveText(356)}
                                  Icon={TicketXIcon}
                                  color={['red', 'red']}
                                  hoverColor={['red', 'red']}
                                  fontSize={'1.8rem'} />
                  </PopoverTrigger>
                  <PopoverContent className={'box_shadow'}>
                    <PopoverArrow />

                    <PopoverBody px={2} py={3} cursor={'default'}>
                      <Stack gap={1}>
                        <Text cursor={'default'} fontSize={'14px'} fontWeight={'500'}>
                          {giveText(357)}
                        </Text>

                        <HStack spacing={1} dir={giveDir(true)}>
                          <Button colorPalette={'cyan'}
                                  size={'xs'}
                                  w={'80px'}
                                  px={3}
                                  onClick={() => {
                                    closeTicketAxios(row?.id);
                                    dispatch(setReloadAgainCounts());
                                  }}>
                            {giveText(299)}
                          </Button>
                        </HStack>
                      </Stack>
                    </PopoverBody>
                  </PopoverContent>
                </PopoverRoot>
              }
            </HStack>
          </Center>
        </TableCell>
      }
    </TableRow>
  );
}, arePropsEqual);

export default TicketTableRow;
