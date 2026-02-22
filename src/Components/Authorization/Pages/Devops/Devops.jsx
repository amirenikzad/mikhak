import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Separator,
} from '@chakra-ui/react';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setPageName } from '../../../../store/features/pagesSlice.jsx';
import { DEVOPS_NAME } from '../../../Base/PageNames.jsx';
import { giveDir, giveText } from '../../../Base/MultiLanguages/HandleLanguage.jsx';
import { useColorMode } from '../../../ui/color-mode.jsx';
import { motion } from 'motion/react';
import { fetchWithAxios } from '../../../Base/axios/FetchAxios.jsx';
import { useInfiniteQuery } from '@tanstack/react-query';
import { RemoveIcon, SettingsIcon } from '../../../Base/IconsFeatures/Icons.jsx';
import { SettingsIcon as CustomSettingsIcon } from '../../../Base/CustomIcons/SettingsIcon.jsx';
import { Tooltip } from '../../../ui/tooltip.jsx';
import no_image_light from '../../../../assets/images/no_image_light.png';
import no_image_dark from '../../../../assets/images/no_image_dark.png';
import FloatingLabelSearchSelectScrollPaginationInput from '../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { ChevronDownOutlineIcon } from '../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import { CircularCrossFillIcon } from '../../../Base/CustomIcons/CircularCrossFillIcon.jsx';
import DevopsSettingsModal from './DevopsSettingsModal.jsx';
import { onOpenModal } from '../../../../store/features/streamSlice';
import { setBreadcrumbAddress } from '../../../../store/features/baseSlice.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { memo } from 'react';

import { MenuIcon } from '../../../Base/CustomIcons/MenuIcon.jsx';
import { CartViewIcon } from '../../../Base/CustomIcons/CartViewIcon.jsx';
import { BaseTablePage } from '../BaseTablePage.jsx';
import TableRow from '@mui/material/TableRow';
import { TableCell } from '@mui/material';

