import { Avatar, AvatarGroup, Box, Center, HStack, Wrap } from '@chakra-ui/react';
import { hasPersianText } from '../../../../Base/BaseFunction.jsx';
import { useSelector } from 'react-redux';
import { TableText, User } from '../../../../Base/Extensions.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { memo, useCallback, useMemo } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Collapse from '@mui/material/Collapse';
import { GET_ORGANIZATION_USER } from '../../../../Base/UserAccessNames.jsx';
import { MENU_BACKGROUND_DARK, MENU_BACKGROUND_LIGHT } from '../../../../Base/BaseColor.jsx';
import { SettingsIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { useColorMode } from '../../../../ui/color-mode.jsx';
import { Tag } from '../../../../ui/tag.jsx';
import { ChevronDownOutlineIcon } from '../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import { ChevronUpOutlineIcon } from '../../../../Base/CustomIcons/ChevronUpOutlineIcon.jsx';
import { CustomAvatarGroup } from '../../../../Base/CustomComponets/CustomAvatarGroup.jsx';
import Checkbox from '@mui/material/Checkbox';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.ids.has(prevProps.row?.organization_id) === nextProps.ids.has(nextProps.row?.organization_id)
    && (prevProps.open[prevProps.index] === nextProps.open[nextProps.index])
    && (prevProps.row?.users === nextProps.row?.users)
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const OrganizationUserTable = memo(function OrganizationUserTable({
                                                                    row,
                                                                    ids,
                                                                    onChangeCheckbox,
                                                                    hasAccessCheckbox,
                                                                    open,
                                                                    setOpen,
                                                                    index,
                                                                    setSelectedOrganization,
                                                                    setIsOpenConfig,
                                                                  }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const countOfUsersTags = useMemo(() => 9, []);
  const { colorMode } = useColorMode();

  const customAvatarValues = useCallback((row) => {
    let result = [];
    for (let i = 0; (row?.users.length > i && i < countOfUsersTags); i++) {
      result.push({
        name: row?.users[i]?.username,
        email: row?.users[i]?.email,
        icon: row?.users[i]?.profile_pic,
      });
    }
    return result.splice(0, countOfUsersTags);
  }, []);

  const onCollapse = useCallback((row) => {
    if (row?.users?.length > countOfUsersTags) {
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
        {hasAccessCheckbox &&
          <TableCell component="th" scope="row">
            <Center>
              <Checkbox sx={{ color: 'gray' }}
                        color="primary"
                        checked={ids.has(row?.organization_id)}
                        onChange={() => onChangeCheckbox(row.organization_id)}
                        inputProps={{ 'aria-labelledby': 'checkbox' }} />
            </Center>
          </TableCell>
        }

        <TableCell>
          <Box cursor={'pointer'} onClick={() => onCollapse(row)}>
            {row?.users?.length > countOfUsersTags
              ? (open[index]
                  ? <ChevronUpOutlineIcon width={'1rem'} color={colorMode === 'light' ? 'black' : 'white'} />
                  : <ChevronDownOutlineIcon width={'1rem'} color={colorMode === 'light' ? 'black' : 'white'} />
              )
              : null
            }
          </Box>
        </TableCell>

        <TableCell align={'center'} component="th" scope="row" sx={{ maxWidth: '200px' }}>
          <Box dir={hasPersianText(row.role_name) ? 'rtl' : 'ltr'}>
            <User cursor={'default'}
                  userInfo={{
                    username: row.organization_name,
                    profile_pic: row.image,
                    email: row.mission,
                  }} />
          </Box>
        </TableCell>

        <TableCell align={'center'} component="th" scope="row" sx={{ minWidth: '400px' }}>
          {!open[index] &&
            <Center>
              <AvatarGroup>
                {customAvatarValues(row)?.map((value, index) => (
                  <CustomAvatarGroup value={value} key={index} />
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

        {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ORGANIZATION_USER)) &&
          <TableCell align={'center'} component="th" scope="row">
            <Center>
              <HStack spacing={2}>
                <SettingsIcon onClick={() => {
                  setSelectedOrganization(row);
                  setIsOpenConfig(true);
                }} />
              </HStack>
            </Center>
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
            <Box style={{ margin: 8 }}>
              <TableText text={`${giveText(100)}:`}
                         cursor={'default'}
                         maxLength={40}
                         fontWeight={'600'}
                         fontSize={'16px'}
                         hasCenter={false} />

              <Wrap gap={2} mt={1}>
                {row?.users?.map((user, index) => (
                  <Tag cursor={'default'}
                       key={index}
                       borderRadius={5}
                       bgColor={'transparent'}
                       boxShadow={'md'}
                       p={1}
                       m={1}>
                      <User copyable={false}
                            userInfo={{
                              username: user.username,
                              profile_pic: user.profile_pic,
                              email: user.email,
                            }} />
                  </Tag>
                ))}
              </Wrap>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}, arePropsEqual);

export default OrganizationUserTable;
