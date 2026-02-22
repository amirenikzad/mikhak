import { memo } from 'react';
import { giveText } from '../../../../Base/MultiLanguages/HandleLanguage.jsx';
import { BaseDoughnutChart } from './Base/BaseDoughnutChart.jsx';
import { useCountTickets } from '../../../../Base/Navbar/Ticket/Sections/useCountTickets.jsx';

export const TicketPieChart = memo(function TicketPieChart() {
  const {
    newTicketsCount,
    allTicketsCount,
    allClosedTicketsCount,
    isFetchingAllTicketsCount,
    isFetchingAllClosedTicketsCount,
    isFetchingNewTicketsCount,
  } = useCountTickets({
    refetchInterval: 5 * 60 * 1000,
    getNew: true,
    getAll: true,
    getAllClosed: true,
    getMy: false,
    getMyAllClosed: false,
  });

  return <>
    <BaseDoughnutChart labelsValues={[giveText(353), giveText(358), giveText(332)]}
                       dataValues={[newTicketsCount, allTicketsCount, allClosedTicketsCount]}
                       count={allTicketsCount + allClosedTicketsCount + newTicketsCount}
                       total={null}
                       isFetching={isFetchingAllTicketsCount || isFetchingAllClosedTicketsCount || isFetchingNewTicketsCount}
                       bgColors={['green', 'blue', 'gray']}
                       title={giveText(330)} />
  </>;
});
