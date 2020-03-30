import React from 'react';

import OpenOrder from 'modules/portfolio/containers/open-order';
import FilledOrder from 'modules/portfolio/containers/filled-order';

import Styles from 'modules/portfolio/components/common/order-market-row.styles.less';

import { Market, Order } from 'modules/portfolio/types';
import MarketTitle from 'modules/market/containers/market-title';

export interface OrderMarketRowProps {
  market: Market;
  filledOrders: boolean;
}

const OrderMarketRow = (props: OrderMarketRowProps) => {
  const { market, filledOrders } = props;

  let orders = [];
  if (!filledOrders) {
    orders = market.userOpenOrders;
  } else {
    orders = market.filledOrders;
  }

  return (
    <section className={Styles.OrderMarket}>
      <div>
        <MarketTitle id={market.marketId} />
      </div>
      <div>
        {orders.map((order: Order) =>
          filledOrders ? (
            <FilledOrder key={'sFilledOrder_' + order.id} filledOrder={order} />
          ) : (
            <OpenOrder key={'sOpenOrder_' + order.id} marketId={market.marketId} openOrder={order} />
          )
        )}
      </div>
    </section>
  );
};

export default OrderMarketRow;
