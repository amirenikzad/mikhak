import { TableRow, TableCell } from '@mui/material';
import { Center, HStack } from '@chakra-ui/react';
import { TableText } from '../../../../Base/Extensions.jsx';
import { DELETE_ROLE, PUT_ROLE } from '../../../../Base/UserAccessNames.jsx';
import { EditIcon, RemoveIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { useSelector } from 'react-redux';
import { memo } from 'react';
import Checkbox from '@mui/material/Checkbox';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.ids.has(prevProps.row?.id) === nextProps.ids.has(nextProps.row?.id)
    && prevProps.row?.role_name === nextProps.row?.role_name
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const RoleTable = memo(function RoleRow({
                                          row,
                                          ids,
                                          onChangeCheckbox,
                                          hasAccessCheckbox,
                                          setIsOpenEditRole,
                                          setIsOpenRemove,
                                          setRole,
                                        }) {
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

      <TableCell align={'center'} component="th" scope="row" sx={{ maxWidth: '100px', px: '200px' }}>
        <TableText text={row?.role_name} maxLength={30} hasCenter={false} />
      </TableCell>

      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_ROLE) || accessSlice.userAccess?.includes(DELETE_ROLE)) &&
        <TableCell align={'center'} component="th" scope="row">
          <Center>
            <HStack spacing={2}>
              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_ROLE)) &&
                <EditIcon onClick={() => {
                  setIsOpenEditRole(true);
                  setRole(row);
                }} />
              }

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_ROLE)) &&
                <RemoveIcon onClick={() => {
                  setIsOpenRemove(true);
                  setRole(row);
                }} />
              }
            </HStack>
          </Center>
        </TableCell>
      }
    </TableRow>
  );
}, arePropsEqual);

export default RoleTable;
