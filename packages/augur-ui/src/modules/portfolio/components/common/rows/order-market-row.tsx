import React from "react";

import OpenOrder from "modules/portfolio/containers/open-order";
import FilledOrder from "modules/portfolio/containers/filled-order";
import MarketLink from "modules/market/components/market-link/market-link";

import Styles from "modules/portfolio/components/common/rows/order-market-row.styles.less";

import { Market, Order } from "modules/portfolio/types";

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
    <div className={Styles.OrderMarket}>
      <div className={Styles.OrderMarket__description}>
        <MarketLink id={market.id}>{market.description}</MarketLink>
      </div>
      <div>
        {orders.map((order: Order) =>
          filledOrders ? (
            <FilledOrder key={"sFilledOrder_" + order.id} filledOrder={order} />
          ) : (
            <OpenOrder key={"sOpenOrder_" + order.id} openOrder={order} />
          )
        )}
      </div>
    </div>
  );
};

export default OrderMarketRow;
