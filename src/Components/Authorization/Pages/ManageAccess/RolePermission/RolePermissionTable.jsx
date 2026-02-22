import { Box, Center, HStack, Text, Wrap } from '@chakra-ui/react';
import { hasPersianText, methodTagIconColor } from '../../../../Base/BaseFunction.jsx';
import { TableText } from '../../../../Base/Extensions.jsx';
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
import { ChevronDownOutlineIcon } from '../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import { ChevronUpOutlineIcon } from '../../../../Base/CustomIcons/ChevronUpOutlineIcon.jsx';
import Checkbox from '@mui/material/Checkbox';
import { ClickOutlineIcon } from '../../../../Base/CustomIcons/ClickOutlineIcon.jsx';
import { UsersLockIcon } from '../../../../Base/CustomIcons/UsersLockIcon.jsx';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.ids.has(prevProps.row?.role_id) === nextProps.ids.has(nextProps.row?.role_id)
    && (prevProps.open[prevProps.index] === nextProps.open[nextProps.index])
    && (prevProps.row?.actions === nextProps.row?.actions)
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const RolePermissionTable = memo(function RolePermissionTable({
                                                                row,
                                                                ids,
                                                                index,
                                                                open,
                                                                setOpen,
                                                                onChangeCheckbox,
                                                                hasAccessCheckbox,
                                                                hasAccess,
                                                                setIsOpenRolePermission,
                                                                openEditModal,
                                                              }) {
  const countOfPermissionTags = useMemo(() => 2, []);
  const { colorMode } = useColorMode();

  return (
    <>
      <TableRow hover role="checkbox" tabIndex={-1}>
        {hasAccessCheckbox &&
          <TableCell component="th" scope="row">
            <Center>
              <Checkbox sx={{ color: 'gray' }}
                        color="primary"
                        checked={ids.has(row?.role_id)}
                        onChange={() => onChangeCheckbox(row.role_id)}
                        inputProps={{ 'aria-labelledby': 'checkbox' }} />
            </Center>
          </TableCell>
        }

        <TableCell>
          {row?.actions?.length > countOfPermissionTags &&
            <Box cursor={'pointer'}
                 onClick={() => {
                   if (row?.actions?.length > countOfPermissionTags) {
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

        <TableCell align={'center'} component="th" scope="row" sx={{ maxWidth: '200px' }}>
          <Box dir={hasPersianText(row.role_name) ? 'rtl' : 'ltr'}>
            <TableText cursor={'default'} text={row.role_name} maxLength={30} hasCenter={false} />
          </Box>
        </TableCell>

        <TableCell align={'center'} component="th" scope="row">
          {!open[index] &&
            <Center>
              <Wrap gap={2}>
                {row?.actions?.map((action, indexActions) => (
                  (indexActions < countOfPermissionTags) &&
                  <Tag key={indexActions} bgColor={'transparent'} boxShadow={'md'} px={1}>
                    <HStack color={methodTagIconColor(action.method, colorMode)} gap={1}>
                      <UsersLockIcon width={'15px'} />

                      <TableText cursor={'default'}
                                 text={action.action}
                                 maxLength={50}
                                 copyable={false}
                                 mt={1}
                                 color={'inherit'} />
                    </HStack>
                  </Tag>
                ))}

                {row?.actions?.length > countOfPermissionTags &&
                  <Tooltip showArrow content={giveText(89)} bg={'black'} color={'white'} fontWeight={'bold'}>
                    <Tag bgColor={'transparent'}
                         boxShadow={'md'}
                         cursor={'pointer'}
                         onClick={() => {
                           if (row?.actions?.length > countOfPermissionTags) {
                             setOpen(prevList => {
                               const newList = [...prevList];
                               newList[index] = !newList[index];
                               return newList;
                             });
                           }
                         }}>
                      <HStack gap={1}>
                        <ClickOutlineIcon width={'15px'} />
                        <Text fontWeight={500} mt={1}>{giveText(8)}...</Text>
                      </HStack>
                    </Tag>
                  </Tooltip>
                }
              </Wrap>
            </Center>
          }
        </TableCell>

        {hasAccess &&
          <TableCell align={'center'} component="th" scope="row">
            <Center>
              <HStack spacing={2}>
                <SettingsIcon onClick={() => {
                  setIsOpenRolePermission(true);
                  openEditModal(row);
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
                         hasCenter={false}
                         copyable={false} />

              <Wrap gap={2} my={2}>
                {row?.actions?.map((action, indexActions) => (
                  <Tag key={indexActions} cursor={'default'} bgColor={'transparent'} boxShadow={'md'} px={1}>
                    <HStack color={methodTagIconColor(action.method, colorMode)} gap={1}>
                      <UsersLockIcon width={'15px'} />

                      <TableText cursor={'default'}
                                 text={action.action}
                                 maxLength={50}
                                 copyable={false}
                                 mt={1}
                                 color={'inherit'} />
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

export default RolePermissionTable;
