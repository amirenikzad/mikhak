import { Box, Center, HStack, Text, Wrap } from '@chakra-ui/react';
import { TableText, User } from '../../../../Base/Extensions.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { memo, useMemo } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Collapse from '@mui/material/Collapse';
import { MENU_BACKGROUND_DARK } from '../../../../Base/BaseColor.jsx';
import { SettingsIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { useColorMode } from '../../../../ui/color-mode.jsx';
import { Tooltip } from '../../../../ui/tooltip.jsx';
import { Tag } from '../../../../ui/tag.jsx';
import { ChevronUpOutlineIcon } from '../../../../Base/CustomIcons/ChevronUpOutlineIcon.jsx';
import { ChevronDownOutlineIcon } from '../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import Checkbox from '@mui/material/Checkbox';
import { ClickOutlineIcon } from '../../../../Base/CustomIcons/ClickOutlineIcon.jsx';
import { EngineeringIcon } from '../../../../Base/CustomIcons/EngineeringIcon.jsx';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.ids.has(prevProps.row?.user_id) === nextProps.ids.has(nextProps.row?.user_id)
    && (prevProps.open[prevProps.index] === nextProps.open[nextProps.index])
    && (prevProps.row?.roles === nextProps.row?.roles)
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const UserRoleTable = memo(function UserRoleTable({
                                                    row,
                                                    ids,
                                                    index,
                                                    open,
                                                    setOpen,
                                                    onChangeCheckbox,
                                                    hasAccessCheckbox,
                                                    openEditModal,
                                                    hasAccessMore,
                                                  }) {
  const countOfPermissionTags = useMemo(() => 5, []);
  const { colorMode } = useColorMode();

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

        <TableCell>
          {row?.roles?.length > countOfPermissionTags &&
            <Box cursor={'pointer'}
                 onClick={() => {
                   if (row?.roles?.length > countOfPermissionTags) {
                     setOpen(prevList => {
                       const newList = [...prevList];
                       newList[index] = !newList[index];
                       return newList;
                     });
                   }
                 }}>
              {open[index]
                ? <ChevronUpOutlineIcon width={'1rem'} color={colorMode === 'light' ? 'black' : 'white'} />
                : <ChevronDownOutlineIcon width={'1rem'} color={colorMode === 'light' ? 'black' : 'white'} />
              }
            </Box>
          }
        </TableCell>

        <TableCell component="th" scope="row">
          <User userInfo={{
            username: row.username,
            profile_pic: row.profile_pic,
            email: row.email,
          }} />
        </TableCell>

        <TableCell align={'center'} component="th" scope="row">
          {!open[index] &&
            <Center>
              <Wrap gap={1}>
                {row?.roles?.map((role, indexRole) => (
                  (indexRole < countOfPermissionTags) &&
                  <Tag key={indexRole} bgColor={'transparent'} boxShadow={'md'} px={1}>
                    <HStack gap={1}>
                      <EngineeringIcon width={'15px'} />

                      <TableText cursor={'default'}
                                 text={role.role_name}
                                 maxLength={15}
                                 mt={1}
                                 copyable={false} />
                    </HStack>
                  </Tag>
                ))}

                {row?.roles?.length > countOfPermissionTags &&
                  <Tooltip showArrow content={giveText(89)} bg={'black'} color={'white'}
                           fontWeight={'bold'}>
                    <Tag bgColor={'transparent'}
                         boxShadow={'md'}
                         cursor={'pointer'}
                         onClick={() => {
                           if (row?.roles?.length > countOfPermissionTags) {
                             setOpen(prevList => {
                               const newList = [...prevList];
                               newList[index] = !newList[index];
                               return newList;
                             });
                           }
                         }}>
                      <HStack gap={1}>
                        <ClickOutlineIcon width={'15px'} />
                        <Text mt={1}>{giveText(8)}...</Text>
                      </HStack>
                    </Tag>
                  </Tooltip>
                }
              </Wrap>
            </Center>
          }
        </TableCell>

        {hasAccessMore &&
          <TableCell align={'center'} component="th" scope="row">
            <Center>
              <HStack spacing={2}>
                <SettingsIcon onClick={() => openEditModal(row)} />
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
              <TableText text={`${giveText(101)}:`}
                         cursor={'default'}
                         fontWeight={'600'}
                         maxLength={30}
                         fontSize={'16px'}
                         hasCenter={false}
                         copyable={false} />

              <Wrap gap={2} my={2}>
                {row?.roles?.map((role, indexActions) => (
                  <Tag key={indexActions} cursor={'default'} bgColor={'transparent'} boxShadow={'md'} px={1}>
                    <HStack gap={1}>
                      <EngineeringIcon width={'15px'} />

                      <TableText maxLength={50} cursor={'default'} copyable={false} mt={1} text={role.role_name} />
                    </HStack>
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

export default UserRoleTable;
