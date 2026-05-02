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
  const [treeSearch, setTreeSearch] = useState('');
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
          `/tree/all?page=${pageParam}&page_size=20&search=${treeSearch}`,
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
    queryKey: ['all_services_list', treeSearch],
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
  if (apiForm.tittle?.value) {
    setTreeSearch(apiForm.tittle.value);
  }
}, [apiForm.tittle?.value]);

  return (
    <Stack spacing={2}>

      <Grid templateColumns={'repeat(2, 1fr)'} gap={2} dir={'ltr'}>
        <GridItem colSpan={1}>
          <FloatingLabelInput label={giveText(461)}
                              name={'prof_id'}
                              dir={'auto'}
                              value={apiForm.prof_id?.value || []}
                              invalid={apiForm.prof_id?.isInvalid}
                              type={'text'}
                              mx={3}
                              onKeyDown={(event) => handleEnter(event, buttonId)}
                              // onChange={changeInputs}
                              isDisabled
                               />
        </GridItem>

        <GridItem colSpan={1}>
          <FloatingLabelInput label={giveText(336)}
                              name={'tittle'}
                              dir={'auto'}
                              value={apiForm.tittle?.value || []}
                              invalid={apiForm.tittle?.isInvalid}
                              type={'text'}
                              mx={3}
                              onKeyDown={(event) => handleEnter(event, buttonId)}
                              // onChange={changeInputs}
                              isDisabled
                               />
        </GridItem>
      </Grid>

      <Grid templateColumns={'repeat(2, 1fr)'} gap={2} dir={'ltr'}>
        <GridItem colSpan={1}>
          <FloatingLabelInput label={giveText(462)}
                              name={'node_count'}
                              dir={'auto'}
                              value={apiForm.node_count?.value || []}
                              invalid={apiForm.node_count?.isInvalid}
                              type={'text'}
                              mx={3}
                              onKeyDown={(event) => handleEnter(event, buttonId)}
                              // onChange={changeInputs}
                              isDisabled
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
      <Grid templateColumns={'repeat(2, 1fr)'} gap={2} dir={'ltr'}>
        <GridItem colSpan={1}>
          <FloatingLabelInput label={giveText(463)}
                              name={'level_count'}
                              dir={'auto'}
                              value={apiForm.level_count?.value || []}
                              invalid={apiForm.level_count?.isInvalid}
                              type={'text'}
                              mx={3}
                              onKeyDown={(event) => handleEnter(event, buttonId)}
                              // onChange={changeInputs}
                              isDisabled
                               />
        </GridItem>

        <GridItem colSpan={1}>
          <FloatingLabelInput label={giveText(464)}
                              name={'event_count'}
                              dir={'auto'}
                              value={apiForm.event_count?.value || []}
                              invalid={apiForm.event_count?.isInvalid}
                              type={'text'}
                              mx={3}
                              onKeyDown={(event) => handleEnter(event, buttonId)}
                              // onChange={changeInputs}
                              isDisabled
                               />
        </GridItem>
      </Grid>

{/*   <FloatingLabelTextArea label={giveText(153)}
                             name={'description'}
                             maxH={'180px'}
                             minH={'130px'}
                             value={apiForm.description.value}
                             type={'text'}
                             // onChange={changeInputs}
                              isDisabled
                               /> */}
    </Stack>
  );
};
