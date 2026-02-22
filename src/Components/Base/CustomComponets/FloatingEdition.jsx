import { useEffect, useRef, useState, useCallback } from 'react';
import { Field } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchWithAxios } from '../../Base/axios/FetchAxios.jsx';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { giveDir, giveText } from '../../Base/MultiLanguages/HandleLanguage.jsx';
import { ChevronDownOutlineIcon } from '../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import { handleEnter } from '../BaseFunction.jsx';

const controller = new AbortController();

const fetchEditions = async ({ pageParam = 1, search = '' }) => {
  const response = await fetchWithAxios.get(
    `/edition/all?page=${pageParam}&page_size=20&search=${search}`,
    { signal: controller.signal }
  );
  return {
    editions: response.data.editions || response.data.items || [],
    next_page: response.data.next_page,
  };
};

export default function FloatingEdition({
                                          value = null,
                                          value2 = null,           
                                          onChange,               
                                          label = giveText(446),   
                                          placeholder = '',
                                          disabled = false,
                                          invalid = false,
                                          buttonId,
                                        }) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedEdition, setSelectedEdition] = useState(value ? value.name : value2);
  const observer = useRef();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['editions_list', searchValue],
    queryFn: ({ pageParam }) => fetchEditions({ pageParam, search: searchValue }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next_page || undefined,
    refetchOnWindowFocus: false,
  });

  const editions = data?.pages.flatMap(page => page.editions) || [];

  const lastElementRef = useCallback((node) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  const handleSelect = (edition) => {
    setSelectedEdition(edition.name);
    onChange?.(edition); 
  };

  const handleClear = () => {
    setSelectedEdition('');
    setSearchValue('');
    onChange?.(null);
  };

  const handleSearchChange = (e) => {
    controller.abort();
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && searchValue === '') {
      handleClear();
    }
  };

  return (
    // <Field.Root invalid={invalid}>  </Field.Root> 
    <FloatingLabelSearchSelectScrollPaginationInput
      label={label}
      placeholder={placeholder}
      inputWidth={'400px'}
      dir={'ltr'}
      usernameKey={"name"}
      value={selectedEdition}
      list={[
        // { id: '', name: giveDir() === 'rtl' ? 'بدون نوع محصول' : 'No Edition' },
        ...editions
      ]}
      lastElementUserRef={lastElementRef}
      loading={isFetching || isFetchingNextPage}
      hasInputLeftElement={true}
      hasInputRightElement={true}
      InputLeftElementIcon={<ChevronDownOutlineIcon width="1rem" />}
      onChange={handleSearchChange}
      // onKeyDown={handleKeyDown}
      onKeyDown={(event) => handleEnter(event, buttonId)}
      invalid={invalid}

      onClear={handleClear}
      onSelectMethod={handleSelect}
      disabled={disabled}
      
      
    />
  );
}