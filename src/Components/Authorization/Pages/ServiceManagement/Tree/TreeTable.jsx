import { Box, Center, HStack, Text } from '@chakra-ui/react';
import { methodTagIconColor, commaForEvery3Digit } from '../../../../Base/BaseFunction.jsx';
import { useSelector } from 'react-redux';
import { TableText } from '../../../../Base/Extensions.jsx';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { memo } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { PUT_FUNCTIONALITIES, DELETE_FUNCTIONALITIES } from '../../../../Base/UserAccessNames.jsx';
import { EditIcon, RemoveIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { useColorMode } from '../../../../ui/color-mode.jsx';
import Checkbox from '@mui/material/Checkbox';

// const arePropsEqual = (prevProps, nextProps) => {
//   if (prevProps.ids.has(prevProps.row?.id) === nextProps.ids.has(nextProps.row?.id)
//     && (prevProps.row?.name === nextProps.row?.name)
//     && (prevProps.row?.project_name === nextProps.row?.project_name)
//     && (prevProps.row?.api === nextProps.row?.api)
//     && (prevProps.row?.method === nextProps.row?.method)
//     && (prevProps.row?.price === nextProps.row?.price)
//     && (prevProps.row?.description === nextProps.row?.description)
//   ) {
//     return true; // props are equal
//   }
//   return false; // props are not equal -> update the component
// };
const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.ids.has(prevProps.row?.id) === nextProps.ids.has(nextProps.row?.id) &&
    prevProps.row?.tittle === nextProps.row?.tittle &&
    prevProps.row?.node_count === nextProps.row?.node_count &&
    prevProps.row?.level_count === nextProps.row?.level_count &&
    prevProps.row?.event_count === nextProps.row?.event_count &&
    prevProps.row?.price === nextProps.row?.price
  );
};

const TreeTable = memo(function TreeTable({
                                                              row,
                                                              ids,
                                                              onChangeCheckbox,
                                                              hasAccessCheckbox,
                                                              openEditModal,
                                                              openRemoveModal,
                                                            }) {
  const { colorMode } = useColorMode();
  const accessSlice = useSelector(state => state.accessSlice);

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

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'} maxLength={20} text={String(row?.prof_id)} />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <TableText cursor={'default'} maxLength={20} text={row?.tittle} />
      </TableCell>

      <TableCell sx={{ px: 0 }} align={'center'} component="th" scope="row">
        <TableText cursor={'default'} maxLength={20} text={String(row?.node_count)} />
      </TableCell>

      <TableCell sx={{ px: 0 }} align={'center'} component="th" scope="row">
        <TableText cursor={'default'} maxLength={20} text={String(row?.level_count)} />
      </TableCell>

      <TableCell sx={{ px: 0 }} align={'center'} component="th" scope="row">
        <TableText cursor={'default'} maxLength={20} text={String(row?.event_count)} />
      </TableCell>

      {/* <TableCell align={'center'} component="th" scope="row">
        <Center>
          <Box backgroundColor={methodTagIconColor(row?.method, colorMode)}
               w={'65px'}
               borderRadius={5}
               pt={'2px'}>
            <Text color={'black'} cursor={'default'}>{row?.method?.toString().toUpperCase()}</Text>
          </Box>
        </Center>
      </TableCell> */}

      <TableCell sx={{ px: 0 }} align={'center'} component="th" scope="row">
        <TableText
          cursor={'default'}
          maxLength={20}
          text={
            row?.price != null
              ? `${commaForEvery3Digit(Math.floor(Number(row.price)))} ${giveText(213)}`
              : '-'
          }
        />
      </TableCell>

      <TableCell align={'center'} component="th" scope="row">
        <Center>
          <HStack spacing={2}>
            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_FUNCTIONALITIES)) &&
              <EditIcon onClick={() => openEditModal(row)} />
            }

            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_FUNCTIONALITIES)) &&
              <RemoveIcon onClick={() => openRemoveModal(row)} />
            }
          </HStack>
        </Center>
      </TableCell>
    </TableRow>
  );
}, arePropsEqual);

export default TreeTable;
