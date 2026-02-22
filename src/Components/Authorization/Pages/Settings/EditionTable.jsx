import { TableRow, TableCell } from '@mui/material';
import { Center, HStack } from '@chakra-ui/react';
import { TableText } from '../../../Base/Extensions.jsx';
import { DELETE_EDITION, PUT_EDITION } from '../../../Base/UserAccessNames.jsx';
import { EditIcon, RemoveIcon } from '../../../Base/IconsFeatures/Icons.jsx';
import { useSelector } from 'react-redux';
import { memo } from 'react';
import Checkbox from '@mui/material/Checkbox';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.ids.has(prevProps.row?.id) === nextProps.ids.has(nextProps.row?.id)
    && prevProps.row?.name === nextProps.row?.name
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

const EditionTable = memo(function EditionRow({
                                          row,
                                          ids,
                                          onChangeCheckbox,
                                          hasAccessCheckbox,
                                          setIsOpenEditEdition,
                                          setIsOpenRemove,
                                          setEdition,
                                        }) {
  const accessSlice = useSelector(state => state.accessSlice);

  return (
    <TableRow hover edition="checkbox" tabIndex={-1}>
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
        <TableText text={row?.name} maxLength={30} hasCenter={false} />
      </TableCell>

      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_EDITION) || accessSlice.userAccess?.includes(DELETE_EDITION)) &&
        <TableCell align={'center'} component="th" scope="row">
          <Center>
            <HStack spacing={2}>
              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_EDITION)) &&
                <EditIcon onClick={() => {
                  setIsOpenEditEdition(true);
                  setEdition(row);
                }} />
              }

              {(accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_EDITION)) &&
                <RemoveIcon onClick={() => {
                  setIsOpenRemove(true);
                  setEdition(row);
                }} />
              }
            </HStack>
          </Center>
        </TableCell>
      }
    </TableRow>
  );
}, arePropsEqual);

export default EditionTable;
