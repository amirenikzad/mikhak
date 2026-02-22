import { TableRow, TableCell } from '@mui/material';
import { Center, HStack } from '@chakra-ui/react';
import { TableText } from '../../../Base/Extensions.jsx';
import { DELETE_PLATFORM, PUT_PLATFORM } from '../../../Base/UserAccessNames.jsx';
import { EditIcon, RemoveIcon } from '../../../Base/IconsFeatures/Icons.jsx';
import { useSelector } from 'react-redux';
import { memo } from 'react';
import Checkbox from '@mui/material/Checkbox';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.ids.has(prevProps.row?.id) === nextProps.ids.has(nextProps.row?.id)
    && prevProps.row?.platform_name === nextProps.row?.platform_name
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const PlatformTable = memo(function PlatformRow({
                                          row,
                                          ids,
                                          onChangeCheckbox,
                                          hasAccessCheckbox,
                                          setIsOpenEditPlatform,
                                          setIsOpenRemove,
                                          setPlatform,
                                        }) {
  const accessSlice = useSelector(state => state.accessSlice);

  return (
    <TableRow hover platform="checkbox" tabIndex={-1}>
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
        <TableText text={row?.platform_name} maxLength={30} hasCenter={false} />
      </TableCell>

      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PLATFORM) || accessSlice.userAccess?.includes(DELETE_PLATFORM)) &&
        <TableCell align={'center'} component="th" scope="row">
          <Center>
            <HStack spacing={2}>
              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PLATFORM)) &&
                <EditIcon onClick={() => {
                  setIsOpenEditPlatform(true);
                  setPlatform(row);
                }} />
              }

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_PLATFORM)) &&
                <RemoveIcon onClick={() => {
                  setIsOpenRemove(true);
                  setPlatform(row);
                }} />
              }
            </HStack>
          </Center>
        </TableCell>
      }
    </TableRow>
  );
}, arePropsEqual);

export default PlatformTable;
