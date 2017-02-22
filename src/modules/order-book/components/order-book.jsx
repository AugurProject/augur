import React from 'react';

import OrderBookHeader from 'modules/order-book/components/order-book-header';
import OrderBookRows from 'modules/order-book/components/order-book-rows';
import EmDash from 'modules/common/components/em-dash';

import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

// NOTE --
// Bids + Asks are rendered into individual row components -- flexbox is utilized for side-by-side layout
const OrderBook = (p) => {
  const name = getValue(p, 'outcome.name');
  const id = getValue(p, 'outcome.id');
  const trade = getValue(p, 'outcome.trade');
  const bids = getValue(p, 'outcome.orderBook.bids');
  const asks = getValue(p, 'outcome.orderBook.asks');

  return (
    <article className="order-book">
      {p.marketType !== SCALAR ?
        <h3>Order Book <EmDash /> {name && name}</h3> :
        <h3>Order Book</h3>
      }
      <OrderBookHeader />
      <div className="market-content-scrollable" >
        <OrderBookRows
          id={id}
          trade={trade}
          bids={bids}
          asks={asks}
          selectedTradeSide={p.selectedTradeSide}
          updateTradeFromSelectedOrder={p.updateTradeFromSelectedOrder}
          selectedShareDenomination={p.selectedShareDenomination}
        />
      </div>
    </article>
  );
};

export default OrderBook;
