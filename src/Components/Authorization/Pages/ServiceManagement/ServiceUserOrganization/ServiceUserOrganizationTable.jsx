import { Avatar, Box, Center, HStack, Stack, Wrap } from '@chakra-ui/react';
import { TableText, User } from '../../../../Base/Extensions.jsx';
import { giveDir, giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { memo, useCallback, useMemo } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Collapse from '@mui/material/Collapse';
import { MENU_BACKGROUND_DARK, MENU_BACKGROUND_LIGHT } from '../../../../Base/BaseColor.jsx';
import { SettingsIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { CustomAvatarGroup } from '../../../../Base/CustomComponets/CustomAvatarGroup.jsx';
import { useColorMode } from '../../../../ui/color-mode.jsx';
import { Tag } from '../../../../ui/tag.jsx';
import { AvatarGroup } from '../../../../ui/avatar.jsx';
import { hasPersianText } from '../../../../Base/BaseFunction.jsx';
import { ChevronDownOutlineIcon } from '../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import { ChevronUpOutlineIcon } from '../../../../Base/CustomIcons/ChevronUpOutlineIcon.jsx';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.open[prevProps.index] === nextProps.open[prevProps.index]
    && (prevProps.row?.users === nextProps.row?.users)
    && (prevProps.row?.organizations === nextProps.row?.organizations)
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const ServiceUserOrganizationTable = memo(function ServiceUserOrganizationTable({
                                                                                  row,
                                                                                  index,
                                                                                  open,
                                                                                  setOpen,
                                                                                  hasAccess,
                                                                                  setIsOpenConfig,
                                                                                  setSelectedService,
                                                                                }) {
  const { colorMode } = useColorMode();
  const countOfUsersTags = useMemo(() => 5, []);
  const countOfOrganizationsTags = useMemo(() => 5, []);

  const customUsersAvatarValues = useCallback((row) => {
    let result = [];
    for (let i = 0; (row?.users.length > i && i < countOfUsersTags); i++) {
      result.push({
        name: `${row?.users[i]?.name} ${row?.users[i]?.family}`,
        email: row?.users[i]?.email,
        icon: row?.users[i]?.profile_pic,
      });
    }
    return result.splice(0, countOfUsersTags);
  }, []);

  const customOrganizationsAvatarValues = useCallback((row) => {
    let result = [];
    for (let i = 0; (row?.organizations.length > i && i < countOfOrganizationsTags); i++) {
      result.push({
        name: row?.organizations[i]?.name,
        email: row?.organizations[i]?.email,
        icon: row?.organizations[i]?.image,
      });
    }
    return result.splice(0, countOfOrganizationsTags);
  }, []);

  const onCollapse = useCallback((row) => {
    if (row?.users?.length > countOfUsersTags || row?.organizations?.length > countOfOrganizationsTags) {
      setOpen(prevList => {
        const newList = [...prevList];
        newList[index] = !newList[index];
        return newList;
      });
    }
  }, [setOpen]);

  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
        <TableCell>
          {(row?.organizations?.length > countOfUsersTags || row?.users?.length > countOfOrganizationsTags) &&
            <Box cursor={'pointer'} onClick={() => onCollapse(row)}>
              {open[index]
                ? <ChevronUpOutlineIcon width={'1rem'} color={colorMode === 'light' ? 'black' : 'white'} />
                : <ChevronDownOutlineIcon width={'1rem'} color={colorMode === 'light' ? 'black' : 'white'} />
              }
            </Box>
          }
        </TableCell>

        <TableCell align={hasPersianText(row?.service_name) ? 'right' : 'left'}
                   component="th"
                   scope="row"
                   sx={{ maxWidth: '200px' }}>
          <User maxLengthTop={15}
                maxLengthBottom={15}
                userInfo={{
                  username: giveDir() === 'rtl' ? row?.fa_name : row?.en_name,
                  profile_pic: colorMode === 'light' ? row?.light_icon : row?.dark_icon,
                }} />
        </TableCell>

        <TableCell align={'center'} component="th" scope="row" sx={{ width: '500px' }}>
          {!open[index] &&
            <Center>
              <AvatarGroup>
                {customUsersAvatarValues(row)?.map((value, index) => (
                  <CustomAvatarGroup key={index} value={value} />
                ))}

                {row?.users.length - countOfUsersTags > 0 &&
                  <Avatar.Root bgColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_LIGHT}
                               boxShadow={'md'}
                               cursor={'pointer'}
                               onClick={() => onCollapse(row)}>
                    <Avatar.Fallback>+{row?.users.length - countOfUsersTags}</Avatar.Fallback>
                  </Avatar.Root>
                }
              </AvatarGroup>
            </Center>
          }
        </TableCell>

        <TableCell align={'center'} component="th" scope="row">
          {!open[index] &&
            <Center>
              <AvatarGroup>
                {customOrganizationsAvatarValues(row)?.map((value, index) => (
                  <CustomAvatarGroup value={value} key={index} />
                ))}

                {row?.organizations.length - countOfOrganizationsTags > 0 &&
                  <Avatar.Root bgColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_LIGHT}
                               boxShadow={'md'}
                               cursor={'pointer'}
                               onClick={() => onCollapse(row)}>
                    <Avatar.Fallback>+{row?.organizations.length - countOfOrganizationsTags}</Avatar.Fallback>
                  </Avatar.Root>
                }
              </AvatarGroup>
            </Center>
          }
        </TableCell>

        {hasAccess &&
          <TableCell align={'center'} component="th" scope="row">
            <SettingsIcon onClick={() => {
              setSelectedService(row);
              setIsOpenConfig(true);
            }} />
          </TableCell>
        }
      </TableRow>

      <TableRow>
        <TableCell colSpan={6}
                   style={{
                     paddingBottom: 0,
                     paddingTop: 0,
                     borderBottomWidth: 1,
                     backgroundColor: colorMode === 'light' ? '#fafafa' : MENU_BACKGROUND_DARK,
                     borderTopColor: 'transparent',
                   }}>
          <Collapse in={open[index]} timeout="auto" unmountOnExit>
            <Stack style={{ margin: 8 }}>
              <TableText text={`${giveText(375)}:`}
                         cursor={'default'}
                         maxLength={40}
                         fontWeight={'600'}
                         fontSize={'16px'}
                         copyable={false}
                         hasCenter={false} />

              <Wrap gap={0} my={1}>
                {row?.organizations?.map((action, indexActions) => (
                  <Tag cursor={'default'}
                       key={indexActions}
                       borderRadius={9}
                       bgColor={'transparent'}
                       boxShadow={'md'}
                       p={2}
                       m={1}>
                    <User copyable={false}
                          avatarWidth={'30px'}
                          avatarHeight={'30px'}
                          userInfo={{
                            username: action.name,
                            profile_pic: action.logo,
                          }} />
                  </Tag>
                ))}
              </Wrap>

              <TableText text={`${giveText(374)}:`}
                         cursor={'default'}
                         maxLength={40}
                         fontWeight={'600'}
                         fontSize={'16px'}
                         copyable={false}
                         hasCenter={false} />

              <Wrap gap={0} my={1}>
                {row?.users?.map((action, indexActions) => (
                  <Tag cursor={'default'}
                       key={indexActions}
                       borderRadius={9}
                       bgColor={'transparent'}
                       boxShadow={'md'}
                       p={2}
                       m={1}>
                    <User copyable={false}
                          avatarWidth={'30px'}
                          avatarHeight={'30px'}
                          userInfo={{
                            username: action.name,
                            profile_pic: action.logo,
                          }} />
                  </Tag>
                ))}
              </Wrap>
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}, arePropsEqual);

export default ServiceUserOrganizationTable;
