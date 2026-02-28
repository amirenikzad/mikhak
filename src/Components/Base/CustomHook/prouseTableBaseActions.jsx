import { useCallback, useEffect, useMemo, useRef } from 'react';
import { fetchWithAxios } from '../axios/FetchAxios.jsx';
import {
  showToast,
  promiseToast,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../BaseFunction.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { giveText } from '../MultiLanguages/HandleLanguage.jsx';
import { setIsDeleting } from '../../../store/features/isLoadingSlice.jsx';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import qs from 'qs';

export const prouseTableBaseActions = ({
                                      onCloseEscape,
                                      onShiftN,
                                      onShiftA,
                                      getAllURL,
                                      responseKey,
                                      useQueryDependsUpdate,
                                      headCellsValues = [],
                                      checkAccess,
                                      update,
                                      hasAccessToRemove,
                                      removeURL,
                                      removeId = 'id',
                                      removeIdRequest = 'id',
                                      hasSearch = true,
                                      searchValue,
                                      reactQueryItemName = 'get_all_list',
                                      loadWhenIsTrue = true,
                                      queryParameter = '',
                                      reverseScroll = false,
                                      requestEveryMinute = null,
                                      chatContainerRef,
                                      pageSize = 20,
                                      additionalParams = {},
                                    }) => {
  const accessSlice = useSelector(state => state.accessSlice);
  const dispatch = useDispatch();
  const observer = useRef(null);
  const controller = new AbortController();

  const stableSort = useCallback((array, comparator) => {
    if (!array && array.length < 1) return [];

    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }, []);

  function descendingComparator(a, b, orderBy) {
    if (b?.[orderBy] < a?.[orderBy]) {
      return -1;
    }
    if (b?.[orderBy] > a?.[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function getComparatorByValue(order, orderBy) {
    return order === 'desc'
      ? (a, b) => (b[orderBy]?.value < a[orderBy]?.value ? -1 : 1)
      : (a, b) => (a[orderBy]?.value < b[orderBy]?.value ? -1 : 1);
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseEscape();
      }
      if (event.altKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        onShiftN && onShiftN();
      }
      if (event.altKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        onShiftA && onShiftA();
      }
    };

    document.body.addEventListener('keydown', handleKeyDown);
    return () => document.body.removeEventListener('keydown', handleKeyDown);
  }, [onCloseEscape, onShiftN, onShiftA]);

  const headCells = useMemo(() => {
    let value = [...headCellsValues];

    if (checkAccess) {
      value.push({ id: 'config', label: giveText(4) });
    }

    return value;
  }, [checkAccess, headCellsValues]);

  const additionalQueryString = useMemo(() => {
    if (!additionalParams || Object.keys(additionalParams).length === 0) return '';

    const query = qs.stringify(additionalParams, { skipNulls: true });
    return query ? `&${query}` : '';
    }, [additionalParams]);


  // const allTableListAxios = async ({ pageParam = 1 }) => {
  //   if (loadWhenIsTrue) {
  //     try {
  //       const response = await fetchWithAxios.get(
  //       //   `${getAllURL}?page=${pageParam}&page_size=${pageSize}${hasSearch ? `&search=${searchValue}` : ''}${queryParameter}`,
  //       `${getAllURL}?page=${pageParam}&page_size=${pageSize}${
  //           hasSearch ? `&search=${searchValue}` : ''
  //           }${queryParameter}${additionalQueryString}`,
  //         {
  //           signal: controller.signal,
  //         }
  //       );

  //       return {
  //         [responseKey]: response.data[responseKey],
  //         next_page: response.data.next_page,
  //         total_count: response.data.total_count,
  //       };
  //     } catch (error) {
  //       throw error;
  //     }
  //   } else {
  //     return [];
  //   }
  // };

  const allTableListAxios = async () => {
    if (!loadWhenIsTrue) return { [responseKey]: [], total_count: 0 };

    const page = additionalParams?.page ?? 1;
    const size = additionalParams?.page_size ?? pageSize;

    // بقیه پارامترها (غیر از page/page_size) توی additionalParams می‌مونه
    const { page: _p, page_size: _ps, ...rest } = additionalParams || {};

    const extraQuery = qs.stringify(rest, { skipNulls: true });
    const extraQueryString = extraQuery ? `&${extraQuery}` : '';

    const response = await fetchWithAxios.get(
      `${getAllURL}?page=${page}&page_size=${size}${hasSearch ? `&search=${searchValue}` : ''}${queryParameter}${extraQueryString}`,
      { signal: controller.signal }
    );

    return {
      [responseKey]: response.data[responseKey],
      total_count: response.data.total_count,
    };
  };

  // const queryDeps = useMemo(() => {
  //   return [loadWhenIsTrue, useQueryDependsUpdate, searchValue, queryParameter, additionalParams];
  //   }, [useQueryDependsUpdate, searchValue, queryParameter, loadWhenIsTrue, additionalParams]);



  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isLoading,
  //   isFetchingNextPage: isFetching,
  //   isRefetching,
  //   isError: error,
  // } = useInfiniteQuery({
  //   // queryKey: [reactQueryItemName, ...queryDeps],
  //   queryKey: [reactQueryItemName, ...queryDeps, additionalParams],
  //   queryFn: allTableListAxios,
  //   initialPageParam: 1,
  //   getNextPageParam: (lastPage) => lastPage?.next_page,
  //   refetchInterval: requestEveryMinute ? requestEveryMinute * 60 * 1000 : false,
  // });
  const queryDeps = useMemo(() => {
    return [loadWhenIsTrue, useQueryDependsUpdate, searchValue, queryParameter, additionalParams];
  }, [useQueryDependsUpdate, searchValue, queryParameter, loadWhenIsTrue, additionalParams]);

  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isLoading,
  //   isFetchingNextPage: isFetching,
  //   isRefetching,
  //   isError: error,
  // } = useInfiniteQuery({
  //   queryKey: [reactQueryItemName, ...queryDeps],
  //   queryFn: async ({ pageParam = 1 }) => {
  //     // allTableListAxios باید pageParam بگیره
  //     const size = additionalParams?.page_size ?? pageSize;

  //     const { page: _p, page_size: _ps, ...rest } = additionalParams || {};
  //     const extraQuery = qs.stringify(rest, { skipNulls: true });
  //     const extraQueryString = extraQuery ? `&${extraQuery}` : '';

  //     const response = await fetchWithAxios.get(
  //       `${getAllURL}?page=${pageParam}&page_size=${size}${hasSearch ? `&search=${searchValue}` : ''}${queryParameter}${extraQueryString}`,
  //       { signal: controller.signal }
  //     );

  //     return {
  //       [responseKey]: response.data[responseKey],
  //       next_page: response.data.next_page,
  //       total_count: response.data.total_count,
  //     };
  //   },
  //   initialPageParam: 1,
  //   getNextPageParam: (lastPage) => lastPage?.next_page,
  //   refetchInterval: requestEveryMinute ? requestEveryMinute * 60 * 1000 : false,
  //   enabled: loadWhenIsTrue,
  // });

  const page = additionalParams?.page ?? 1;
const size = additionalParams?.page_size ?? pageSize;

const { page: _p, page_size: _ps, ...rest } = additionalParams || {};
const extraQuery = qs.stringify(rest, { skipNulls: true });
const extraQueryString = extraQuery ? `&${extraQuery}` : '';

const {
  data,
  isLoading,
  isFetching,
  isRefetching,
  isError: error,
} = useQuery({
  queryKey: [reactQueryItemName, loadWhenIsTrue, useQueryDependsUpdate, searchValue, queryParameter, page, size, extraQueryString],
  queryFn: async () => {
    const response = await fetchWithAxios.get(
      `${getAllURL}?page=${page}&page_size=${size}${hasSearch ? `&search=${searchValue}` : ''}${queryParameter}${extraQueryString}`,
      { signal: controller.signal }
    );

    return {
      [responseKey]: response.data[responseKey],
      total_count: response.data.total_count,
    };
  },
  enabled: loadWhenIsTrue,
  // keepPreviousData: true,
  placeholderData: keepPreviousData,
  refetchInterval: requestEveryMinute ? requestEveryMinute * 60 * 1000 : false,
});

  // const totalCount = data?.pages?.[0]?.total_count ?? null;
  const totalCount = data?.total_count ?? null;

  const handleScroll = () => {
    if (!reverseScroll) return;

    const container = chatContainerRef.current;
    if (!container) return;

    if (container.scrollTop === 0 && hasNextPage) {
      fetchNextPage().then(() => null);
    }
  };

  // useEffect(() => {
  //   if (reverseScroll && chatContainerRef && chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  //   }
  // }, [data?.pages[0]]);

  // const lastElementRef = useCallback((node) => {
  //   if (!node || isLoading) return;

  //   if (!observer.current) {
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasNextPage && !isFetching && !isRefetching) {
  //         fetchNextPage().then(() => null);
  //       }
  //     }, {
  //       rootMargin: '200px', // Optional: start loading a bit before it hits top
  //     });
  //   }

  //   observer.current.observe(node);
  // }, [fetchNextPage, hasNextPage, isFetching, isLoading, isRefetching]);

  // const listValue = useMemo(() => data?.pages.flatMap((page) => page?.[responseKey]) || [], [data?.pages, responseKey]);
  const listValue = useMemo(() => data?.[responseKey] || [], [data, responseKey]);

  const removeAxios = (props) => {
    if (hasAccessToRemove && (!accessSlice.isAdmin && !accessSlice.userAccess?.includes(`${removeURL}_delete`))) {
      showToast({
        title: giveText(30),
        description: giveText(97),
        status: 2,
      });
    } else {
      const toastId = promiseToast();
      dispatch(setIsDeleting(true));

      fetchWithAxios.delete(removeURL, {
          params: {
            [removeIdRequest]: (typeof props.data[removeId] === 'number' ? [props.data[removeId]] : [...props.data[removeId]]),
          },
          paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
        },
      ).then((response) => {
        update();
        updatePromiseToastSuccessWarningInfo({ toastId, response });
      }).catch((error) => {
        updatePromiseToastError({ toastId, error });
      }).finally(() => {
        props.onClose && props.onClose();
        dispatch(setIsDeleting(false));
      });
    }
  };

  return {
    listValue,
    totalCount,
    stableSort,
    getComparator,
    getComparatorByValue,
    isFetching: isFetching || isRefetching,
    error,
    headCells,
    removeAxios,
    // lastElementRef,
    handleScroll,
    controller,

    // fetchNextPage,
    // hasNextPage,
    // isLoading,
    fetchNextPage: undefined,
    hasNextPage: false,
    lastElementRef: undefined,
  };
};