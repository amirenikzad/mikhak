import { giveDir, giveText } from '../../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { TableText } from '../../../../../../../Base/Extensions.jsx';
import { commaForEvery3Digit, hasPersianText } from '../../../../../../../Base/BaseFunction.jsx';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

const DescriptionTableFunctionality = ({ api = {} }) => {
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
      <Table sx={{ minWidth: 200, direction: giveDir(), borderCollapse: 'collapse' }} aria-label="customized table">
        <TableBody>
          <StyledTableRow>
            <StyledTableCell component="th" scope="row" align={giveDir() === 'rtl' ? 'right' : 'left'}>
              {giveText(1)}
            </StyledTableCell>
            <StyledTableCell align="right">
              <TableText cursor={'default'}
                         text={api?.api}
                         maxLength={27}
                         copyable={false}
                         hasCenter={false} />
            </StyledTableCell>
          </StyledTableRow>
          {/* <StyledTableRow>
            <StyledTableCell component="th" scope="row" align={giveDir() === 'rtl' ? 'right' : 'left'}>
              {giveText(1)}
            </StyledTableCell>
            <StyledTableCell align={hasPersianText(api.name) ? 'right' : 'left'}>
              <TableText cursor={'default'}
                         text={api.name}
                         maxLength={33}
                         copyable={false}
                         hasCenter={false} />
            </StyledTableCell>
          </StyledTableRow> */}

          <StyledTableRow>
            <StyledTableCell component="th" scope="row" align={giveDir() === 'rtl' ? 'right' : 'left'}>
              {giveText(313)}
            </StyledTableCell>
            <StyledTableCell align={hasPersianText(api.api_name) ? 'right' : 'left'}>
              <TableText cursor={'default'}
                         text={api?.project_name}
                         maxLength={37}
                         copyable={false}
                         hasCenter={false} />
            </StyledTableCell>
          </StyledTableRow>

          <StyledTableRow>
            <StyledTableCell component="th" scope="row" align={giveDir() === 'rtl' ? 'right' : 'left'}>
              {giveText(36)}
            </StyledTableCell>
            <StyledTableCell align="right">
              <TableText cursor={'default'}
                         text={api.method?.toString().toUpperCase()}
                         copyable={false}
                         hasCenter={false}
                         fontSize={'14px'} />
            </StyledTableCell>
          </StyledTableRow>

          

          <StyledTableRow>
            <StyledTableCell component="th" scope="row" align={giveDir() === 'rtl' ? 'right' : 'left'}>
              {giveText(196)}
            </StyledTableCell>
            <StyledTableCell align="right">
              <TableText cursor={'default'}
                         text={`${commaForEvery3Digit(api.price)} ${giveText(213)}`}
                         maxLength={37}
                         copyable={false}
                         hasCenter={false} />
            </StyledTableCell>
          </StyledTableRow>

          <StyledTableRow>
            <StyledTableCell component="th" scope="row" align={giveDir() === 'rtl' ? 'right' : 'left'}>
              {giveText(153)}
            </StyledTableCell>
            <StyledTableCell align="right">
              <TableText cursor={'default'}
                         text={api?.description}
                         maxLength={27}
                         copyable={false}
                         hasCenter={false} />
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </>;
};

export default DescriptionTableFunctionality;
