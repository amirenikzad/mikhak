import { giveText } from '../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { fetchWithAxios } from '../../../../../../Base/axios/FetchAxios.jsx';
import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { ChevronDownOutlineIcon } from '../../../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';

const arePropsEqual = (prevProps, nextProps) => {
  if ((prevProps.organizationForm?.parent_name === nextProps.organizationForm?.parent_name)
    && (prevProps.organizationForm?.parent_id === nextProps.organizationForm?.parent_id)
    && (prevProps.organizationForm?.name === nextProps.organizationForm?.name)
    // && (prevProps.organizationForm?.admin_id === nextProps.organizationForm?.admin_id)
    // && (prevProps.organizationForm?.admin_id === nextProps.organizationForm?.admin_id)
    && (prevProps.baseOrganizationList === nextProps.baseOrganizationList)
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

export const OrganizationParentName = memo(function OrganizationParentName({ organizationForm, setOrganizationForm, baseOrganizationList = [] }) {
  const [organizationListValue, setOrganizationListValue] = useState([]);
  const observer = useRef(null);
  const controllerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [canLoadMorePages, setCanLoadMorePages] = useState(false);

  const filteredBaseOrganizationList = useMemo(() => {
    return baseOrganizationList.filter(org => org?.name !== organizationForm.name.value);
  }, [baseOrganizationList, organizationForm.name.value]);

  const allOrganizationListAxios = async ({ pageParam = 1 }) => {
    try {
      if (controllerRef.current && page === pageParam) {
        controllerRef.current.abort();
      }
      setPage(pageParam);

      const newController = new AbortController();
      controllerRef.current = newController;

      const response = await fetchWithAxios.get(
        // `/organization/all?page=${pageParam}&page_size=20&search=${organizationForm.parent_name.value ? organizationForm.parent_name.value : ''}`,
        `/organization/all?page=${pageParam}&page_size=20&search=${organizationForm.parent_name.value ? organizationForm.parent_name.value : ''}`,
        {
          signal: newController.signal,
        },
      );

      return {
        organizations: response.data.organizations.filter(org => org.name !== organizationForm.name.value),
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
    isLoading,
    isFetchingNextPage: isFetching,
  } = useInfiniteQuery({
    queryKey: ['get_all_organization_add_edit', organizationForm.parent_name.value],
    queryFn: allOrganizationListAxios,
    initialPageParam: 1,
    enabled: canLoadMorePages,
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
    if (!canLoadMorePages) {
      setOrganizationListValue(filteredBaseOrganizationList);
      return;
    }

    if (data) {
      setOrganizationListValue(data?.pages.flatMap((page) => page?.organizations));
    }
  }, [data, canLoadMorePages, filteredBaseOrganizationList]);

  return (
    <FloatingLabelSearchSelectScrollPaginationInput label={giveText(301)}
                                                    placeholder={''}
                                                    usernameKey={'name'}
                                                    dir={'auto'}
                                                    boxWidth={'600px'}
                                                    inputWidth={'600px'}
                                                    picKey={null}
                                                    list={organizationListValue}
                                                    lastElementUserRef={lastElementRef}
                                                    loading={isLoading}
                                                    hasInputLeftElement={true}
                                                    InputLeftElementIcon={(
                                                          <ChevronDownOutlineIcon width={'1rem'} />
                                                        )}
                                                    value={organizationForm.parent_name.value}
                                                    disabled={!organizationForm.name.value}
                                                    onChange={(event) => {
                                                          if (event.target.value === '') {
                                                            setCanLoadMorePages(true);
                                                          }
                                                          setOrganizationForm(prevState => {
                                                            return {
                                                              ...prevState,
                                                              'parent_name': {
                                                                value: event.target.value,
                                                                isInvalid: prevState['isInvalid'],
                                                              },
                                                            };
                                                          });
                                                        }}
                                                    onSelectMethod={(value) => {
                                                          setCanLoadMorePages(false);
                                                          setOrganizationForm(prevState => {
                                                            return {
                                                              ...prevState,
                                                              'parent_id': {
                                                                value: value.id,
                                                                isInvalid: prevState['isInvalid'],
                                                              },
                                                              'parent_name': {
                                                                value: value.name,
                                                                isInvalid: prevState['isInvalid'],
                                                              },
                                                              // 'admin_id': {
                                                              //   value: value.id,
                                                              //   isInvalid: prevState['isInvalid'],
                                                              // },
                                                            };
                                                          });
                                                        }} />
  );
}, arePropsEqual);
