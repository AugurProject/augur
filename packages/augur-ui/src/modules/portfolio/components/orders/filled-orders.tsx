import React, { useState } from 'react';

import FilterSwitchBox from 'modules/portfolio/components/common/filter-switch-box';
import OrderMarketRow from 'modules/portfolio/components/common/order-market-row';
import { FilledOrder } from "modules/common/table-rows";

import FilledOrdersHeader from 'modules/portfolio/components/common/filled-orders-header';
import selectMarketsFilledOrders from 'modules/portfolio/selectors/select-markets-filled-orders';
import FilterBox from 'modules/portfolio/components/common/filter-box';

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
      sortByOptions={sortByOptions}
      data={viewByMarkets ? markets : filledOrders}
      filterComp={filterComp}
      switchView={switchView}
      showDropdown
      subheader={<FilledOrdersHeader />}
      renderRows={renderRows}
      toggle={toggle}
      hide={hide}
      extend={extend}
    />
  );
};
export default FilledOrders;
