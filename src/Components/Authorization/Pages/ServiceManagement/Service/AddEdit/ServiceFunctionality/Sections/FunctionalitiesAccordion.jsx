import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Stack,
  Text,
  Spinner,
  createListCollection,
} from '@chakra-ui/react';
import { giveDir, giveText } from '../../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { fetchWithAxios } from '../../../../../../../Base/axios/FetchAxios.jsx';
import { hasPersianText, methodTagIconColor } from '../../../../../../../Base/BaseFunction.jsx';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import FloatingLabelInput from '../../../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import { TableText } from '../../../../../../../Base/Extensions.jsx';
import { MENU_BACKGROUND_DARK } from '../../../../../../../Base/BaseColor.jsx';
import { useColorMode } from '../../../../../../../ui/color-mode.jsx';
import {
  AccordionItem,
  AccordionRoot,
  AccordionItemContent,
  AccordionItemTrigger,
} from '../../../../../../../ui/accordion.jsx';
import {
  PopoverBody,
  PopoverRoot,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from '../../../../../../../ui/popover.jsx';
import { Tag } from '../../../../../../../ui/tag.jsx';
import { SearchIcon } from '../../../../../../../Base/CustomIcons/SearchIcon.jsx';
import { MoveIcon } from '../../../../../../../Base/CustomIcons/MoveIcon.jsx';
import Checkbox from '@mui/material/Checkbox';
import ScrollToPaginate from '../../../../../../../Base/CustomComponets/ScrollToPaginate.jsx';
import { CircularCrossFillIcon } from '../../../../../../../Base/CustomIcons/CircularCrossFillIcon.jsx';
import FloatingLabelSelect from '../../../../../../../Base/CustomComponets/FloatingLabelSelect.jsx';
import { GET_ALL_DISTINCT_SERVICE } from '../../../../../../../Base/UserAccessNames.jsx';
import { useSelector } from 'react-redux';

const DescriptionTableAPI = lazy(() => import('../CustomNode/DescriptionTableFunctionality'));

export default function FunctionalitiesAccordion({ apisDropped = [] , selectedService}) {
  const { colorMode } = useColorMode();
  const observer = useRef(null);
  const accessSlice = useSelector(state => state.accessSlice);
  // const [selectedService, setSelectedService] = useState([giveText(413)]);
  const [searchValue, setSearchValue] = useState('');
  const [functionalitiesList, setFunctionalitiesList] = useState([]);
  const [selectedFunctionalities, setSelectedFunctionalities] = useState([]);
  const controllerRef = useRef(null);

  const handleDragStart = (event, functionality) => {
    const isSelected = selectedFunctionalities.includes(functionality?.id);

    const itemsToDrag = isSelected
      ? functionalitiesList.filter(c => selectedFunctionalities.includes(c.id))
      : [functionality];

    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(itemsToDrag.map(c => ({ ...c, id: c.id, type: 'input' }))),
    );
    event.dataTransfer.effectAllowed = 'move';

    const dragImage = document.createElement('div');
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.left = '-1000px';
    dragImage.style.padding = '4px 8px';
    dragImage.style.background = 'rgba(0,0,0,0.7)';
    dragImage.style.color = 'white';
    dragImage.style.fontSize = '12px';
    dragImage.style.borderRadius = '4px';
    dragImage.style.pointerEvents = 'none';
    dragImage.innerText = itemsToDrag.length > 1 ? `${itemsToDrag.length} components` : functionality?.name;

    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 50, 10);

    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const allFunctionalitiesListAxios = async ({ pageParam = 1 }) => {
    try {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const newController = new AbortController();
      controllerRef.current = newController;

      const response = await fetchWithAxios.get(
        // `/functionalities/filter?&page=${pageParam}&page_size=20&search=${searchValue}&project_id=${selectedService ? (selectedService[0] === giveText(413) ? '' : selectedService[0]) : ''}`,
        `/functionalities/filter?&page=${pageParam}&page_size=20&search=${searchValue}&category_id=${selectedService ? selectedService : ''}`,
        {
          signal: newController.signal,
        },
      );

      return {
        functionalities: response.data.functionalities,
        next_page: response.data.next_page,
      };
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') return;
      throw error;
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['get_all_apis_axios', searchValue, selectedService],
    queryFn: allFunctionalitiesListAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementRef = useCallback((node) => {
    if (isFetchingNextPage) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage().then(() => null);
      }
    });

    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (data) {
      setFunctionalitiesList(data?.pages.flatMap((page) => page?.functionalities.filter((functionalities) => !apisDropped.includes(functionalities.id))));
    }
  }, [apisDropped, data]);

  const servicesAxios = async () => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_DISTINCT_SERVICE)) {
      const response = await fetchWithAxios.get('/distinct_service/all');
      console.log(response.data);

      return createListCollection({
        items: [
          { label: giveText(413), value: giveText(413) },
          ...response.data.map(service => ({
          //   return { label: service, value: service };
          // }),
          label: service.project_name,
            value: service.project_id, 
          })),
        ],
      });
    } else {
      return null;
    }
  };

  // const {
  //   data: servicesOptions,
  // } = useQuery({
  //   queryKey: ['servicesQuery', accessSlice],
  //   queryFn: servicesAxios,
  //   refetchOnWindowFocus: false,
  // });

  // let temp = { };
  // if (giveDir() === 'rtl') {
  //   temp['label'] = service.fa_name;
  //   temp['value'] = service.fa_name;
  // } else {
  //   temp['label'] = service.en_name;
  //   temp['value'] = service.en_name;
  // }
  // return temp;

  return <>
    <AccordionRoot defaultValue={['b']}
                   borderWidth={1}
                   borderRadius={4}
                   borderTopRadius={4}
                   collapsible
                   transition="all 0.5s ease"
                   _hover={{ boxShadow: '2xl' }}
                   backgroundColor={colorMode === 'light' ? 'white' : MENU_BACKGROUND_DARK}>
      <AccordionItem value={'b'}>
        <AccordionItemTrigger cursor={'pointer'} py={1} px={2}>
          <Box as="span" flex="1" textAlign="center">
            {giveText(103)}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent pb={4}>
          <Stack w={'100%'} cursor={'default'}>
            <Stack gap={3} px={3} pt={4}>
              <FloatingLabelInput label={giveText(10)}
                                  value={searchValue}
                                  dir={giveDir()}
                                  mx={3}
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

              {/* {servicesOptions?.items && */}
                {/* <FloatingLabelSelect options={servicesOptions}
                                     w={'100%'}
                                     label={giveText(313)}
                                     value={selectedService}
                                     onChange={(event) => {
                                       setSelectedService(event.value);
                                     }} /> */}
              {/* } */}
            </Stack>

            {functionalitiesList.length > 0 &&
              <Grid mt={2} templateColumns="repeat(2, 1fr)" gap={1} mx={5}>
                <GridItem colSpan={1}>
                  <HStack gap={0} dirsplay={'inline-block'}>
                    <Checkbox checked={selectedFunctionalities.length === functionalitiesList.length}
                              indeterminate={selectedFunctionalities.length > 0 && selectedFunctionalities.length < functionalitiesList.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFunctionalities(functionalitiesList.map((functionalities) => functionalities.id));
                                } else {
                                  setSelectedFunctionalities([]);
                                }
                              }}
                              inputProps={{ 'aria-label': 'controlled' }} />
                    <Text fontSize={'14px'}>{giveText(360)}</Text>
                  </HStack>
                </GridItem>

                <GridItem colSpan={1} dir={giveDir(true)} my={'auto'}>
                  {isFetching &&
                    <Spinner zIndex={'500 !important'} color={colorMode === 'light' ? 'blue.700' : 'white'} />
                  }
                </GridItem>
              </Grid>
            }

            <Box height={'55dvh'} overflowY={'auto'} px={3}>
              {functionalitiesList.map((functionality, functionalityIndex) => (
                <PopoverRoot lazyMount positioning={{ placement: giveDir() === 'rtl' ? 'left' : 'right' }}>
                  <PopoverTrigger asChild>
                    <Grid templateColumns={'repeat(8, 1fr)'}
                          key={functionalityIndex}
                          gap={4}
                          dir={'ltr'}
                          px={2}
                          py={1}
                          boxShadow={'md'}
                          draggable={true}
                          onDragStart={(event) => {
                            handleDragStart(event, { ...functionality, id: functionality?.id, type: 'input' });
                          }}
                          cursor={'grab'}
                          borderRadius={8}
                          borderWidth={1}
                          my={2}
                          transition="all 0.2s ease">
                      <GridItem colSpan={1} my={'auto'}>
                        <Flex>
                          <Checkbox checked={selectedFunctionalities.includes(functionality?.id)}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedFunctionalities(prev => [...prev, functionality?.id]);
                                      } else {
                                        setSelectedFunctionalities(prev => prev.filter(id => id !== functionality?.id));
                                      }
                                    }}
                                    inputProps={{ 'aria-label': 'controlled' }} />

                          <Tag backgroundColor={methodTagIconColor(functionality?.method.toString(), colorMode)}
                               px={1}
                               my={'auto'}
                               height={'25px'}
                               borderRadius={2}>
                            <TableText cursor={''}
                                       fontSize={'12px'}
                                       pt={1}
                                       text={functionality?.method.toString().toUpperCase()}
                                       copyable={false}
                                       hasCenter={false} />
                          </Tag>
                        </Flex>
                      </GridItem>

                      <GridItem colSpan={6} my={'auto'}>
                        <Text dir={hasPersianText(functionality?.name) ? 'rtl' : 'ltr'}>
                          {/* {functionality?.name} */}
                          {functionality?.api}
                          {/* {functionality?.api?.name || functionality?.api?.path || functionality?.name} */}
                        </Text>
                      </GridItem>

                      <GridItem colSpan={1} my={'auto'}>
                        <Center my={'auto'}>
                          <MoveIcon width={'1rem'} />
                        </Center>
                      </GridItem>
                    </Grid>
                  </PopoverTrigger>

                  <PopoverContent className={'box_shadow'} w={'400px'}>
                    <PopoverArrow />

                    <PopoverBody>
                      <Suspense fallback={'loading...'}>
                        <DescriptionTableAPI api={functionality} />
                      </Suspense>
                    </PopoverBody>
                  </PopoverContent>
                </PopoverRoot>
              ))}

              <ScrollToPaginate lastElementRef={lastElementRef} isLoading={isFetching} />
            </Box>
          </Stack>
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>

    <Box id="drag-preview"
         position="absolute"
         top="-9999px"
         left="-9999px"
         pointerEvents="none"
         px={3}
         py={2}
         borderRadius="md"
         bg="white"
         boxShadow="lg"
         border="1px solid"
         borderColor="gray.300"
         maxW="250px"
         zIndex={9999}>
      <Text id="drag-preview-text" fontSize="sm" isTruncated noOfLines={1}>
        Dragging...
      </Text>
    </Box>
  </>;
};
