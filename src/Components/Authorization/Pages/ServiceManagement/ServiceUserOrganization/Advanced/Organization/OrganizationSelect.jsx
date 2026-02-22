import { useCallback, useEffect, useRef, useState } from 'react';
import { giveText } from '../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { Box } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { fetchWithAxios } from '../../../../../../Base/axios/FetchAxios.jsx';
import { ChevronDownOutlineIcon } from '../../../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';

export default function OrganizationSelect({ setSelectedOrganization }) {
  const [searchedSelectValue, setSearchedSelectValue] = useState('');
  const [listValue, setListValue] = useState([]);
  const observer = useRef(null);

  useEffect(() => {
    return () => {
      setSelectedOrganization({});
    };
  }, [setSelectedOrganization]);

  const allOrganizationsAxios = async ({ pageParam = 1 }) => {
    try {
      const response = await fetchWithAxios.get(`/organization/all?page=${pageParam}&page_size=20&search=${searchedSelectValue}`);

      return {
        organizations: response.data.organizations,
        next_page: response.data.next_page,
      };
    } catch (error) {
      throw error;
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage: isFetching,
  } = useInfiniteQuery({
    queryKey: ['get_all_organizations', searchedSelectValue],
    queryFn: allOrganizationsAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementRef = useCallback((node) => {
    if (isFetching) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage().then(() => null);
      }
    });

    if (node) observer.current.observe(node);
  }, [isFetching, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (data) {
      setListValue(data?.pages.flatMap((page) => page?.organizations));
    }
  }, [data]);

  const userSearchSelect = () => (
    <Box w={'100%'}>
      <FloatingLabelSearchSelectScrollPaginationInput label={giveText(131)}
                                                      placeholder={''}
                                                      usernameKey={'name'}
                                                      picKey={null}
                                                      boxWidth={'500px'}
                                                      inputWidth={'600px'}
                                                      dir={'ltr'}
                                                      list={listValue}
                                                      lastElementUserRef={lastElementRef}
                                                      loading={isLoading}
                                                      hasInputLeftElement={true}
                                                      InputLeftElementIcon={<ChevronDownOutlineIcon
                                                            width={'1rem'} />}
                                                      value={searchedSelectValue}
                                                      onChange={(event) => {
                                                            setSearchedSelectValue(event.target.value);
                                                          }}
                                                      onKeyDown={(event) => {
                                                            if (event.key === 'Backspace') {
                                                              setSelectedOrganization({ id: '', name: '' });
                                                              setSearchedSelectValue('');
                                                            }
                                                          }}
                                                      onSelectMethod={(value) => {
                                                            setSelectedOrganization(value);
                                                            setSearchedSelectValue(value.name);
                                                          }}
                                                      onClear={() => {
                                                            setSearchedSelectValue('');
                                                          }}
                                                           />
    </Box>
  );

  return userSearchSelect();
};