const ShortText = memo(({ text = '', limit = 100 }) => {
  const { colorMode } = useColorMode();
  if (!text || text === '---' || text.trim() === '') {
    return <Text color={colorMode === 'light' ? 'black' : 'white'}  fontSize="13px" color="gray.500">---</Text>;
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';

  if (plainText.length > limit) {
    return (
      <Text color={colorMode === 'light' ? 'black' : 'white'}  fontSize="13px" textAlign="justify" mt={2}>
        {plainText.slice(0, limit)}...
      </Text>
    );
  }

  return (
    <Text color={colorMode === 'light' ? 'black' : 'white'} 
      fontSize="13px"
      textAlign="justify"
      mt={2}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
});

const getStatusLabel = (status) => {
  switch (status) {
    case 0:
      return giveText(426);
    case 1:
      return giveText(421);
    case 2:
      return giveText(422);
    case 3:
      return giveText(423);
    case 4:
      return giveText(424);
    case 5:
      return giveText(425);
  }
};

export default function Devops() {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const [listValue, setListValue] = useState([]);
  const observer = useRef(null);
  const controllerRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusValue, setStatusValue] = useState(null);
  const [statusLabel, setStatusLabel] = useState(giveText(342));
  const devopsInputRef = useRef(null);
  const devopsStatusInputRef = useRef(null);
  const [selectedDevopsLocal, setSelectedDevopsLocal] = useState(null);
  const observerContainerRef = useRef(null);
  const reactQueryItemName = useMemo(() => 'get_all_devops', []);
  const queryClient = useQueryClient();
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountLabel, setTotalCountLabel] = useState(0);

  const [viewType, setViewType] = useState("card"); 

  useEffect(() => {
    dispatch(setBreadcrumbAddress([
      { type: 'text', text: giveText(417) },
    ]));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setPageName(DEVOPS_NAME));
  }, []);

  const allDevopsListAxios = async ({ pageParam = 1 }) => {
    try {
      if (controllerRef.current) controllerRef.current.abort();
      const newController = new AbortController();
      controllerRef.current = newController;

      
      const params = new URLSearchParams({
        page: pageParam,
        page_size: pageSize,
        search: searchValue ?? '', 
      });

      if (statusValue !== null && statusValue !== '' && statusValue !== undefined) {
        params.append('status', statusValue);
      }

      const response = await fetchWithAxios.get(`/devops/all?${params.toString()}`, {
        signal: newController.signal,
      });

      const respData = response.data || {};

      return {
        page: respData.page,
        page_size: respData.page_size,
        total: respData.total,
        items: respData.items || [],
        next_page: respData.next_page ?? null,
        devops: respData.items || [],
        totalCount: respData.totalCount ?? null,
      };
    } catch (error) {
      console.error('[Devops] Fetch error:', error);
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        return { page: pageParam, page_size: pageSize, total: 0, items: [], next_page: null, devops: [] };
      }
      throw error;
    }
  };

  useEffect(() => {
    setTotalCountLabel(totalCount ?? 0);
  }, [totalCount]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: isFetching,
  } = useInfiniteQuery({
    queryKey: [reactQueryItemName, searchValue, statusValue],
    queryFn: allDevopsListAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  
  const lastElementRef = useCallback((node) => {
  if (isFetching) return;
  if (observer.current) observer.current.disconnect();

  observer.current = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    {
      root: observerContainerRef.current,
      rootMargin: '0px',
    }
  );

  if (node) observer.current.observe(node);
}, [isFetching, hasNextPage, fetchNextPage]);


  useEffect(() => {
    if (data) {
      const all = data?.pages.flatMap((page) => page?.devops || []);
      setListValue(all);
    }

    if (!data || !data.pages) return;
    if (data.pages[0]?.total !== undefined) {
      setTotalCount(data.pages[0].total);
    }

  }, [data]);

  const headCells = [
    { id: 'service', label: giveText(225) },
    { id: 'status', label: giveText(202) },  
    { id: 'manager', label: giveText(418) },
    { id: 'organization', label: giveText(131) },
    { id: 'description', label: giveText(153) }, 
    { id: 'actions', label: giveText(4) }, 
  ];

  return (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box px={'2rem'} pt={'1.2rem'} >
          <HStack 
            spacing={4}
            dir={giveDir()}
            align="center"
            justify='space-between'
            w="full">
            {/* <Text color={colorMode === 'light' ? 'black' : 'white'}  fontWeight={'800'} fontSize={'24px'} cursor={'default'}>
              {giveText(417)}
            </Text> */}
            <Box display="flex" alignItems="center" gap="8px" fontWeight={'800'} fontSize={'22px'} >
              {giveText(417)}
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

            <HStack 
            spacing={4}
            dir={giveDir()}
            align="center"
            // justify='space-between'
            >

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
                  <Text color={colorMode === 'light' ? 'black' : 'white'}  fontWeight="500" fontSize="15px">
                    {viewType === "card" ? giveText(437) : giveText(436)}
                  </Text>
                }
                // isDisabled={!(accessSlice.isAdmin || accessSlice.userAccess?.includes(PUT_SERVICE))}
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

            <FloatingLabelSearchSelectScrollPaginationInput
                      label={giveText(202)}
                      // placeholder={''}
                      boxWidth={'240px'}
                      placeholder={statusLabel || giveText(342)}
                      dir={giveDir()}
                      list={[
                        { id: 6, username: giveText(342)} ,
                        { id: 0, username: giveText(426)} ,
                        { id: 1, username: giveText(421)} ,
                        { id: 2, username: giveText(422)} ,
                        { id: 3, username: giveText(423)} ,
                        { id: 4, username: giveText(424)} ,
                        { id: 5, username: giveText(425)} ,
                      ]}
                      lastElementUserRef={null}
                      loading={false}
                      hasInputLeftElement={true}
                      hasInputRightElement={true}
                      ref={devopsStatusInputRef}
                      InputLeftElementIcon={<ChevronDownOutlineIcon width={'1rem'} />}
                      
                      value={statusLabel}
                      onChange={(event) => setStatusValue(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Backspace') setStatusValue('');
                      }}
                      onSelectMethod={(value) => {
                        if (value.id === 6 || value.username === 'همه' || value.username === 'all') {
                          setStatusValue(null);
                          setStatusLabel(giveText(342));
                        } else {
                          setStatusValue(Number(value.id));
                        }
                        setStatusLabel(value.username);
                      }}
                      onClear={() => {
                        setStatusValue('');
                        setStatusLabel('');
                      }}

                    />
          <FloatingLabelSearchSelectScrollPaginationInput
                    label={giveText(419)}
                    placeholder={''}
                    dir={'ltr'}
                    usernameKey={'name'}
                    // inputWidth={'60px'}
                    lastElementUserRef={null}
                    loading={false}
                    hasInputLeftElement={true}
                    hasInputRightElement={true}
                    value={searchValue}
                    ref={devopsInputRef}
                    InputLeftElementIcon={<ChevronDownOutlineIcon width={'1rem'} />}
                    
                    onChange={(event) => setSearchValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Backspace') setSearchValue('');
                    }}
                    onSelectMethod={(value) => setSearchValue(value.name)}
                  />

            </HStack>
          </HStack>

        <Separator borderColor={colorMode === 'light' ? 'black' : 'white'} my={2} />
            {viewType === "card" && (
            <Box
              maxH="83vh" 
              overflowY="auto" 
              px={3}
              py={2}
              ref={observerContainerRef} 
            >
              <SimpleGrid columns={4} gap={6} mt={2} p={3}>
                {listValue?.map((value, index) => {
                  const isLast = index === listValue.length - 1;

                  const serviceIcon =
                    colorMode === 'light'
                      ? value?.service?.light_icon
                      : value?.service?.dark_icon;

                  return (
                    <Box
                        key={value?.devops_id || index}
                        ref={isLast ? lastElementRef : null}
                        borderRadius="xl"
                        p={5}
                        minH={'220px'}
                        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                        boxShadow="lg"
                        transition="all 0.2s"
                        _hover={{ boxShadow: '2xl', transform: 'scale(1.01)' }}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                      >
                      <Box>
                        <HStack mb={7} justifyContent="space-between" position="relative">
                          <Stack direction="row" align="right">
                            <Stack alignItems="center" mr={giveDir() === 'rtl' ? -2 : 0} ml={giveDir() === 'ltr' ? -2 : 0}>
                              <Image
                                src={serviceIcon || no_image_light}
                                boxSize="80px"
                                borderRadius="md"
                                alt="service icon"
                                objectFit="contain"
                                minWidth={'70px'}
                              />
                            </Stack>

                            <Stack>
                              <HStack >
                                <Text color={colorMode === 'light' ? 'black' : 'white'}  fontSize="17px"  mt={-2} minW={40} mb={0}>
                                  {giveDir() === 'rtl' ? value?.service?.fa_name : value?.service?.en_name}
                                </Text>
                                <Box
                                  border="1px solid"
                                  borderColor="green.500"
                                  color="green.500"
                                  // bg={colorMode === 'light' ? 'green.50' : 'green.900'}
                                  bg={colorMode === 'light' ? 'rgba(213, 245, 222, 0.7)' : 'rgba(34, 41, 36, 0.7)'}
                                  fontSize="13px"
                                  fontWeight="bold"
                                  px={3}
                                  py={1}
                                  borderRadius="md"
                                  boxShadow="md"
                                  display="inline-block"
                                  transform="rotate(-35deg)"  
                                  textAlign={'center'}
                                  mb={2}  
                                  minW={'100px'}    
                                  boxShadow="lg"   
                                  position={'absolute'}         
                                  left={'-40px'}
                                >
                                  {getStatusLabel(value?.status)}
                                </Box>
                              </HStack>
                              
                              <ShortText
                                text={
                                  giveDir() === 'rtl'
                                    ? value?.service?.fa_description || '---'
                                    : value?.service?.en_description || '---'
                                }
                              />

                          </Stack>
                        </Stack>
                      </HStack>
                    </Box>

                    <Box mt="auto">
                      <HStack mb={2}>
                        <Box w="100%">
                          <HStack>
                            <Tooltip
                              showArrow
                              content={
                                <Text color={colorMode === 'light' ? 'black' : 'white'}  fontWeight={'500'} fontSize={'15px'}>
                                  {giveText(418)}
                                </Text>
                              }
                              colorPalette={'white'}
                              textAlign={'center'}
                              borderRadius={5}
                            >
                              <HStack cursor="pointer">
                                <Image
                                  src={
                                    colorMode === 'light'
                                      ? value?.user?.profile_pic || no_image_light
                                      : value?.user?.profile_pic || no_image_dark
                                  }
                                  boxSize="30px"
                                  borderRadius="full"
                                  alt="manager"
                                />
                                <Text color={colorMode === 'light' ? 'black' : 'white'}  fontSize="14px">
                                  {`${value?.user?.name || ''} ${value?.user?.family || ''}`}
                                </Text>
                              </HStack>
                            </Tooltip>
                          </HStack>

                          <HStack mt={2} justifyContent="space-between">
                            <Tooltip
                              showArrow
                              content={
                                <Text color={colorMode === 'light' ? 'black' : 'white'}  fontWeight={'500'} fontSize={'15px'}>
                                  {giveText(183)}
                                </Text>
                              }
                              colorPalette={'white'}
                              textAlign={'center'}
                              borderRadius={5}
                            >
                              <HStack cursor="pointer">
                                <Image
                                  src={
                                    colorMode === 'light'
                                      ? value?.organization?.image || no_image_light
                                      : value?.organization?.image || no_image_dark
                                  }
                                  boxSize="30px"
                                  borderRadius="full"
                                  alt="organization"
                                />
                                <Text color={colorMode === 'light' ? 'black' : 'white'}  fontSize="14px">{value?.organization?.name || '---'}</Text>
                              </HStack>
                            </Tooltip>

                            <HStack mt={2} spacing={2}>
                              <SettingsIcon
                                Icon={CustomSettingsIcon}
                                fontSize={'1.5rem'}
                                tooltipTitle={giveText(378)}
                                onClick={() => {
                                  setSelectedDevopsLocal(value);
                                  dispatch(onOpenModal());
                                }}
                              />
                            </HStack>
                          </HStack>
                        </Box>
                      </HStack>
                    </Box>
                  </Box>

                );
              })}
            </SimpleGrid>
        </Box> 
        )}  
        {viewType === "table" && ( 
        <BaseTablePage
            isLoadingListAllUsers={isFetching}
            lastElementRef={lastElementRef}
            headCells={headCells}
            hasPagination={true}
            px="0"
            mt={0}
            body={
              listValue?.map((value, index) => {
                const isLast = index === listValue.length - 1;
                const serviceIcon = colorMode === 'light' ? value?.service?.light_icon : value?.service?.dark_icon;

                return (
                  <TableRow align='right' key={value?.devops_id || index} ref={isLast ? lastElementRef : null}>
                    <TableCell align='right'>
                      <HStack justify='right' spacing={3}>
                        <Image src={serviceIcon || (colorMode === 'light' ? no_image_light : no_image_dark)} boxSize="40px" borderRadius="md" objectFit="contain" />
                        <Text color={colorMode === 'light' ? 'black' : 'white'}  >
                          {giveDir() === 'rtl' ? value?.service?.fa_name : value?.service?.en_name}
                        </Text>
                      </HStack>
                    </TableCell>

                    <TableCell align="center">
                      <Box  color={colorMode === 'light' ? 'black' : 'white'} px={3} py={1} borderRadius="md" fontSize="13px" >
                        {getStatusLabel(value?.status)}
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <HStack justify="center" spacing={2}>
                        <Image src={value?.user?.profile_pic || (colorMode === 'light' ? no_image_light : no_image_dark)} boxSize="30px" borderRadius="full" />
                        <Text color={colorMode === 'light' ? 'black' : 'white'} >{`${value?.user?.name || ''} ${value?.user?.family || ''}`.trim() || '---'}</Text>
                      </HStack>
                    </TableCell>

                    <TableCell align="center">
                      <HStack justify="center" spacing={2}>
                        <Image src={value?.organization?.image || (colorMode === 'light' ? no_image_light : no_image_dark)} boxSize="30px" borderRadius="full" />
                        <Text color={colorMode === 'light' ? 'black' : 'white'} >{value?.organization?.name || '---'}</Text>
                      </HStack>
                    </TableCell>

                    <TableCell align='right'>
                      <ShortText text={giveDir() === 'rtl' ? value?.service?.fa_description : value?.service?.en_description} limit={80} />
                    </TableCell>

                    <TableCell align="center">
                        <SettingsIcon
                                Icon={CustomSettingsIcon}
                                fontSize={'1.5rem'}
                                tooltipTitle={giveText(378)}
                                onClick={() => {
                                  setSelectedDevopsLocal(value);
                                  dispatch(onOpenModal());
                                }}
                              />
                    </TableCell>
                  </TableRow>
                );
              })
            }
          />
        )}
       

      </Box>
      <DevopsSettingsModal selectedDevops={selectedDevopsLocal} queryClient={queryClient} />

    </motion.div>
  );
}
