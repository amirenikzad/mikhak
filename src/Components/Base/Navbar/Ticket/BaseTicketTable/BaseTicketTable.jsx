import { BaseTablePage } from '../../../../Authorization/Pages/BaseTablePage.jsx';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  promiseToast,
  updatePromiseToastError,
  updatePromiseToastSuccessWarningInfo,
} from '../../../BaseFunction.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useTableBaseActions } from '../../../CustomHook/useTableBaseActions.jsx';
import { giveText } from '../../../MultiLanguages/HandleLanguage.jsx';
import { DialogBody, DialogContent, DialogRoot } from '../../../../ui/dialog.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { fetchWithAxios } from '../../../axios/FetchAxios.jsx';
import { GET_TICKET_CHAT, GET_TICKET_CLOSE } from '../../../UserAccessNames.jsx';
import { setReloadAgainCounts } from '../../../../../store/features/ticketSlice.jsx';
import TicketTableRow from './TicketTableRow.jsx';

const TicketChat = lazy(() => import('../TicketChat.jsx'));

export default function BaseTicketTable({
                                          searchValue,
                                          queryParameter,
                                          chatable = true,
                                          showClosedTime = true,
                                          closeable = true,
                                          setController,
                                        }) {
  const accessSlice = useSelector(state => state.accessSlice);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selectedTicket, setSelectedTicket] = useState();
  const queryClient = useQueryClient();
  const [isOpenChat, setIsOpenChat] = useState(false);
  const reactQueryItemName = useMemo(() => 'all_ticket_list_react_query', []);
  const [isExpand, setIsExpand] = useState(false);
  const dispatch = useDispatch();
  const [closingTicket, setClosingTicket] = useState(false);

  const updated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [reactQueryItemName] }).then(() => null);
  }, [queryClient, reactQueryItemName]);

  const closeTicketAxios = (id) => {
    if (accessSlice.isAdmin || accessSlice.userAccess?.includes(GET_TICKET_CLOSE)) {
      const toastId = promiseToast();
      setClosingTicket(true);

      fetchWithAxios.get(`/ticket/close?id=${id}`)
        .then((response) => {
          setIsOpenChat(false);
          updated();
          updatePromiseToastSuccessWarningInfo({ toastId, response });

        })
        .catch((error) => {
          dispatch(setReloadAgainCounts());
          updatePromiseToastError({ toastId, error });
        })
        .finally(() => {
          setClosingTicket(false);
        });
    }
  };

  const headCellsValues = useMemo(() => {
    let headCellsArray = [
      { id: 'subject', label: giveText(336) },
      { id: 'user', label: giveText(0) },
      { id: 'service', label: giveText(225) },
      { id: 'category', label: giveText(220) },
      { id: 'status', label: giveText(202) },
      { id: 'created time', label: giveText(337) },
    ];

    if (showClosedTime) {
      headCellsArray.push({ id: 'closed time', label: giveText(338) });
    }

    return headCellsArray;
  }, []);

  const checkAccessTable = useMemo(() => accessSlice.isAdmin || (accessSlice.userAccess?.includes(GET_TICKET_CLOSE) && closeable) || accessSlice.userAccess?.includes(GET_TICKET_CHAT), [accessSlice]);

  const {
    listValue: ticketList,
    getComparator,
    isFetching,
    stableSort,
    headCells,
    lastElementRef,
    controller,
  } = useTableBaseActions({
    getAllURL: '/ticket/all',
    queryParameter: queryParameter,
    checkAccess: checkAccessTable,
    hasAccessToRemove: false,
    headCellsValues: headCellsValues,
    responseKey: 'result',
    requestEveryMinute: 1,
    searchValue: searchValue,
    reactQueryItemName: reactQueryItemName,
  });

  useEffect(() => {
    setController(controller);
  }, [controller]);

  const sortedListValue = useMemo(() => {
    return stableSort(ticketList, getComparator(order, orderBy));
  }, [order, orderBy, stableSort, ticketList]);

  const clickOnTicketChat = useCallback((ticket) => {
    setSelectedTicket(ticket);
    console.log('selectedTicket',selectedTicket);
    setIsOpenChat(true);
  }, []);

  const onOpenChat = useCallback((e) => {
    if (!e.open) {
      updated();
      dispatch(setReloadAgainCounts());
    }
    setIsOpenChat(e.open);
  }, []);

  return <>
    <BaseTablePage isLoadingListAllUsers={isFetching}
                   px={0}
                   mt={0}
                   mb={0}
                   heightResponsive={['47dvh', '57dvh', '60dvh', '69dvh', '71dvh', '75dvh', '80dvh']}
                   headCells={headCells}
                   order={order}
                   orderBy={orderBy}
                   setOrderBy={setOrderBy}
                   setOrder={setOrder}
                   lastElementRef={lastElementRef}
                   onChangeCheckboxAll={() => onChangeCheckboxAll(sortedListValue)}
                   body={sortedListValue?.map((row) => (
                     <TicketTableRow key={row?.id}
                                     row={row}
                                     showClosedTime={showClosedTime}
                                     clickOnTicketChat={clickOnTicketChat}
                                     closeable={closeable}
                                     closeTicketAxios={closeTicketAxios} />
                   ))}
                    />

    <DialogRoot lazyMount placement={'center'} open={isOpenChat} onOpenChange={onOpenChat}>
      <DialogContent transition={'all 0.2s ease'} maxW={isExpand ? '100dvw' : '80rem'}>
        <DialogBody transition={'all 0.2s ease'} minH={isExpand ? '100dvh' : '600px'}>
          <Suspense fallback={'loading...'}>
            <TicketChat selectedTicket={selectedTicket}
                        chatable={chatable}
                        isExpand={isExpand}
                        setIsExpand={setIsExpand}
                        closeTicketAxios={closeTicketAxios}
                        closingTicket={closingTicket}
                        onClose={() => {
                          setIsOpenChat(false);
                          dispatch(setReloadAgainCounts());
                        }} />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  </>;
};
