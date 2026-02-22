
import { useDispatch, useSelector } from 'react-redux';
import { BaseTablePage } from '../BaseTablePage.jsx';
import { giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { DELETE_PLATFORM, POST_PLATFORM, PUT_PLATFORM } from '../../../Base/UserAccessNames.jsx';
import { CheckBoxName } from '../../../Base/TableAttributes.jsx';
import { useCheckboxTable } from '../../../Base/CustomHook/useCheckboxTable.jsx';
import { useTableBaseActions } from '../../../Base/CustomHook/useTableBaseActions.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../ui/dialog.jsx';
import { BaseHeaderPage } from '../BaseHeaderPage.jsx';
import { ActionBarTables } from '../../../Base/ActionBar/ActionBarTables.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { setBreadcrumbAddress } from '../../../../store/features/baseSlice.jsx';
import PlatformTable from './PlatformTable.jsx';
import { Box, Center, Grid, GridItem, Separator, Text } from '@chakra-ui/react';

const AddEditPlatform = lazy(() => import('./AddEdit/AddEditPlatform'));
const Remove = lazy(() => import('../../../Base/IconsFeatures/Remove'));

export default function Platform() {
  const accessSlice = useSelector(state => state.accessSlice);
  const [platform, setPlatform] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isOpenAddPlatform, setIsOpenAddPlatform] = useState(false);
  const [isOpenEditPlatform, setIsOpenEditPlatform] = useState(false);
  const [isOpenRemove, setIsOpenRemove] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'all_platform_list_react_query', []);
  const removeId = useMemo(() => 'id', []);

  const [totalCountLabel, setTotalCountLabel] = useState(0);

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(182) },
      { type: 'text', text: giveText(430) },
    ]));
  }, []);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const headCellsValues = useMemo(() => [
    CheckBoxName,
    {
      id: 'platform_name',
      label: (
        <Box display="flex" alignItems="center" gap="8px">
          {giveText(431)}
          {/* <Box 
            minW="25px"
            h="25px"
            bg="blue.500"
            color="white"
            borderRadius="50%"
            fontSize="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {totalCountLabel}
          </Box> */}
          
        </Box>
      )
    },
    // { id: 'platform_name', label: giveText(43) },
  ], [totalCountLabel]);

  const onShiftN = useCallback(() => {
    setIsOpenAddPlatform(true);
  }, []);

  const checkAccessTable = useMemo(() => accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_PLATFORM) || accessSlice.userAccess?.includes(DELETE_PLATFORM), [accessSlice]);

  const {
    listValue: platformList,
    totalCount,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    removeAxios,
    lastElementRef,
    controller,
  } = useTableBaseActions({
    getAllURL: '/platform/all',
    onShiftN: onShiftN,
    checkAccess: checkAccessTable,
    headCellsValues: headCellsValues,
    update: updated,
    removeURL: '/platform',
    removeId: removeId,
    removeIdRequest: 'platform_id',
    responseKey: 'platforms',
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
  });

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const hasAccessCheckbox = useMemo(() => {
    return accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_PLATFORM);
  }, [accessSlice]);

  const {
    ids,
    isAnyChecked,
    isAllChecked,
    onChangeCheckboxAll,
    onChangeCheckbox,
    onDeleteRow,
  } = useCheckboxTable({
    listValue: platformList,
  });

  const sortedListValue = useMemo(() => {
    return stableSort(platformList, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, platformList]);

  const onOpenAdd = useCallback(() => setIsOpenAddPlatform(true), []);
  const onOpenEditPlatform = useCallback((e) => setIsOpenEditPlatform(e.open), []);
  const onOpenRemove = useCallback((e) => setIsOpenRemove(e.open), []);
  const onOpenAddPlatform = useCallback((e) => setIsOpenAddPlatform(e.open), []);

  return <>
    <BaseHeaderPage hasAddButton={accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_PLATFORM)}
                    title={<Box display="flex" alignItems="center" gap="8px">
                    {giveText(430)}
                    <Box 
                      minW="25px"
                      h="25px"
                      bg="blue.500"
                      color="white"
                      borderRadius="50%"
                      fontSize="12px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {totalCountLabel}
                    </Box>
                    
                  </Box>}
                    description={giveText(182)}
                    onOpenAdd={onOpenAdd}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    controller={controller} />

    <BaseTablePage isLoadingListAllUsers={isFetching}
                   headCells={headCells}
                   order={order}
                   orderBy={orderBy}
                   setOrderBy={setOrderBy}
                   setOrder={setOrder}
                   hasCheckboxAccess={hasAccessCheckbox}
                   isAllCheckedCheckbox={isAllChecked}
                   isSomeCheckedCheckbox={isAnyChecked}
                   lastElementRef={lastElementRef}
                   onChangeCheckboxAll={() => onChangeCheckboxAll(sortedListValue)}
                //    body={sortedListValue?.map((row) => (
                //      <PlatformTable key={row?.id}
                //                 ids={ids}
                //                 row={row}
                //                 setPlatform={setPlatform}
                //                 onChangeCheckbox={onChangeCheckbox}
                //                 setIsOpenRemove={setIsOpenRemove}
                //                 setIsOpenEditPlatform={setIsOpenEditPlatform}
                //                 hasAccessCheckbox={hasAccessCheckbox} />
                //    ))} 
                    body={sortedListValue?.map((row) => (
                        <PlatformTable key={row?.id}
                                    ids={ids}
                                    row={row}
                                    setPlatform={setPlatform}
                                    onChangeCheckbox={onChangeCheckbox}
                                    setIsOpenRemove={setIsOpenRemove}
                                    setIsOpenEditPlatform={setIsOpenEditPlatform}
                                    hasAccessCheckbox={hasAccessCheckbox} />
                    ))} 
                   />

    <DialogRoot lazyMount placement={'center'} size={'md'} open={isOpenEditPlatform} onOpenChange={onOpenEditPlatform}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditPlatform editing={true}
                         onCloseModal={() => {
                           setIsOpenEditPlatform(false);
                           updated();
                         }}
                         platform={platform} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'sm'} open={isOpenRemove} onOpenChange={onOpenRemove}>
      <DialogContent>
        <DialogBody p={3}>
          <Suspense fallback={'loading...'}>
            <Remove removeAxios={removeAxios}
                    data={platform}
                    onClose={() => {
                      setIsOpenRemove(false);
                      updated();
                    }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount placement={'center'} size={'md'} open={isOpenAddPlatform} onOpenChange={onOpenAddPlatform}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditPlatform onCloseModal={() => {
              setIsOpenAddPlatform(false);
              updated();
            }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <ActionBarTables selectedCount={ids.size}
                     buttons={[{
                       title: giveText(129),
                       color: ['white', 'black'],
                       backgroundColor: ['red.600', 'red.200'],
                       hoverBackgroundColor: ['red.800', 'red.300'],
                       hasAccess: (accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_PLATFORM)),
                       onClickFunc: () => {
                         removeAxios({ data: { id: ids } });
                         onDeleteRow(ids);
                       },
                     }]} />
  </>;
}

// import { useEffect } from 'react';
// import { setPageName } from '../../../../store/features/pagesSlice.jsx';
// import { PLATFORM_NAME } from '../../../Base/PageNames.jsx';
// import { useDispatch } from 'react-redux';
// import { Box, Center, Grid, GridItem, Separator, Text } from '@chakra-ui/react';
// import { giveDir, giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
// import { motion } from 'motion/react';
// import { useColorMode } from '../../../ui/color-mode.jsx';

// export default function Platform() {
//   const dispatch = useDispatch();
//   const { colorMode } = useColorMode();

//   useEffect(() => {
//     dispatch(setPageName(PLATFORM_NAME));
//   }, []);

//   return <>
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//       <Box px={'2rem'} pt={'1.2rem'}>
//         <Grid templateColumns="repeat(3, 1fr)" gap={1} dir={giveDir()}>
//           <GridItem dir={giveDir()} colSpan={1} my={'auto'}>
//             <Text fontWeight={'800'} fontSize={'24px'} cursor={'default'}>{giveText(430)}</Text>
//           </GridItem>
//         </Grid>
//         <Separator borderColor={colorMode === 'light' ? 'black' : 'white'} />
//       </Box>
//     </motion.div>
//   </>;
// };
