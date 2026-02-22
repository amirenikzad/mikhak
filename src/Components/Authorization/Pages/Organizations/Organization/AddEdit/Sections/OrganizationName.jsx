import { giveText } from '../../../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { ChevronDownOutlineIcon } from '../../../../../../Base/CustomIcons/ChevronDownOutlineIcon.jsx';
import FloatingLabelSearchSelectScrollPaginationInput
  from '../../../../../../Base/CustomComponets/FloatingLabelSearchSelectScrollPaginationInput.jsx';
import { fetchWithAxios } from '../../../../../../Base/axios/FetchAxios.jsx';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.organizationForm?.name === nextProps.organizationForm?.name) {
    return true; // props are equal
  }
  return false; // props are not equal -> update the component
};

export const OrganizationName = memo(function OrganizationName({ organizationForm, setOrganizationForm, editing }) {
  const observerOrganizationName = useRef(null);
  const [organizationNameListValue, setOrganizationNameListValue] = useState([]);
  const controllerRef = useRef(null);
  const [page, setPage] = useState(1);

  const allOrganizationNamesListAxios = async ({ pageParam = 1 }) => {
    try {
      if (controllerRef.current && page === pageParam) {
        controllerRef.current.abort();
      }
      setPage(pageParam);

      const newController = new AbortController();
      controllerRef.current = newController;

      const response = await fetchWithAxios.post(`/qamus/entity/all`,
        {
          data: `page=${pageParam}&page_size=20&q=${organizationForm.name.value}&parent_classes%5B%5D=C0_7&parent_classes%5B%5D=C0_13&highlight=false`,
        }, {
          signal: newController.signal,
        },
      );

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
      response.data?.result?.map((value) => {
        result.push({ id: value.instance_id, label: value.main_fields[0].label });
      });

      return {
        organizationName: result,
        next_page: next_page,
      };
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') return;
      throw error;
    }
  };

  const {
    data: dataOrganizationNames,
    fetchNextPage: fetchNextPageOrganizationNames,
    hasNextPage: hasNextPageOrganizationNames,
    isLoading: isLoadingOrganizationNames,
    isFetchingNextPage: isFetchingOrganizationNames,
  } = useInfiniteQuery({
    queryKey: ['get_all_organization_names', organizationForm.name.value],
    queryFn: allOrganizationNamesListAxios,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.next_page,
  });

  const lastElementOrganizationNameRef = useCallback((node) => {
    if (isFetchingOrganizationNames) return;

    if (observerOrganizationName.current) observerOrganizationName.current.disconnect();

    observerOrganizationName.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPageOrganizationNames) {
        fetchNextPageOrganizationNames().then(() => null);
      }
    });

    if (node) observerOrganizationName.current.observe(node);
  }, [isFetchingOrganizationNames, hasNextPageOrganizationNames, fetchNextPageOrganizationNames]);

  useEffect(() => {
    if (dataOrganizationNames) {
      setOrganizationNameListValue(dataOrganizationNames?.pages.flatMap((page) => page?.organizationName));
    }
  }, [dataOrganizationNames]);

  useEffect(()=> {
    console.log("***",organizationNameListValue);
  }, [organizationNameListValue])

  return (
    <FloatingLabelSearchSelectScrollPaginationInput label={giveText(1)}
                                                    placeholder={''}
                                                    usernameKey={'label'}
                                                    dir={'auto'}
                                                    boxWidth={'600px'}
                                                    inputWidth={'600px'}
                                                    picKey={null}
                                                    list={organizationNameListValue}
                                                    lastElementUserRef={lastElementOrganizationNameRef}
                                                    isFetching={isFetchingOrganizationNames || isLoadingOrganizationNames}
                                                    hasInputLeftElement={true}
                                                    disabled={editing}
                                                    InputLeftElementIcon={(
                                                        <ChevronDownOutlineIcon width={'1rem'} />
                                                    )}
                                                    value={organizationForm?.name?.value}
                                                    onChange={(event) => {
                                                      setOrganizationForm(prevState => {
                                                        return {
                                                          ...prevState,
                                                          'name': {
                                                            value: event.target.value,
                                                            isInvalid: prevState['isInvalid'],
                                                          },
                                                          'organization_type': {
                                                            value: '',
                                                            isInvalid: prevState['isInvalid'],
                                                          },
                                                          'profiling_id': {
                                                            value: '',
                                                            isInvalid: prevState['isInvalid'],
                                                          },
                                                        };
                                                      });
                                                    }}
                                                    onSelectMethod={(value) => {
                                                      setOrganizationForm(prevState => {
                                                        return {
                                                          ...prevState,
                                                          'name': {
                                                            value: value.label,
                                                            isInvalid: prevState['isInvalid'],
                                                          },
                                                          'organization_type': {
                                                            value: '',
                                                            isInvalid: prevState['isInvalid'],
                                                          },
                                                          'profiling_id': {
                                                            value: value.id,
                                                            isInvalid: prevState['isInvalid'],
                                                          },
                                                        };
                                                      });
                                                    }}
                                                    onClear={() => {
                                                                  // setOrganizationForm('');
                                                                  // setSelectedOrganization({ [orgId]: '', [orgName]: '' });
                                                                  // deleteSelectedParams([orgName, orgId]);
                                                                  setOrganizationForm(prevState => {
                                                                        return {
                                                                          ...prevState,
                                                                          'name': {
                                                                            value: '',
                                                                            isInvalid: prevState['isInvalid'],
                                                                          },
                                                                          'organization_type': {
                                                                            value: '',
                                                                            isInvalid: prevState['isInvalid'],
                                                                          },
                                                                          'profiling_id': {
                                                                            value: '',
                                                                            isInvalid: prevState['isInvalid'],
                                                                          },
                                                                        };
                                                                      });
                                                                }}
                                                                 />
  );
}, arePropsEqual);
