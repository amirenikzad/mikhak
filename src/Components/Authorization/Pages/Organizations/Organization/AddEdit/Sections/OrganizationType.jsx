import { giveText } from '../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { ChevronDownOutlineIcon } from '../../../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { fetchWithAxios } from '../../../../../../Base/axios/FetchAxios.jsx';
import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toaster } from '../../../../../../ui/toaster.jsx';

const arePropsEqual = (prevProps, nextProps) => {
  if ((prevProps.organizationForm?.profiling_id === nextProps.organizationForm?.profiling_id)
    && (prevProps.organizationForm?.name === nextProps.organizationForm?.name)
    && (prevProps.organizationForm?.organization_type === nextProps.organizationForm?.organization_type)
    && (prevProps.editing === nextProps.editing)
  ) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

export const OrganizationType = memo(function OrganizationType({ editing, organizationForm, setOrganizationForm }) {
  const [organizationTypeListValue, setOrganizationTypeListValue] = useState([]);
  const observerOrganizationTypeName = useRef(null);
  const controllerRef = useRef(null);
  const [page, setPage] = useState(1);

  const allOrganizationTypeListAxios = async ({ pageParam = 1 }) => {
    if (editing || !organizationForm.name.value) {
      return {
        organizationType: [],
        next_page: null,
      };
    }

    try {
      if (controllerRef.current && page === pageParam) {
        controllerRef.current.abort();
      }
      setPage(pageParam);

      const newController = new AbortController();
      controllerRef.current = newController;

      const response = await fetchWithAxios.post(
        `/qamus/entity_org_type?type=${(!!organizationForm.profiling_id.value)}`,
        {
          data: organizationForm.profiling_id.value
            ? `${organizationForm.profiling_id.value}`
            : `page=${pageParam}&page_size=30&classes%5B%5D=C0_22_14`,
        },{
          signal: newController.signal,
        },
      );

      if (!response.data.result) {
        toaster.create({
          title: giveText(411),
          description: giveText(412),
          status: 'error',
          type: 'error',
          duration: 10000,
        });
      }

      let next_page = pageParam;
      if (response.data.result.length < 10) {
        next_page = null;
      } else {
        if (response.data.result.length > 0) {
          next_page = next_page + 1;
        } else {
          next_page = null;
        }
      }

      let result = [];
      if (organizationForm.profiling_id.value) {
        const result = response.data?.result;
        setOrganizationForm(prevState => {
          return {
            ...prevState,
            'organization_type': {
              value: result ? result?.[0]?._source.OP0_68_8[0].label : '',
              isInvalid: prevState['isInvalid'],
            },
          };
        });

        result?.map((value) => {
          result.push({ id: value.instance_id, label: value?._source?.OP0_68_8[0].label });
        });
      } else {
        response.data?.result?.map((value) => {
          result.push({ id: value.instance_id, label: value.main_fields[0].label });
        });
      }

      return {
        organizationType: result,
        next_page: next_page,
      };
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') return;
      throw error;
    }
  };

  const {
    data: dataOrganizationTypeNames,
    fetchNextPage: fetchNextPageOrganizationTypeNames,
    hasNextPage: hasNextPageOrganizationTypeNames,
    isLoading: isLoadingOrganizationTypeNames,
    isFetchingNextPage: isFetchingOrganizationTypeNames,
  } = useInfiniteQuery({
    queryKey: ['get_all_organization_type_names', organizationForm.profiling_id.value, organizationForm.name.value],
    queryFn: allOrganizationTypeListAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementOrganizationTypeNameRef = useCallback((node) => {
    if (isFetchingOrganizationTypeNames) return;

    if (observerOrganizationTypeName.current) observerOrganizationTypeName.current.disconnect();

    observerOrganizationTypeName.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPageOrganizationTypeNames) {
        fetchNextPageOrganizationTypeNames().then(() => null);
      }
    });

    if (node) observerOrganizationTypeName.current.observe(node);
  }, [isFetchingOrganizationTypeNames, hasNextPageOrganizationTypeNames, fetchNextPageOrganizationTypeNames]);

  useEffect(() => {
    if (dataOrganizationTypeNames) {
      setOrganizationTypeListValue(dataOrganizationTypeNames?.pages.flatMap((page) => page?.organizationType));
    }
  }, [dataOrganizationTypeNames]);

  return (
    <FloatingLabelSearchSelectScrollPaginationInput label={giveText(270)}
                                                    placeholder={''}
                                                    usernameKey={'label'}
                                                    dir={'auto'}
                                                    boxWidth={'600px'}
                                                    inputWidth={'600px'}
                                                    picKey={null}
                                                    disabled={editing ||
                                                          !organizationForm.name.value ||
                                                          (organizationForm.name.value && organizationForm.profiling_id.value) ||
                                                          (isFetchingOrganizationTypeNames || isLoadingOrganizationTypeNames)
                                                        }
                                                    list={organizationTypeListValue}
                                                    lastElementUserRef={lastElementOrganizationTypeNameRef}
                                                    isFetching={isFetchingOrganizationTypeNames || isLoadingOrganizationTypeNames}
                                                    hasInputLeftElement={true}
                                                    InputLeftElementIcon={(
                                                          <ChevronDownOutlineIcon width={'1rem'} />
                                                        )}
                                                    value={organizationForm.organization_type.value}
                                                    onChange={(event) => {
                                                          setOrganizationForm(prevState => {
                                                            return {
                                                              ...prevState,
                                                              'organization_type': {
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
                                                              'organization_type': {
                                                                value: value.label,
                                                                isInvalid: prevState['isInvalid'],
                                                              },
                                                            };
                                                          });
                                                        }} />
  );
}, arePropsEqual);
