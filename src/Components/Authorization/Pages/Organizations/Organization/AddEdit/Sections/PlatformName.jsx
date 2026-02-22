import { giveText } from '../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { ChevronDownOutlineIcon } from '../../../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { fetchWithAxios } from '../../../../../../Base/axios/FetchAxios.jsx';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

const arePropsEqual = (prevProps, nextProps) => {
  if ((prevProps.organizationForm?.platform_name === nextProps.organizationForm?.platform_name)
    && (prevProps.organizationForm?.platform_id === nextProps.organizationForm?.platform_id)

  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

export const PlatformName = memo(function PlatformName({ organizationForm, setOrganizationForm, editing }) {
  const observerPlatformName = useRef(null);
  const [organizationAdminNameListValue, setPlatformNameListValue] = useState([]);
  const controllerRef = useRef(null);
  const [page, setPage] = useState(1);

  const allPlatformNamesListAxios = async ({ pageParam = 1 }) => {
    try {
      if (controllerRef.current && page === pageParam) {
        controllerRef.current.abort();
      }
      setPage(pageParam);

      const newController = new AbortController();
      controllerRef.current = newController;

      const response = await fetchWithAxios.get(`/platform/all?page=${pageParam}&page_size=20&search=${organizationForm?.platform_name?.value}`,
        {
            signal: newController.signal,
        }
      );

      return {
        organizationAdminName: response.data.platforms,
        next_page: response.data.next_page,
      };
    } catch (error) {
      if (error.platform_name === 'CanceledError' || error.platform_name === 'AbortError') return;
      throw error;
    }
  };

  const {
    data: dataPlatformNames,
    fetchNextPage: fetchNextPagePlatformNames,
    hasNextPage: hasNextPagePlatformNames,
    isLoading: isLoadingPlatformNames,
    isFetchingNextPage: isFetchingPlatformNames,
  } = useInfiniteQuery({
    queryKey: ['get_all_organization_platform_names', organizationForm.platform_name.value],
    queryFn: allPlatformNamesListAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementPlatformNameRef = useCallback((node) => {
    if (isFetchingPlatformNames) return;

    if (observerPlatformName.current) observerPlatformName.current.disconnect();

    observerPlatformName.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPagePlatformNames) {
        fetchNextPagePlatformNames().then(() => null);
      }
    });

    if (node) observerPlatformName.current.observe(node);
  }, [isFetchingPlatformNames, hasNextPagePlatformNames, fetchNextPagePlatformNames]);

  useEffect(() => {
    if (dataPlatformNames) {
      setPlatformNameListValue(dataPlatformNames?.pages.flatMap((page) => page?.organizationAdminName));
    }
  }, [dataPlatformNames]);

  return (
    <FloatingLabelSearchSelectScrollPaginationInput label={giveText(431)}
                                                    placeholder={''}
                                                    usernameKey={'platform_name'}
                                                    // dir={'auto'}
                                                    boxWidth={'600px'}
                                                    inputWidth={'600px'}
                                                    picKey={null} 
                                                    list={organizationAdminNameListValue}
                                                    lastElementUserRef={lastElementPlatformNameRef}
                                                    isFetching={isFetchingPlatformNames || isLoadingPlatformNames}
                                                    hasInputLeftElement={true}
                                                    // the_icon={organizationForm.platform_profile_pic.value}
                                                    InputLeftElementIcon={(
                                                        <ChevronDownOutlineIcon width={'1rem'} />
                                                    )}
                                                    value={organizationForm.platform_name.value}
                                                    onChange={(event) => {
                                                        setOrganizationForm(prevState => {
                                                            return {
                                                                ...prevState,
                                                                'platform_name': {
                                                                    value: event.target.value,
                                                                    isInvalid: prevState['isInvalid'],
                                                                },
                                                            };
                                                        });
                                                    }}
                                                    onSelectMethod={(value) => {
                                                        setOrganizationForm(prevState => {
                                                            return {
                                                                ...prevState,
                                                                'platform_name': {
                                                                    value: value.platform_name,
                                                                    isInvalid: prevState['isInvalid'],
                                                                },
                                                                'platform_id': {
                                                                    value: value.id,
                                                                    isInvalid: prevState['isInvalid'],
                                                                },
                                                            };
                                                        });
                                                    }} 
                                                    onClear={() => {
                                                      setOrganizationForm(prevState => {
                                                            return {
                                                                ...prevState,
                                                                'platform_name': {
                                                                    value: '',
                                                                    isInvalid: prevState['isInvalid'],
                                                                },
                                                                'platform_id': {
                                                                    value: '',
                                                                    isInvalid: prevState['isInvalid'],
                                                                },
                                                            };
                                                        });
                                                    }}
                                                    />
  );
}, arePropsEqual);
