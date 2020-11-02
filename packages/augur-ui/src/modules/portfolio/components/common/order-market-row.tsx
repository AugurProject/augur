import React from 'react';

import { OpenOrder } from 'modules/common/table-rows';
import { FilledOrder } from "modules/common/table-rows";

import Styles from 'modules/portfolio/components/common/order-market-row.styles.less';
import { UIOrder } from 'modules/types';
import { Market } from 'modules/portfolio/types';
import MarketTitle from 'modules/market/components/common/market-title';

export interface OrderMarketRowProps {
  market: Market;
  filledOrders: boolean;
}

const OrderMarketRow = ({ market, filledOrders }: OrderMarketRowProps) => {

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
        {orders.map((order: UIOrder) =>
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
