import React, { useState } from 'react';
import { OpenOrder } from 'modules/common/table-rows';
import OpenOrdersHeader from 'modules/portfolio/components/common/open-orders-header';
import OrderMarketRow from 'modules/portfolio/components/common/order-market-row';
import { UIOrder } from 'modules/types';
import selectMarketsOpenOrders from 'modules/portfolio/selectors/select-markets-open-orders';
import { CancelTextButton } from 'modules/common/buttons';
import Styles from 'modules/market/components/market-orders-positions-table/open-orders-table.styles.less';
import NewFilterSwitchBox from 'modules/portfolio/components/common/new-filter-switch-box';
import { cancelAllOpenOrders } from 'modules/orders/actions/cancel-order';

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

interface OpenOrdersProps {
  toggle?: () => void;
  extend?: boolean;
  hide?: boolean;
  cancelAllOpenOrders: (orders: UIOrder[]) => void;
}

interface OpenOrdersState {
  viewByMarkets: boolean;
}

const OpenOrders = ({
  toggle, extend, hide,
}: OpenOrdersProps) => {

  const [viewByMarkets, setViewByMarkets] = useState(true);

  const {
    markets,
    marketsObj,
    ordersObj,
    openOrders
  } = selectMarketsOpenOrders();

  function filterComp(input, data) {
    return data.description.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
        key={'openOrderMarket_' + data.id}
        market={marketsObj[data.id]}
      />
    ) : (
      <OpenOrder
        key={'openOrder_' + data.id}
        marketId={data.id}
        openOrder={ordersObj[data.id]}
        isSingle
      />
    );
  }

  const hasPending = Boolean(openOrders.find(order => order.pending));
  return (
    <NewFilterSwitchBox
      title="Open Orders"
      filterLabel="open orders"
      sortByOptions={sortByOptions}
      data={viewByMarkets ? markets : openOrders}
      filterComp={filterComp}
      switchView={switchView}
      subheader={<OpenOrdersHeader />}
      renderRows={renderRows}
      footer={
        openOrders.length > 0 ? (
          <div className={Styles.PortfolioFooter}>
            <CancelTextButton
              action={() => cancelAllOpenOrders(openOrders)}
              text="Cancel All"
              disabled={hasPending}
            />
          </div>
        ) : null
      }
    />
  );
};

export default OpenOrders;
