import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Image,
  Separator,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { giveDir, giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { TURQUOISE_BUTTON_COLOR, TURQUOISE_COLOR } from '../../../../Base/BaseColor.jsx';
import FloatingLabelInput from '../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PUT_SERVICE,
  POST_SERVICE,
  DELETE_SERVICE,
  GET_SERVICE_COMPONENT_MICROSERVICE,
  PATCH_SERVICE,
} from '../../../../Base/UserAccessNames.jsx';
import { setHasUpdatedService } from '../../../../../store/features/updatedSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWithAxios } from '../../../../Base/axios/FetchAxios.jsx';
import {
  showToast,
  promiseToast,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../../../Base/BaseFunction.jsx';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { RemoveIcon, SettingsIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { setIsDeleting } from '../../../../../store/features/isLoadingSlice.jsx';
import qs from 'qs';
import { useCelebration } from '../../../../Base/CustomHook/useCelebration.jsx';
import { useColorMode } from '../../../../ui/color-mode.jsx';
import { Switch } from '../../../../ui/switch.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../../ui/dialog.jsx';
import { Tooltip } from '../../../../ui/tooltip.jsx';
import no_image_light from '../../../../../assets/images/no_image_light.png';
import no_image_dark from '../../../../../assets/images/no_image_dark.png';
import { setBreadcrumbAddress } from '../../../../../store/features/baseSlice.jsx';
import { SearchIcon } from '../../../../Base/CustomIcons/SearchIcon.jsx';
import { SettingsIcon as CustomSettingsIcon } from '../../../../Base/CustomIcons/SettingsIcon.jsx';
import { EditIcon as CustomEditIcon } from '../../../../Base/CustomIcons/EditIcon.jsx';
import { SealCheckIcon } from '../../../../Base/CustomIcons/SealCheckIcon.jsx';
import { InfoIcon } from '../../../../Base/CustomIcons/InfoIcon.jsx';
import { SealWarningIcon } from '../../../../Base/CustomIcons/SealWarningIcon.jsx';
import { CircularCrossFillIcon } from '../../../../Base/CustomIcons/CircularCrossFillIcon.jsx';
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../../../../ui/popover.jsx';
import { memo } from 'react';
import { BaseTablePage } from '../../BaseTablePage.jsx';
import { CheckBoxName } from '../../../../Base/TableAttributes.jsx';
import { TableCell } from '@mui/material';
import { useruseTableBaseActions } from '../../../../Base/CustomHook/useruseTableBaseActions.jsx';  
import { useCheckboxTable } from '../../../../Base/CustomHook/useCheckboxTable.jsx';
import TableRow from '@mui/material/TableRow';
import { MENU_BACKGROUND_DARK } from '../../../../Base/BaseColor.jsx';
import Checkbox from '@mui/material/Checkbox';
import { IconButton } from '@chakra-ui/react';
import { MenuIcon } from '../../../../Base/CustomIcons/MenuIcon.jsx';
import { CartViewIcon } from '../../../../Base/CustomIcons/CartViewIcon.jsx';
import { UserActiveIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { ServiceSellIcon } from '../../../../Base/IconsFeatures/Icons.jsx';
import { ServiceShowIcon } from '../../../../Base/IconsFeatures/Icons.jsx';


const ServiceApiComponent = lazy(() => import('./AddEdit/ServiceFunctionality/ServiceFunctionality'));
const AddEditService = lazy(() => import('./AddEdit/AddEditService'));
const Remove = lazy(() => import('../../../../Base/IconsFeatures/Remove'));
const ShowService = lazy(() => import('./AddEdit/ShowService'));

const ShortText = memo(({ text = '', limit = 100 }) => {
  const { colorMode } = useColorMode();

  if (!text || text === '---' || text.trim() === '') {
    return <Text fontSize="13px" color="gray.500" color={colorMode === 'light' ? 'black' : 'white'} >---</Text>;
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';

  if (plainText.length > limit) {
    return (
      <Text fontSize="13px" textAlign="justify" mt={2} color={colorMode === 'light' ? 'black' : 'white'} >
        {plainText.slice(0, limit)}...
      </Text>
    );
  }

  return (
    <Text
      fontSize="13px"
      textAlign="justify"
      mt={2}
      color={colorMode === 'light' ? 'black' : 'white'}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
});


export default function Service() {
  const updatedSlice = useSelector(state => state.updatedSlice);
  // const [listValue, setListValue] = useState([]);
  const accessSlice = useSelector(state => state.accessSlice);
  const [searchValue, setSearchValue] = useState('');
  const [service, setService] = useState({});
  const { colorMode } = useColorMode();
  const [isOpenAddService, setIsOpenAddService] = useState(false);
  const [isOpenShow, setIsOpenShow] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenServiceApi, setIsOpenServiceApi] = useState(false);
  const [isOpenRemove, setIsOpenRemove] = useState(false);
  const dispatch = useDispatch();
  const removeId = useMemo(() => 'id', []);
  const observer = useRef(null);
  const queryClient = useQueryClient();
  const reactQueryItemName = useMemo(() => 'get_all_services', []);
  const controllerRef = useRef(null);
  const { Component: CelebrationComponent, handleClickShowCelebration } = useCelebration();
  const [totalCountLabel, setTotalCountLabel] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewType, setViewType] = useState("card"); 
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const [serviceFilters, setServiceFilters] = useState({
    active: null,
    show: null,
    for_sell: null,
  });



  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(224) },
      { type: 'text', text: giveText(225) },
    ]));
  }, []);

  const updated = useCallback(() => {
    dispatch(setHasUpdatedService(!updatedSlice.hasUpdatedService));
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName, updatedSlice.hasUpdatedService]);

  const openEditModal = useCallback((value) => {
    setService(value);
    setIsOpenEdit(true);
  }, []);

  const openRemoveModal = useCallback((value) => {
    setService(value);
    setIsOpenRemove(true);
  }, []);

  const openServiceApiModal = useCallback((value) => {
    setService(value);
    setIsOpenServiceApi(true);
  }, []);

  const openOpenShowModal = useCallback((value) => {
    setService(value);
    setIsOpenShow(true);
  }, []);

    const headCellsValues= useMemo(() => [
      CheckBoxName,
      // { id: 'fa_name', label: giveText(438) },
      
      { id: 'fa_description', label: giveText(435) },
      { id: 'fa_name', label: giveText(439) },
      { id: 'actions', label: giveText(38) },
    ], []);

  const checkAccessTable = useMemo(() => accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE) || accessSlice.userAccess?.includes(DELETE_SERVICE), [accessSlice]);

  const {
      listValue: serviceList,
      totalCount,
      getComparator,
      isFetching,
      stableSort,
      headCells,
      removeAxios,
      lastElementRef,
      controller,
    } = useruseTableBaseActions({
      getAllURL: '/services/all',
      // onShiftN: onShiftN,
      checkAccess: checkAccessTable,
      headCellsValues: headCellsValues,
      update: updated,
      removeURL: '/service',
      removeId: removeId,
      removeIdRequest: 'service_id',
      responseKey: 'services',
      searchValue: searchValue,
      reactQueryItemName: reactQueryItemName,
      
      additionalParams: {
        active: serviceFilters.active,
        show: serviceFilters.show,
        for_sell: serviceFilters.for_sell,
      },
      // queryParameter: qs.stringify(
      //   {
      //     active: serviceFilters.active,
      //     show: serviceFilters.show,
      //     for_sell: serviceFilters.for_sell,
      //   },
      //   { skipNulls: true, arrayFormat: 'repeat' }
      // ),

    });
    // console.log('serviceList', serviceList);

  const hasAccessCheckbox = useMemo(() => {
      return !accessSlice.isAdmin && !accessSlice.userAccess?.includes(DELETE_SERVICE);
    }, [accessSlice]);

   const {
      ids,
      isAnyChecked,
      isAllChecked,
      onChangeCheckboxAll,
      onChangeCheckbox,
      onDeleteRow,
    } = useCheckboxTable({
      listValue: serviceList,
    });

  
    const sortedListValue = useMemo(() => {
      return stableSort(serviceList, getComparator(order, orderBy));
    }, [order, orderBy, stableSort, serviceList]);
  
  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const putAxios = async ({
                            id,
                            fa_name,
                            en_name,
                            fa_description,
                            en_description,
                            light_icon,
                            extension_light_icon,
                            dark_icon,
                            extension_dark_icon,
                            // active,
                            // show,
                            // for_sell,
                            ui_path,
                            edition_id,
                            major,
                            minor,
                            patch,
                            maximum_user,
                            cat_id,
                          }) => {
    return await fetchWithAxios.put(`/service`, {
      id,
      fa_name,
      en_name,
      fa_description,
      en_description,
      light_icon,
      extension_light_icon,
      dark_icon,
      extension_dark_icon,
      // active,
      // show,
      // for_sell,
      ui_path,
      edition_id,
      major,
      minor,
      patch,
      maximum_user,
      cat_id,
    });
  };

  const putServiceAxios = (value) => {
    const toastId = promiseToast();
    // console.log('value44',value);
    putAxios({
      id: value?.id,
      fa_name: value?.fa_name,
      en_name: value?.en_name,
      fa_description: value?.fa_description,
      en_description: value?.en_description,
      light_icon: value?.light_icon,
      extension_light_icon: value?.extension_light_icon,
      dark_icon: value?.dark_icon,
      extension_dark_icon: value?.extension_dark_icon,
      // active: value?.active,
      // show: value?.show,
      // for_sell: value?.for_sell,
      ui_path: value?.ui_path,
      edition_id: value?.edition_id,
      edition_name: value?.edition_name,
      major: Number(value?.major?.value ?? 0),
      minor: Number(value?.minor?.value ?? 0),
      patch: Number(value?.patch?.value ?? 0),
      maximum_user: String(value?.maximum_user?.value ?? 0),
      // cat_id: value?.id?.value ?? 0,
      cat_id: Number(value?.cat_id?.value),

    }).then((response) => {
      dispatch(setHasUpdatedService(!updatedSlice.hasUpdatedService));
      updatePromiseToastSuccessWarningInfo({ toastId, response });
    }).catch((error) => {
      updatePromiseToastError({ toastId, error });
    });
  };

  const [isLoadingDaemonSwitches, setIsLoadingDaemonSwitches] = useState([]);

  const update = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [reactQueryItemName]);

  const patchUserFlag = useCallback(
    ({ url, active, service_ids, accessName, index, setLoading }) => {

      if (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(accessName)) {
        toaster.create({
          type: 'error',
          title: giveText(30),
          description: giveText(97),
          dir: giveDir(),
          duration: 3000,
        });
        return;
      }

      const toastId = promiseToast();

      fetchWithAxios.patch(url, {
        service_ids,
        active,
      })
        .then((response) => {
          update();
          updatePromiseToastSuccessWarningInfo({ toastId, response });
        })
        .catch((error) => {
          updatePromiseToastError({ toastId, error });
        })
        .finally(() => {
          if (setLoading && index !== undefined) {
            setLoading(prev => prev.filter(i => i !== index));
          }
        });

    },
    [accessSlice.isAdmin, accessSlice.userAccess, update]
  );

    const toggleFilter = useCallback((key) => {
      setServiceFilters((prev) => {
        const current = prev[key];
        let next;
        if (current === null) next = true;
        else if (current === true) next = false;
        else next = null;

        return {
          ...prev,
          [key]: next,
        };
      });
    }, []);

  // const patchAxios = async ({
  //                           id,
  //                           // active,
  //                           // show,
  //                           // for_sell,
  //                         }) => {
  //   return await fetchWithAxios.patch(`/service_forsell`, {
  //     id,
  //     // active,
  //     // show,
  //     // for_sell,
  //   });
  // };

  // const putServicePatchAxios = (value) => {
  //   const toastId = promiseToast();
  //   console.log("LocalStorage2 : ", value);
  //   patchAxios({
  //     active: value?.active,
  //     show: value?.show,
  //     for_sell: value?.for_sell,
  //   }).then((response) => {
  //     dispatch(setHasUpdatedService(!updatedSlice.hasUpdatedService));
  //     updatePromiseToastSuccessWarningInfo({ toastId, response });
  //   }).catch((error) => {
  //     updatePromiseToastError({ toastId, error });
  //   });
  // };

  return <>
    <Box py={1} px={8} >
      <Grid templateColumns="repeat(2, 1fr)" gap={1} dir={giveDir()} >
        <GridItem colSpan={1} my={'auto'} cursor={'default'}>
          {/* <Text fontWeight={'800'} fontSize={'22px'}>{giveText(225)}</Text>   */}
          <Box display="flex" alignItems="center" gap="8px" fontWeight={'800'} fontSize={'22px'} >
            {giveText(225)}
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
            
          </Box>
          {/* <Text fontWeight={'400'} fontSize={'15px'}>{giveText(225)}</Text> */}
        </GridItem>

        <GridItem colSpan={1} my={'auto'} dir={giveDir(true)}>
          <HStack spacing={2}>
            {(accessSlice.isAdmin || accessSlice.userAccess?.includes(POST_SERVICE)) &&
              <Button borderRadius={5}
                      w={'70px'}
                      color={colorMode === 'light' ? 'white' : 'black'}
                      backgroundColor={colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR}
                      _hover={{ backgroundColor: colorMode === 'light' ? TURQUOISE_BUTTON_COLOR : TURQUOISE_COLOR }}
                      onClick={() => setIsOpenAddService(true)}>
                {giveText(9)}
              </Button>
            }

            <FloatingLabelInput label={giveText(10)}
                                value={searchValue}
                                dir={giveDir()}
                                mx={3}
                                maxW={'400px'} minW={'400px'}
                                hasInputLeftElement={true}
                                InputLeftElementIcon={<SearchIcon width={'1rem'} color="gray.300" />}
                                hasInputRightElement={searchValue}
                                InputRightElement={(
                                  <Box mx={2} cursor={'pointer'} onClick={() => setSearchValue('')}>
                                    <CircularCrossFillIcon color={'red'} width={'1rem'} />
                                  </Box>
                                )}
                                onChange={(e) => {
                                  setSearchValue(e.target.value);
                                }} />

            <HStack spacing={1}>

              {/* ACTIVE */}
              <Tooltip
                content={giveText(2)}
                placement="top"
                dir={giveDir()}
              >
                <Box
                  w="38px"
                  h="38px"
                  borderRadius="8px"
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={serviceFilters.active === true ? '#c5c5c5' : serviceFilters.active === false ? '#a09797' : 'transparent'}
                  border="1px solid"
                  borderColor="gray.300"
                  onClick={() => toggleFilter('active')}
                  // onClick={() => {
                  //   setSearchValue(''); 
                  //   toggleFilter('active');
                  // }}
                >
                  <UserActiveIcon isActive={serviceFilters.active} width="0.2rem" />
                </Box>
              </Tooltip>

              {/* SHOW */}
              <Tooltip
                content={giveText(22)}
                placement="top"
                dir={giveDir()}
              >
                <Box
                  w="38px"
                  h="38px"
                  borderRadius="8px"
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={serviceFilters.show === true ? '#c5c5c5' : serviceFilters.show === false ? '#a09797' : 'transparent'}
                  border="1px solid"
                  borderColor="gray.300"
                  onClick={() => toggleFilter('show')}
                >
                  <ServiceShowIcon isActive={serviceFilters.show} width="1.2rem" />
                </Box>
              </Tooltip>

              {/* FOR SELL */}
              <Tooltip
                content={giveText(408)}
                placement="top"
                dir={giveDir()}
              >
                <Box
                  w="38px"
                  h="38px"
                  borderRadius="8px"
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={serviceFilters.for_sell === true ? '#c5c5c5' : serviceFilters.for_sell === false ? '#a09797' : 'transparent'}
                  border="1px solid"
                  borderColor="gray.300"
                  onClick={() => toggleFilter('for_sell')}
                >
                  <ServiceSellIcon isActive={serviceFilters.for_sell} width="0.2rem" />
                </Box>
              </Tooltip>

            </HStack>


                                
            <Box
              textAlign="center"
              display="inline-block"

              // onClick={() => setViewType(prev => prev === "card" ? "table" : "card")}
            >
              <Tooltip
                showArrow
                hasArrow
                placement="top"
                borderRadius={5}
                dir={giveDir()}
                content={
                  <Text fontWeight="500" fontSize="15px">
                    {viewType === "card" ? giveText(437) : giveText(436)}
                  </Text>
                }
                isDisabled={!(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE))}
              >
                <Button
                  borderRadius={5}
                  variant="outline"
                  onClick={() => setViewType(prev => prev === "card" ? "table" : "card")}
                >
                  {viewType === "card"
                    ? <MenuIcon width="1.2rem" />
                    : <CartViewIcon width="1.2rem" />
                  }
                </Button>
              </Tooltip>
            </Box>



          </HStack>
        </GridItem>
      </Grid>

      {/* <Box 
        // py={1} px={8}
        maxH="83vh" 
        overflowY="auto"
        > */}
        {viewType === "card" && (
          <Box
            maxH="83vh" 
            overflowY="auto">
          <SimpleGrid columns={4} gap={6} mt={2} p={3} overflowY={'auto'}>
            {serviceList?.map((value, index) => {
              const isLastElement = (index === serviceList.length - 1 && serviceList[serviceList.length - 1] === value);
              const functionalitiesCount = value?.functionalities?.length || 0;


              return (
                <Box key={value?.id}
                    ref={isLastElement ? lastElementRef : null}
                    p={4}
                    position={'relative'}
                    borderWidth="1px"
                    minH={'325px'}
                    borderRadius="lg"
                    boxShadow="md"
                    display="flex"
                    flexDirection="column"
                    >
                  <Box position={'absolute'}
                      top={'-15px'}
                      right={giveDir() === 'rtl' && '-15px'}
                      left={giveDir() === 'ltr' && 1}>
                    {value?.is_connected
                      ? <SealCheckIcon width={'2.5rem'} color={'#249EF0'} />
                      : <SealWarningIcon width={'2.5rem'} color={'orange'} />
                    }
                  </Box>

                  <Box cursor={'pointer'} onClick={() => openOpenShowModal(value)}>
                    <Center>
                      {/* <Image loading="lazy"
                            h={'183px'}
                            src={colorMode === 'light'
                              ? value?.light_icon ? value?.light_icon : no_image_light
                              : value?.dark_icon ? value?.dark_icon : no_image_dark
                            } /> */}
                        <Image
                          loading="lazy"
                          h="183px"
                          transition="transform 0.3s ease"
                          _hover={{
                            transform: 'scale(1.08)',
                          }}
                          src={
                            colorMode === 'light'
                              ? value?.light_icon || no_image_light
                              : value?.dark_icon || no_image_dark
                          }
                        />
                    </Center>

                    {/* <Box display="flex" alignItems="center"  > */}
                      <Text mt={4} fontSize={'18px'} fontWeight="800">
                        {giveDir() === 'rtl' ? value?.fa_name : value?.en_name}
                      </Text>
                    {/* <Box 
                        minW="20px"
                        h="20px"
                        bg="black"
                        color="white"
                        borderRadius="50%"
                        fontSize="10px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {functionalitiesCount}
                      </Box>
                    </Box> */}

                  </Box>
                  <ShortText
                          text={
                            giveDir() === 'rtl'
                              ? value?.fa_description || '---'
                              : value?.en_description || '---'
                          }
                          limit={120} 
                        />


                  <Separator borderColor={colorMode === 'light' ? 'black' : 'white'}  mt="auto"/>

                  {/* <Grid templateColumns="repeat(2, 1fr)" gap={1} > */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={1}  >

                  {/* <Box position="absolute" bottom={8} left={4} right={4} borderTop="1px" borderColor="gray.200"> */}
                    <GridItem colSpan={1} my={'auto'}>
                      {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE)) &&
                        <PopoverRoot lazyMount positioning={{ placement: 'bottom' }}>
                          <PopoverTrigger asChild>
                            <Box display={'inline-block'} cursor={'pointer'} fontWeight={'bold'} fontSize={'20px'}>
                              ...
                            </Box>
                          </PopoverTrigger>
                          <PopoverContent className={'box_shadow'} w={'200px'}>
                            <PopoverArrow />

                            <PopoverBody p={5}>
                              <Stack spacing={2}>
                                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                  <GridItem colSpan={1}>
                                    <Text fontSize={'14px'} cursor={'default'}>
                                      {giveText(2)}:
                                    </Text>
                                  </GridItem>

                                  <GridItem colSpan={1} textAlign={giveDir() === 'ltr' ? 'right' : 'left'}>
                                    <Tooltip showArrow colorPalette={'white'} dir={'rtl'} textAlign={'center'}
                                            borderRadius={5}
                                            disabled={accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE)}
                                            content={(
                                              <Text dir={giveDir()} fontWeight={'500'} fontSize={'15px'}>
                                                {giveText(118)}
                                              </Text>
                                            )}>
                                      <Switch name={'active'}
                                              dir={'rtl'}
                                              checked={value?.active}
                                              colorPalette={'cyan'}
                                              size={'sm'}
                                              disabled={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_SERVICE)}
                                              onCheckedChange={({ checked }) => {
                                                // putServiceAxios({
                                                //   ...value, active: checked,
                                                // });
                                                setIsLoadingDaemonSwitches((prevState) => [...prevState, index]);
                                                patchUserFlag({
                                                              url: '/service_active',
                                                              active: !value?.active,
                                                              service_ids: [value?.id],
                                                              accessName: PATCH_SERVICE,
                                                              index,
                                                              setLoading: setIsLoadingDaemonSwitches,
                                                            });
                                                          if (!value?.active == false) {
                                                            patchUserFlag({
                                                              url: '/service_show',
                                                              active: false,
                                                              service_ids: [value?.id],
                                                              accessName: PATCH_SERVICE,
                                                              index,
                                                              setLoading: setIsLoadingDaemonSwitches,
                                                            });
                                                            patchUserFlag({
                                                              url: '/service_forsell',
                                                              active: false,
                                                              service_ids: [value?.id],
                                                              accessName: PATCH_SERVICE,
                                                              index,
                                                              setLoading: setIsLoadingDaemonSwitches,
                                                            });
                                                          }
                                              }} />
                                    </Tooltip>
                                  </GridItem>
                                </Grid>

                                {/* {value?.active && (                                               */}
                                  <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                                  <GridItem colSpan={1}>
                                    <Text fontSize={'14px'} cursor={'default'}>
                                      {giveText(22)}:
                                    </Text>
                                  </GridItem>

                                  <GridItem colSpan={1} textAlign={giveDir() === 'ltr' ? 'right' : 'left'}>
                                    <Tooltip showArrow colorPalette={'white'} dir={'rtl'} textAlign={'center'}
                                            borderRadius={5}
                                            disabled={accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE)}
                                            content={(
                                              <Text dir={giveDir()} fontWeight={'500'} fontSize={'15px'}>
                                                {giveText(118)}
                                              </Text>
                                            )}>
                                      <Switch name={'show'}
                                              dir={'rtl'}
                                              checked={value?.show}
                                              colorPalette={'cyan'}
                                              size={'sm'}
                                              disabled={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_SERVICE)}
                                              onCheckedChange={({ checked }) => {
                                                // putServiceAxios({
                                                //   ...value, show: checked,
                                                // });
                                                setIsLoadingDaemonSwitches((prevState) => [...prevState, index]);
                                                if (value?.active) {
                                                patchUserFlag({
                                                              url: '/service_show',
                                                              active: !value?.show,
                                                              service_ids: [value?.id],
                                                              accessName: PATCH_SERVICE,
                                                              index,
                                                              setLoading: setIsLoadingDaemonSwitches,
                                                            });} else{
                                                              showToast({
                                                                title: giveText(30),        
                                                                description: giveText(452), 
                                                                status: 1,                  
                                                              });
                                                            }


                                                            // if (newValue < 0) {
                                                              // showToast({
                                                              //   title: giveText(30),        
                                                              //   description: giveText(449), 
                                                              //   status: 1,                  
                                                              // });
                                                            //   return;
                                                            // }
                                              }} />
                                    </Tooltip>
                                  </GridItem>
                                </Grid>

                                {/* {value?.active && (                                               */}
                                  <Grid templateColumns={'repeat(4, 1fr)'} gap={4}>
                                  <GridItem colSpan={3}>
                                    <Text fontSize={'14px'} cursor={'default'}>
                                      {giveText(408)}:
                                    </Text>
                                  </GridItem>

                                  {/* <GridItem colSpan={1} textAlign={giveDir() === 'ltr' ? 'right' : 'left'}>
                                    <Tooltip showArrow colorPalette={'white'} dir={'rtl'} textAlign={'center'}
                                            borderRadius={5}
                                            disabled={accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE)}
                                            content={(
                                              <Text dir={giveDir()} fontWeight={'500'} fontSize={'15px'}>
                                                {giveText(118)}
                                              </Text>
                                            )}>
                                      <Switch name={'for_sell'}
                                              dir={'rtl'}
                                              checked={value?.for_sell}
                                              colorPalette={'cyan'}
                                              size={'sm'}
                                              disabled={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_SERVICE)}
                                              onCheckedChange={({ checked }) => {
                                                putServiceAxios({
                                                  ...value, for_sell: checked,
                                                });
                                              }} />
                                    </Tooltip>
                                  </GridItem> */}
                                  <GridItem colSpan={1} textAlign={giveDir() === 'ltr' ? 'right' : 'left'}>
                                    <Tooltip showArrow colorPalette={'white'} dir={'rtl'} textAlign={'center'}
                                            borderRadius={5}
                                            disabled={accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE)}
                                            content={(
                                              <Text dir={giveDir()} fontWeight={'500'} fontSize={'15px'}>
                                                {giveText(118)}
                                              </Text>
                                            )}>
                                      <Switch name={'for_sell'}
                                              dir={'rtl'}
                                              checked={value?.for_sell}
                                              colorPalette={'cyan'}
                                              size={'sm'}
                                              disabled={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(PUT_SERVICE)}
                                              onCheckedChange={({ checked }) => {
                                                console.log("LocalStorage : ", value); 
                                                // putServicePatchAxios({
                                                //   ...value, for_sell: checked,
                                                // });
                                                setIsLoadingDaemonSwitches((prevState) => [...prevState, index]);
                                                if (value?.active) {
                                                patchUserFlag({
                                                              url: '/service_forsell',
                                                              active: !value?.for_sell,
                                                              service_ids: [value?.id],
                                                              accessName: PATCH_SERVICE,
                                                              index,
                                                              setLoading: setIsLoadingDaemonSwitches,
                                                            });} else{
                                                              showToast({
                                                                title: giveText(30),        
                                                                description: giveText(452), 
                                                                status: 1,                  
                                                              });
                                                            }
                                              }} />
                                    </Tooltip>
                                  </GridItem>
                                </Grid>
                                {/* )} */}
                              </Stack>
                              
                            </PopoverBody>
                          </PopoverContent>
                        </PopoverRoot>
                      }
                    </GridItem>

                    <GridItem colSpan={1} my={'auto'} dir={giveDir(true)}>
                      <HStack mt={2} spacing={2}>
                        {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_SERVICE_COMPONENT_MICROSERVICE)) &&
                          <SettingsIcon Icon={CustomSettingsIcon}
                                        fontSize={'1.4rem'}
                                        tooltipTitle={giveText(378)}
                                        onClick={() => {
                                          openServiceApiModal(value);
                                        }} />
                        }

                        {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE)) &&
                          <SettingsIcon Icon={CustomEditIcon}
                                        fontSize={'1.3rem'}
                                        tooltipTitle={giveText(83)}
                                        onClick={() => {
                                          openEditModal(value);
                                        }} />
                        }

                        {(accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_SERVICE)) &&
                          <RemoveIcon onClick={() => openRemoveModal(value)} />
                        }
                        {/* <ServiceInfoIcon fontSize={'1.3rem'}/> */}
                        <Tooltip showArrow content={<Text fontWeight={'500'} fontSize={'15px'} >{functionalitiesCount}</Text>}
                                  colorPalette={'white'} dir={'rtl'} textAlign={'center'} borderRadius={5}>
                          <InfoIcon width={'1.3rem'}/>
                        </Tooltip>
                        {/* <Box 
                          minW="20px"
                          h="20px"
                          bg="blue.500"
                          color="white"
                          borderRadius="50%"
                          fontSize="10px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {functionalitiesCount}
                        </Box> */}
                        
                      </HStack>
                    </GridItem>
                  </Grid>
                  {/* </Box> */}
                </Box>
              );
            })}
          </SimpleGrid>
          </Box>
        )}

      {viewType === "table" && (
        <BaseTablePage
          isLoadingListAllUsers={isFetching}
          headCells={headCells}
          order={order}
          orderBy={orderBy}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          hasCheckboxAccess={!accessSlice.isAdmin && !accessSlice.userAccess?.includes(DELETE_SERVICE)}
          isAllCheckedCheckbox={selectedRows.length === serviceList.length && serviceList.length > 0}
          isSomeCheckedCheckbox={selectedRows.length > 0 && selectedRows.length < serviceList.length}
          hasAccessCheckbox={hasAccessCheckbox}
          onChangeCheckboxAll={() => onChangeCheckboxAll(sortedListValue)}
          onChangeCheckboxAll={(e) => {
            if (e.target.checked) {
              setSelectedRows(serviceList.map(s => s.id));
            } else {
              setSelectedRows([]);
            }
          }}
          lastElementRef={lastElementRef}
          hasPagination={true}
          body={stableSort(serviceList, getComparator(order, orderBy)).map((row, index) => {
            const isItemSelected = selectedRows.includes(row.id);
            const isLast = index === serviceList.length - 1;
            const functionalitiesCount = row?.functionalities?.length || 0;

            return (
              <TableRow
                ref={isLast ? lastElementRef : null}
                key={row.id}
                hover
                selected={isItemSelected}
              >
                {/* <TableCell align="center">
                  <Image loading="lazy"
                         h={'50px'}
                         src={colorMode === 'light'
                           ? row?.light_icon ? row?.light_icon : no_image_light
                           : row?.dark_icon ? row?.dark_icon : no_image_dark
                         } />
                </TableCell> */}
                

                {/* نام سرویس */}
                <TableCell align="center" alignContent='center'>
                  <Box display="flex" alignItems="center" gap="8px" justifyContent="center" >
                    <Image loading="lazy"
                         h={'50px'}
                         src={colorMode === 'light'
                           ? row?.light_icon ? row?.light_icon : no_image_light
                           : row?.dark_icon ? row?.dark_icon : no_image_dark
                         } />
                         
                    <Text fontWeight="600" noOfLines={1} color={colorMode === 'light' ? 'black' : 'white'} alignContent={'center'} alignItems={'center'} alignSelf={'center'} textAlign={'center'} justifyContent={'center'}>
                      {giveDir() === 'rtl' ? row.fa_name : row.en_name}
                      
                    </Text>
                  
                  </Box>    
                </TableCell>

                <TableCell align="center">
                  
                  {row.is_connected ? (
                    <Tooltip
                    showArrow
                    hasArrow
                    placement="top"
                    borderRadius={5}
                    dir={giveDir()}
                    content={
                      <Text fontWeight="500" fontSize="15px">
                        {giveText(440)}
                      </Text>
                    }
                    isDisabled={!(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE))}
                  >
                    <SealCheckIcon width="1.8rem" color="#249EF0" />
                    </Tooltip>
                  ) : (
                    <Tooltip
                    showArrow
                    hasArrow
                    placement="top"
                    borderRadius={5}
                    dir={giveDir()}
                    content={
                      <Text fontWeight="500" fontSize="15px">
                        {giveText(441)}
                      </Text>
                    }
                    isDisabled={!(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE))}
                  >
                    <SealWarningIcon width="1.8rem" color="orange" />
                    </Tooltip>
                  )}
                  
                </TableCell>

                {/* توضیحات */}
                <TableCell align="center" >
                  <ShortText
                    text={giveDir() === 'rtl' ? row.fa_description : row.en_description}
                    limit={80}
                  />
                </TableCell>


                {/* عملیات */}
                <TableCell align="center">
                  <HStack spacing={2} justify="center">
                    {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_SERVICE_COMPONENT_MICROSERVICE)) && (
                      <Tooltip label={giveText(378)}>
                        <Box cursor="pointer" onClick={() => openServiceApiModal(row)}>
                          <CustomSettingsIcon fontSize="1.4rem" color={TURQUOISE_COLOR} />
                        </Box>
                      </Tooltip>
                    )}

                    {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE)) && (
                      <Tooltip label={giveText(83)}>
                        <Box cursor="pointer" onClick={() => openEditModal(row)}>
                          <CustomEditIcon fontSize="1.3rem" color="blue.500" />
                        </Box>
                      </Tooltip>
                    )}

                    {(accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_SERVICE)) && (
                      <Tooltip label={giveText(30)}>
                        {/* <Box cursor="pointer" onClick={() => openRemoveModal(row)}> */}
                        <HStack mt={2} spacing={2}>
                          {/* <RemoveIcon /> */}
                          {(accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_SERVICE_COMPONENT_MICROSERVICE)) &&
                            <SettingsIcon Icon={CustomSettingsIcon}
                                          fontSize={'1.4rem'}
                                          tooltipTitle={giveText(378)}
                                          onClick={() => {
                                            openServiceApiModal(row);
                                          }} />
                          }

                          {(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE)) &&
                            <SettingsIcon Icon={CustomEditIcon}
                                          fontSize={'1.3rem'}
                                          tooltipTitle={giveText(83)}
                                          onClick={() => {
                                            openEditModal(row);
                                          }} />
                          }

                          {(accessSlice.isAdmin || accessSlice.userAccess?.includes(DELETE_SERVICE)) &&
                            <RemoveIcon onClick={() => openRemoveModal(row)} />
                          }
                          <Tooltip showArrow content={<Text fontWeight={'500'} fontSize={'15px'} >{functionalitiesCount}</Text>}
                                    colorPalette={'white'} dir={'rtl'} textAlign={'center'} borderRadius={5}>
                            <InfoIcon width={'1.35rem'} />
                          </Tooltip>
                        {/* </Box> */}
                        </HStack>
                      </Tooltip>
                    )}
                  </HStack>
                </TableCell>
              </TableRow>
            );
          })}
        />
      )}

              {/* </Box> */}
    </Box>

    <DialogRoot lazyMount
                open={isOpenServiceApi}
                size={'full'}
                onOpenChange={(e) => setIsOpenServiceApi(e.open)}>
      <DialogContent>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <ServiceApiComponent selectedService={service}
                                 updated={updated}
                                 onCloseModal={() => setIsOpenServiceApi(false)}
                                 handleClickShowCelebration={handleClickShowCelebration} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                scrollBehavior={'inside'}
                open={isOpenEdit}
                size={'lg'}
                onOpenChange={(e) => setIsOpenEdit(e.open)}
                placement={'center'}>
      <DialogContent minW={'90rem'} minH={'50rem'}>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditService editing={true}
                            onCloseModal={() => {
                              setIsOpenEdit(false);
                              updated();
                            }}
                            service={service}
                            putAxios={putAxios} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                open={isOpenRemove}
                size={'sm'}
                onOpenChange={(e) => setIsOpenRemove(e.open)}
                placement={'center'}>
      <DialogContent>
        <DialogBody p={2}>
          <Suspense fallback={'loading...'}>
            <Remove removeAxios={removeAxios}
                    data={service}
                    onClose={() => {
                      setIsOpenRemove(false);
                      updated();
                    }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                scrollBehavior={'inside'}
                open={isOpenShow}
                size={'xl'}
                onOpenChange={(e) => {
                  setIsOpenShow(e.open);
                }}
                placement={'center'}>
      <DialogContent>
        <DialogBody maxH={'700px'} py={8} px={3}>
          <Suspense fallback={'loading...'}>
            <ShowService service={service} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <DialogRoot lazyMount
                scrollBehavior={'inside'}
                open={isOpenAddService}
                onOpenChange={(e) => setIsOpenAddService(e.open)}
                placement={'center'}>
      <DialogContent minW={'90rem'} minH={'50rem'}>
        <DialogBody>
          <Suspense fallback={'loading...'}>
            <AddEditService onCloseModal={() => setIsOpenAddService(false)} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>

    <CelebrationComponent />
  </>;
}
