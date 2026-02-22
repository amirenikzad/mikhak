import { giveDir, giveText } from '../../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { TableText } from '../../../../../../../Base/Extensions.jsx';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const DescriptionTableService = ({ service = {} }) => {
  const direction = giveDir();

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      border: `1px solid ${theme.palette.divider}`,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      border: `1px solid ${theme.palette.divider}`,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: '#f1f1f1',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#ffffff',
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200, direction: direction, borderCollapse: 'collapse' }} aria-label="customized table">
        <TableBody>
          <StyledTableRow>
            <StyledTableCell component="th" scope="row" align={direction === 'rtl' ? 'right' : 'left'}>
              {giveText(direction === 'rtl' ? 232 : 233)}
            </StyledTableCell>
            <StyledTableCell align={direction === 'rtl' ? 'right' : 'left'}>
              <TableText cursor={'default'}
                         text={direction === 'rtl' ? service.fa_name : service.en_name}
                         maxLength={33}
                         copyable={false}
                         hasCenter={false} />
            </StyledTableCell>
          </StyledTableRow>

          <StyledTableRow>
            <StyledTableCell component="th" scope="row" align={direction === 'rtl' ? 'right' : 'left'}>
              {giveText(direction === 'rtl' ? 234 : 235)}
            </StyledTableCell>
            <StyledTableCell align={direction === 'rtl' ? 'right' : 'left'}>
              <TableText cursor={'default'}
                         text={direction === 'rtl' ? service.fa_description : service.en_description}
                         maxLength={33}
                         copyable={false}
                         hasCenter={false} />
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </>;
};
