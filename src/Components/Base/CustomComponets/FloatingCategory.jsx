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

const fetchCategorys = async ({ pageParam = 1, search = '' }) => {
  const response = await fetchWithAxios.get(
    `/category/all?page=${pageParam}&page_size=20&search=${search}`,
    { signal: controller.signal }
  );
  return {
    categories: response.data.categories || response.data.items || [],
    next_page: response.data.next_page,
  };
};

export default function FloatingCategory({
                                          value = null,
                                          value2 = null,           
                                          onChange,               
                                          label = giveText(455),   
                                          placeholder = '',
                                          disabled = false,
                                          invalid = false,
                                          buttonId,
                                        }) {
  const [searchValue, setSearchValue] = useState('');
  // console.log('value',value);
  // console.log('value2',value2);
  const [selectedCategory, setSelectedCategory] = useState(value ? value.category_name : value2);
  const observer = useRef();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['categories_list', searchValue],
    queryFn: ({ pageParam }) => fetchCategorys({ pageParam, search: searchValue }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next_page || undefined,
    refetchOnWindowFocus: false,
  });

  const categories = data?.pages.flatMap(page => page.categories) || [];

  useEffect(() => {
    if (value?.category_name) {
      setSelectedCategory(value.category_name);
    } else if (value2) {
      setSelectedCategory(value2);
    } else {
      setSelectedCategory('');
    }
  }, []);


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

  const handleSelect = (category) => {
    setSelectedCategory(category.category_name);
    onChange?.(category); 
  };

  const handleClear = () => {
    setSelectedCategory('');
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
    // <div style={{ marginTop: '30px' }}>
    <FloatingLabelSearchSelectScrollPaginationInput
      label={label}
      placeholder={placeholder}
      inputWidth={'400px'}
      dir={'ltr'}
      usernameKey={"category_name"}
      value={selectedCategory}
      list={[
        // { id: '', name: giveDir() === 'rtl' ? 'بدون نوع محصول' : 'No Category' },
        ...categories
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
    // </div>
  );
}