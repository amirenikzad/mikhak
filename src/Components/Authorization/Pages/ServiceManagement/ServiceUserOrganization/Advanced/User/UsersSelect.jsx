import { useCallback, useEffect, useRef, useState } from 'react';
import { giveText } from '../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { Box } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { fetchWithAxios } from '../../../../../../Base/axios/FetchAxios.jsx';
import { ChevronDownOutlineIcon } from '../../../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';

export default function UsersSelect({ setSelectedUser }) {
  const [searchedSelectValue, setSearchedSelectValue] = useState('');
  const [listValue, setListValue] = useState([]);
  const observer = useRef(null);

  useEffect(() => {
    return () => {
      setSelectedUser({});
    };
  }, [setSelectedUser]);

  const allUsersAxios = async ({ pageParam = 1 }) => {
    try {
      const response = await fetchWithAxios.get(`/user/all?page=${pageParam}&page_size=20&search=${searchedSelectValue}`);
      return {
        users: response.data.users,
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
    queryKey: ['get_all_users', searchedSelectValue],
    queryFn: allUsersAxios,
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
      setListValue(data?.pages.flatMap((page) => page?.users));
    }
  }, [data]);

  const userSearchSelect = () => (
    <Box w={'100%'}>
      <FloatingLabelSearchSelectScrollPaginationInput label={giveText(0)}
                                                      placeholder={''}
                                                      usernameKey={'username'}
                                                      picKey={null}
                                                      boxWidth={'510px'}
                                                      inputWidth={'600px'}
                                                      dir={'ltr'}
                                                      list={listValue}
                                                      lastElementUserRef={lastElementRef}
                                                      loading={isLoading}
                                                      hasInputLeftElement={true}
                                                      InputLeftElementIcon={(
                                                            <ChevronDownOutlineIcon width={'1rem'} />
                                                          )}
                                                      value={searchedSelectValue}
                                                      onChange={(event) => {
                                                            setSearchedSelectValue(event.target.value);
                                                          }}
                                                      onKeyDown={(event) => {
                                                            if (event.key === 'Backspace') {
                                                              setSelectedUser({ id: '', username: '' });
                                                              setSearchedSelectValue  ('');
                                                            }
                                                          }}
                                                      onSelectMethod={(value) => {
                                                            setSelectedUser(value);
                                                            setSearchedSelectValue(value.username);
                                                          }}
                                                      onClear={() => {
                                                        setSearchedSelectValue('');
                                                      }}
                                                        />
    </Box>
  );

  return userSearchSelect();
};
