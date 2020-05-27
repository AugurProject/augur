import React, { useState } from 'react';

import FilterSwitchBox from 'modules/portfolio/components/common/filter-switch-box';
import OrderMarketRow from 'modules/portfolio/components/common/order-market-row';
import FilledOrder from 'modules/portfolio/containers/filled-order';

import FilledOrdersHeader from 'modules/portfolio/components/common/filled-orders-header';
import selectMarketsFilledOrders from 'modules/portfolio/selectors/select-markets-filled-orders';

const sortByOptions = [
  {
    label: 'Most Recently Traded Market',
    value: 'tradedMarket',
    comp: null,
  },
  {
    label: 'Most Recently Traded Outcome',
    value: 'tradedOutcome',
    comp: null,
  },
];

interface FilledOrdersProps {
  toggle: Function;
  extend: boolean;
  hide: boolean;
}

interface FilledOrdersState {
  viewByMarkets: boolean;
}

const FilledOrders = ({ toggle, extend, hide }: FilledOrdersProps) => {
  const [viewByMarkets, setViewByMarkets] = useState(true);
  const {
    markets,
    marketsObj,
    ordersObj,
    filledOrders,
  } = selectMarketsFilledOrders();

  function filterComp(input, data) {
    if (viewByMarkets) {
      return data.description.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    return (
      data.outcome &&
      data.outcome.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }

  function switchView() {
    setViewByMarkets(!viewByMarkets);
  }

  function renderRows(data) {
    const marketView = marketsObj[data.id] && viewByMarkets;
    const orderView = ordersObj[data.id];

    if (!marketView && !orderView) return null;
    return marketView ? (
      <OrderMarketRow
        key={'filledOrderMarket_' + data.id}
        market={marketsObj[data.id]}
        filledOrders
      />
    ) : (
      // @ts-ignore
      <FilledOrder
        key={'filledOrder_' + data.id}
        filledOrder={ordersObj[data.id]}
        isSingle
      />
    );
  }
  return (
    // @ts-ignore
    <FilterSwitchBox
      title="Filled Orders"
      filterLabel="filled orders"
      showFilterSearch
      sortByOptions={sortByOptions}
      sortByStyles={{ minWidth: '13.6875rem' }}
      data={viewByMarkets ? markets : filledOrders}
      filterComp={filterComp}
      switchView={switchView}
      bottomBarContent={<FilledOrdersHeader />}
      renderRows={renderRows}
      toggle={toggle}
      extend={extend}
      hide={hide}
    />
  );
};
export default FilledOrders;
