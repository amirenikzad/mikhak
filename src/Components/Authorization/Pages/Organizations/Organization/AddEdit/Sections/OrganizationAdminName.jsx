import { giveText } from '../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { ChevronDownOutlineIcon } from '../../../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { fetchWithAxios } from '../../../../../../Base/axios/FetchAxios.jsx';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

const arePropsEqual = (prevProps, nextProps) => {
  if ((prevProps.organizationForm?.admin_name === nextProps.organizationForm?.admin_name)
    && (prevProps.organizationForm?.admin_id === nextProps.organizationForm?.admin_id)

  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

export const OrganizationAdminName = memo(function OrganizationAdminName({ organizationForm, setOrganizationForm, editing }) {
  const observerOrganizationAdminName = useRef(null);
  const [organizationAdminNameListValue, setOrganizationAdminNameListValue] = useState([]);
  const controllerRef = useRef(null);
  const [page, setPage] = useState(1);

  const allOrganizationAdminNamesListAxios = async ({ pageParam = 1 }) => {
    try {
      if (controllerRef.current && page === pageParam) {
        controllerRef.current.abort();
      }
      setPage(pageParam);

      const newController = new AbortController();
      controllerRef.current = newController;

      const response = await fetchWithAxios.get(`/user/all?page=${pageParam}&page_size=20&search=${organizationForm?.admin_name?.value}`,
        {
            signal: newController.signal,
        }
      );

      return {
        organizationAdminName: response.data.users,
        next_page: response.data.next_page,
      };
    } catch (error) {
      if (error.admin_name === 'CanceledError' || error.admin_name === 'AbortError') return;
      throw error;
    }
  };

  const {
    data: dataOrganizationAdminNames,
    fetchNextPage: fetchNextPageOrganizationAdminNames,
    hasNextPage: hasNextPageOrganizationAdminNames,
    isLoading: isLoadingOrganizationAdminNames,
    isFetchingNextPage: isFetchingOrganizationAdminNames,
  } = useInfiniteQuery({
    queryKey: ['get_all_organization_admin_names', organizationForm.admin_name.value],
    queryFn: allOrganizationAdminNamesListAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementOrganizationAdminNameRef = useCallback((node) => {
    if (isFetchingOrganizationAdminNames) return;

    if (observerOrganizationAdminName.current) observerOrganizationAdminName.current.disconnect();

    observerOrganizationAdminName.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPageOrganizationAdminNames) {
        fetchNextPageOrganizationAdminNames().then(() => null);
      }
    });

    if (node) observerOrganizationAdminName.current.observe(node);
  }, [isFetchingOrganizationAdminNames, hasNextPageOrganizationAdminNames, fetchNextPageOrganizationAdminNames]);

  useEffect(() => {
    if (dataOrganizationAdminNames) {
      setOrganizationAdminNameListValue(dataOrganizationAdminNames?.pages.flatMap((page) => page?.organizationAdminName));
    }
  }, [dataOrganizationAdminNames]);

  return (
    <FloatingLabelSearchSelectScrollPaginationInput label={giveText(415)}
                                                    placeholder={''}
                                                    usernameKey={'username'}
                                                    // dir={'auto'}
                                                    boxWidth={'600px'}
                                                    inputWidth={'600px'}
                                                    picKey={'profile_pic'}
                                                    list={organizationAdminNameListValue}
                                                    lastElementUserRef={lastElementOrganizationAdminNameRef}
                                                    isFetching={isFetchingOrganizationAdminNames || isLoadingOrganizationAdminNames}
                                                    hasInputLeftElement={true}
                                                    the_icon={organizationForm.admin_profile_pic.value}
                                                    InputLeftElementIcon={(
                                                        <ChevronDownOutlineIcon width={'1rem'} />
                                                    )}
                                                    value={organizationForm.admin_name.value}
                                                    onChange={(event) => {
                                                        setOrganizationForm(prevState => {
                                                            return {
                                                                ...prevState,
                                                                'admin_name': {
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
                                                                'admin_name': {
                                                                    value: value.username,
                                                                    isInvalid: prevState['isInvalid'],
                                                                },
                                                                'admin_id': {
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
                                                                'admin_name': {
                                                                    value: '',
                                                                    isInvalid: prevState['isInvalid'],
                                                                },
                                                                'admin_id': {
                                                                    value: '',
                                                                    isInvalid: prevState['isInvalid'],
                                                                },
                                                            };
                                                        });
                                                    }}
                                                    />
  );
}, arePropsEqual);
