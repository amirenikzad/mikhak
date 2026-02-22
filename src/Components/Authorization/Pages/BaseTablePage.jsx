import { Box, Spinner, Text } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { MENU_BACKGROUND_DARK } from '../../Base/BaseColor';
import { giveDir } from '../../Base/MultiLanguages/HandleLanguage';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableSortLabel from '@mui/material/TableSortLabel';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { memo, useCallback } from 'react';
import { AccessDenied } from '../../Base/AccessDenied.jsx';
import { CheckBoxName, ChevronTableName } from '../../Base/TableAttributes.jsx';
import { useColorMode } from '../../ui/color-mode.jsx';
import Checkbox from '@mui/material/Checkbox';
import ScrollToPaginate from '../../Base/CustomComponets/ScrollToPaginate.jsx';

export const BaseTablePage = memo(function BaseTablePage({
                                                           isLoadingListAllUsers,
                                                           body,
                                                           heightResponsive = ['50dvh', '60dvh', '62dvh', '70dvh', '75dvh', '80dvh', '80dvh'],
                                                           headCells = [],
                                                           order,
                                                           setOrder,
                                                           orderBy,
                                                           setOrderBy,
                                                           accessDenied,
                                                           tableSX,
                                                           isAllCheckedCheckbox,
                                                           isSomeCheckedCheckbox,
                                                           onChangeCheckboxAll,
                                                           lastElementRef,
                                                           hasCheckboxAccess = false,
                                                           px = '2rem',
                                                           mt = 5,
                                                           mb = 3,
                                                           hasPagination = true,
                                                         }) {
  const { colorMode } = useColorMode();

  const handleRequestSort = useCallback((property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [orderBy, order, setOrder, setOrderBy]);

  const SpinnerTable = memo(function SpinnerTable() {
    return (isLoadingListAllUsers &&
      <Spinner position={'absolute'}
               top={1}
               left={'40px'}
               zIndex={'500 !important'}
               color={colorMode === 'light' ? 'blue.600' : 'white'} />
    );
  });

  const HeaderCellsValues = memo(function HeaderCellsValues({ headCell }) {
    if (headCell === ChevronTableName) {
      return (
        <TableCell style={{
          backgroundColor: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
          borderBottomWidth: 1,
        }} />
      );
    }
    if (hasCheckboxAccess && headCell === CheckBoxName) {
      return (
        <TableCell align={'center'}
                   sortDirection={orderBy === headCell.id ? order : false}
                   style={{
                     backgroundColor: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
                     borderBottomWidth: 1,
                   }}>
          <Checkbox sx={{ color: 'gray' }}
                    color="primary"
                    indeterminate={!isAllCheckedCheckbox && isSomeCheckedCheckbox}
                    checked={isAllCheckedCheckbox}
                    onChange={onChangeCheckboxAll}
                    inputProps={{
                      'aria-label': 'select all desserts',
                    }} />
        </TableCell>
      );
    }
    if (!hasCheckboxAccess && headCell === CheckBoxName) {
      return <></>
    }
    return (
      <TableCell align={'center'}
                 sortDirection={orderBy === headCell.id ? order : false}
                 style={{
                   backgroundColor: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
                   borderBottomWidth: 1,
                 }}>
        <TableSortLabel active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        sx={{
                          marginLeft: giveDir() === 'rtl' ? '0' : '19px',
                          marginRight: giveDir() === 'rtl' ? '19px' : '0',
                          '& .MuiTableSortLabel-icon': {
                            color: colorMode === 'light'
                              ? 'gray  !important'
                              : 'white !important',
                          },
                        }}
                        onClick={() => handleRequestSort(headCell.id)}>
          <Text fontWeight={'600'} color={colorMode === 'light' ? 'gray.500' : 'gray.200'}>
            {headCell.label}
          </Text>
        </TableSortLabel>
      </TableCell>
    );
  });

  return <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box px={px}
           dir={giveDir()}
           position={'relative'}
           overflowX={'hidden'}
           overflowY={'auto'}
           mt={mt}
           mb={mb}
           css={{
             '@media (max-height: 500px)': {
               height: heightResponsive[0],
             },
             '@media (min-height: 401px) and (max-height: 500px)': {
               height: heightResponsive[1],
             },
             '@media (min-height: 501px) and (max-height: 600px)': {
               height: heightResponsive[2],
             },
             '@media (min-height: 601px) and (max-height: 700px)': {
               height: heightResponsive[3],
             },
             '@media (min-height: 701px) and (max-height: 800px)': {
               height: heightResponsive[4],
             },
             '@media (min-height: 801px) and (max-height: 900px)': {
               height: heightResponsive[5],
             },
             '@media (min-height: 901px)': {
               height: heightResponsive[6],
             },
           }}>
        <SpinnerTable />

        <TableContainer component={Paper}
                        style={{
                          backgroundColor: colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK,
                          height: 'inherit',
                        }}>
          <Table stickyHeader style={tableSX}>
            <TableHead>
              <TableRow>
                {headCells && headCells.map((headCell, index) => (
                  <HeaderCellsValues key={index} headCell={headCell} />
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {body}
            </TableBody>
          </Table>

          <ScrollToPaginate lastElementRef={lastElementRef}
                            hasPagination={hasPagination}
                            isLoading={isLoadingListAllUsers} />
        </TableContainer>
        {accessDenied && <AccessDenied />}
      </Box>
    </motion.div>
  </>;
});
