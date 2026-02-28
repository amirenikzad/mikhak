import { Box, HStack, Grid, GridItem, Stack } from '@chakra-ui/react';
import { giveText } from '../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { commaForEvery3Digit, handleEnter } from '../../../../../Base/BaseFunction.jsx';
import FloatingLabelInput from '../../../../../Base/CustomComponets/FloatingLabelInput.jsx';
import FloatingLabelTextArea from '../../../../../Base/CustomComponets/FloatingLabelTextArea.jsx';
import FloatingLabelSelect from '../../../../../Base/CustomComponets/FloatingLabelSelect.jsx';
import { ChevronDownOutlineIcon } from '../../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { GET_ALL_SERVICES } from '../../../../../Base/UserAccessNames.jsx';
import { fetchWithAxios } from '../../../../../Base/axios/FetchAxios.jsx';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useColorMode } from '../../../../../ui/color-mode.jsx';

export const FormData = ({
                           setApiForm,
                           methodOptions,
                           apiForm = {},
                           changeInputs,
                           buttonId,
                         }) => {
  const accessSlice = useSelector(state => state.accessSlice);
  // const [searchedSelectServiceValue, setSearchedSelectServiceValue] = useState(apiForm.name.value || '');
  const [categorySearch, setCategorySearch] = useState('');
  const [servicesOptions, setServicesOptions] = useState([]);
  const selectServicesController = new AbortController();
  const { colorMode } = useColorMode(); 
  const observer = useRef(null);
  const [currentPicKey, setCurrentPicKey] = useState(colorMode === 'light' ? 'light_icon' : 'dark_icon');
  const [userTyped, setUserTyped] = useState(false);

  const allServices = async ({ pageParam = 1 }) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_ALL_SERVICES)) {
      try {
        const response = await fetchWithAxios.get(
          // `/category/all?page=${pageParam}&page_size=20&search=${searchedSelectServiceValue}`,
          `/category/all?page=${pageParam}&page_size=20&search=${categorySearch}`,
          {
            signal: selectServicesController.signal,
          },
        );

        return {
          services: response.data.categories,
          next_page: response.data.next_page,
        };
      } catch (error) {
        throw error;
      }
    }
  };

  const {
    data: servicesData,
    fetchNextPage: fetchingNectPageServices,
    hasNextPage: serviceHasNextPage,
    isLoading: servicesIsLoading,
    isFetchingNextPage: isFetchingServices,
    isRefetching: serviceIsRefetching,
  } = useInfiniteQuery({
    // queryKey: ['all_services_list', searchedSelectServiceValue],
    queryKey: ['all_services_list', categorySearch],
    queryFn: allServices,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
    enabled: userTyped,
  });

  // console.log('servicesData2',servicesData);

  const lastElementServicesRef = useCallback((node) => {
    if (servicesIsLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && serviceHasNextPage && !isFetchingServices && !serviceIsRefetching) {
        fetchingNectPageServices().then(() => null);
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchingNectPageServices, serviceHasNextPage, isFetchingServices, servicesIsLoading, serviceIsRefetching]);

  useEffect(() => {
    if (servicesData) {
      setServicesOptions(servicesData?.pages.flatMap((page) => page?.services));
    }
    // console.log('servicesData',servicesData);
  }, [servicesData]);

  useEffect(() => {
    if (apiForm.category_name?.value) {
      setCategorySearch(apiForm.category_name.value);
    }
    // console.log('apiForm2',apiForm);
  }, [apiForm.category_name?.value]);

  return (
    <Stack spacing={2}>

      <Grid templateColumns={'repeat(2, 1fr)'} gap={2} dir={'ltr'}>
        <GridItem colSpan={1}>
          <FloatingLabelSelect name={'method'}
                               options={methodOptions}
                               label={giveText(36)}
                               value={apiForm.method.value ||  []}
                               onChange={(event) => {
                                 setApiForm((prev) => ({
                                   ...prev, method: {
                                     value: event.value,
                                     isInvalid: prev.isInvalid,
                                   },
                                 }));
                               }} />
        </GridItem>

        <GridItem colSpan={1}>
          <FloatingLabelInput label={giveText(376)}
                              name={'api'}
                              dir={'auto'}
                              value={apiForm.api.value}
                              invalid={apiForm.api.isInvalid}
                              type={'text'}
                              mx={3}
                              onKeyDown={(event) => handleEnter(event, buttonId)}
                              onChange={changeInputs} />
        </GridItem>
      </Grid>

      <Grid templateColumns={'repeat(2, 1fr)'} gap={2} dir={'ltr'}>
        <GridItem colSpan={1}>

          {/* <FloatingLabelSearchSelectScrollPaginationInput
                                                          label={giveText(313)}
                                                          inputWidth="300px"
                                                          placeholder=""
                                                          dir="ltr"
                                                          usernameKey="en_name"
                                                          
                                                          boxWidth="300px"
                                                          isFetching={isFetchingServices}
                                                          list={servicesOptions}
                                                          lastElementUserRef={lastElementServicesRef}
                                                          loading={isFetchingServices}
                                                          hasInputLeftElement={true}
                                                          hasInputRightElement={true}
                                                          picKey={currentPicKey}
                                                          InputLeftElementIcon={<ChevronDownOutlineIcon width="1rem" />}
                                                          the_icon={apiForm.project_light_icon?.value}
                                                          onClear={() => {
                                                            setSearchedSelectServiceValue(''); 
                                                            setApiForm(prev => ({
                                                                ...prev,
                                                                project_id: { value: '', isInvalid: false },
                                                                project_name: { value: '', isInvalid: false },
                                                              }));
                                                          }}

                                                          value={apiForm.project_name?.value || ''}
                                                          onChange={event => {
                                                            selectServicesController.abort();
                                                            
                                                            setCurrentPicKey(colorMode === 'light' ? 'light_icon' : 'dark_icon');
                                                          }}
                                                          onKeyDown={event => {
                                                            setApiForm(prev => ({
                                                              ...prev,
                                                              project_id: { value: '', isInvalid: false },
                                                            }));
                                                            if (event.key === 'Backspace') {
                                                              selectServicesController.abort();
                                                              
                                                              setCurrentPicKey(colorMode === 'light' ? 'light_icon' : 'dark_icon');
                                                              
                                                            }
                                                          }}
                                                          onSelectMethod={value => {
                                                            selectServicesController.abort();
                                                            setApiForm(prev => ({
                                                              ...prev,
                                                              
                                                              project_id: { value: String(value.id), isInvalid: false },
                                                              project_name: { value: value.en_name, isInvalid: false, },
                                                            }));
                                                            
                                                            setCurrentPicKey(colorMode === 'light' ? 'light_icon' : 'dark_icon');
                                                          }}
                                                        /> */}
            <FloatingLabelSearchSelectScrollPaginationInput
                                                          label={giveText(313)}
                                                          inputWidth="300px"
                                                          placeholder=""
                                                          dir="ltr"
                                                          usernameKey="category_name"
                                                          
                                                          boxWidth="300px"
                                                          isFetching={isFetchingServices}
                                                          list={servicesOptions}
                                                          lastElementUserRef={lastElementServicesRef}
                                                          loading={isFetchingServices}
                                                          hasInputLeftElement={true}
                                                          // hasInputRightElement={true}
                                                          picKey={''}
                                                          InputLeftElementIcon={<ChevronDownOutlineIcon width="1rem" />}
                                                          the_icon={apiForm.project_light_icon?.value}
                                                          // onClear={() => {
                                                          //   setSearchedSelectServiceValue(''); 
                                                          //   setApiForm(prev => ({
                                                          //       ...prev,
                                                          //       project_id: { value: '', isInvalid: false },
                                                          //       category_name: { value: '', isInvalid: false },
                                                          //     }));
                                                          // }}
                                                          onClear={() => {
                                                            setCategorySearch('');
                                                            setUserTyped(true);
                                                            setApiForm(prev => ({
                                                              ...prev,
                                                              category_id: { value: '', isInvalid: false },
                                                              category_name: { value: '', isInvalid: false },
                                                            }));
                                                          }}

                                                          // value={apiForm.category_name?.value || ''}
                                                          value={categorySearch}
                                                          // onChange={event => {
                                                          //   selectServicesController.abort();
                                                            
                                                          //   setCurrentPicKey(colorMode === 'light' ? 'light_icon' : 'dark_icon');
                                                          // }}
                                                          onChange={(e) => {
                                                            const val = e?.target?.value ?? e;
                                                            setCategorySearch(val);
                                                            setUserTyped(true);
                                                          }}
                                                          onKeyDown={event => {
                                                            setUserTyped(true);
                                                            setApiForm(prev => ({
                                                              ...prev,
                                                              category_name: { value: '', isInvalid: false },
                                                            }));
                                                            if (event.key === 'Backspace') {
                                                              selectServicesController.abort();
                                                              
                                                              setCurrentPicKey(colorMode === 'light' ? 'light_icon' : 'dark_icon');
                                                              
                                                            }
                                                          }}
                                                          // onSelectMethod={value => {
                                                          //   selectServicesController.abort();
                                                          //   setApiForm(prev => ({
                                                          //     ...prev,
                                                              
                                                          //     project_id: { value: String(value.id), isInvalid: false },
                                                          //     category_name: { value: value.category_name, isInvalid: false, },
                                                          //   }));
                                                            
                                                          //   setCurrentPicKey(colorMode === 'light' ? 'light_icon' : 'dark_icon');
                                                          // }}
                                                          onSelectMethod={(value) => {
                                                            setUserTyped(true);
                                                            setApiForm(prev => ({
                                                              ...prev,
                                                              category_id: { value: String(value.id), isInvalid: false },
                                                              category_name: { value: value.category_name, isInvalid: false },
                                                            }));
                                                            setCategorySearch(value.category_name);
                                                          }}
                                                        />

        </GridItem>

        <GridItem colSpan={1} my={'auto'}>
          <FloatingLabelInput label={giveText(196)}
                              dir={'ltr'}
                              mx={3}
                              name={'price'}
                              value={commaForEvery3Digit(apiForm.price.value)}
                              onChange={(e) => {
                                changeInputs({
                                  target: {
                                    name: 'price',
                                    value: e.target.value.replace(/[^\d.-]/g, ''),
                                  },
                                });
                              }} />
        </GridItem>
      </Grid>

      <FloatingLabelTextArea label={giveText(153)}
                             name={'description'}
                             maxH={'180px'}
                             minH={'130px'}
                             value={apiForm.description.value}
                             type={'text'}
                             onChange={changeInputs} />
    </Stack>
  );
};
