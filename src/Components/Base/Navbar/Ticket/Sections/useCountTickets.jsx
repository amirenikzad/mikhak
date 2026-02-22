import { GET_TICKET_COUNT } from '../../../UserAccessNames.jsx';
import { fetchWithAxios } from '../../../axios/FetchAxios.jsx';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';

export const useCountTickets = ({
                                  reload,
                                  refetchInterval = 1 * 60 * 1000,
                                  getNew = true,
                                  getAll = true,
                                  getAllClosed = true,
                                  getMy = true,
                                  getMyAllClosed = true,
                                }) => {
  const accessSlice = useSelector(state => state.accessSlice);

  const ticketCountAxios = useCallback(async ({ status, agent }) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_TICKET_COUNT)) {
      const response = await fetchWithAxios.get(`/ticket/count?status=${status}${agent ? `&agent=${agent}` : ''}`);
      return response.data.result;
    } else {
      return null;
    }
  }, []);

  const {
    data: newTicketsCount,
    isFetching: isFetchingNewTicketsCount,
  } = useQuery({
    queryKey: ['newTicketsCount', accessSlice, reload, getNew],
    queryFn: () => getNew && ticketCountAxios({ status: 0, agent: undefined }),
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  const {
    data: allTicketsCount,
    isFetching: isFetchingAllTicketsCount,
  } = useQuery({
    queryKey: ['allTicketsCount', accessSlice, reload, getAll],
    queryFn: () => getAll && ticketCountAxios({ status: 1, agent: undefined }),
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  const {
    data: myTicketsCount,
    isFetching: isFetchingMyTicketsCount,
  } = useQuery({
    queryKey: ['myTicketsCount', accessSlice, reload, getMy],
    queryFn: () => getMy && ticketCountAxios({ status: 1, agent: 'true' }),
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  const {
    data: allClosedTicketsCount,
    isFetching: isFetchingAllClosedTicketsCount,
  } = useQuery({
    queryKey: ['allClosedTicketsCount', accessSlice, reload, getAllClosed],
    queryFn: () => getAllClosed && ticketCountAxios({ status: 2, agent: undefined }),
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  const {
    data: myClosedTicketsCount,
    isFetching: isFetchingMyClosedTicketsCount,
  } = useQuery({
    queryKey: ['myClosedTicketsCount', accessSlice, reload, getMyAllClosed],
    queryFn: () => getMyAllClosed && ticketCountAxios({ status: 2, agent: 'true' }),
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval,
  });

  return {
    newTicketsCount,
    allTicketsCount,
    myTicketsCount,
    allClosedTicketsCount,
    myClosedTicketsCount,
    isFetchingMyClosedTicketsCount,
    isFetchingAllTicketsCount,
    isFetchingNewTicketsCount,
    isFetchingAllClosedTicketsCount,
    isFetchingMyTicketsCount,
  };
};
