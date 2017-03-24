import React from 'react';

import MarketOpenOrdersGroup from 'modules/market/components/market-open-orders-group';

import getValue from 'utils/get-value';

const Orders = p => (
  <article className="my-orders">
    {(p.outcomes || []).map((outcome, index) => {
      const lastPricePercent = getValue(outcome, 'lastPricePercent.rounded');

      console.log('### p -- ', p);

      return (
        <MarketOpenOrdersGroup
          key={outcome.name}
          id={outcome.id}
          name={outcome.name}
          marketType={p.marketType}
          lastPricePercent={lastPricePercent}
          userOpenOrders={outcome.userOpenOrders}
          orderCancellation={p.orderCancellation}
          selectedShareDenomination={p.selectedShareDenomination}
        />
      );
    })}
  </article>
);

export default Orders;
