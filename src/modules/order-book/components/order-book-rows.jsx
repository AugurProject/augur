import React from 'react'

import OrderBookRowSide from 'modules/order-book/components/order-book-row-side'

import { BUY } from 'modules/transactions/constants/types'

const OrderBookRows = p => (
  <article className="order-book-rows">
    <OrderBookRowSide
      id={p.id}
      type={BUY}
      trade={p.trade}
      orders={p.bids}
      selectedShareDenomination={p.selectedShareDenomination}
      selectedTradeSide={p.selectedTradeSide}
      updateTradeFromSelectedOrder={p.updateTradeFromSelectedOrder}
    />
    <OrderBookRowSide
      id={p.id}
      trade={p.trade}
      orders={p.asks}
      selectedShareDenomination={p.selectedShareDenomination}
      selectedTradeSide={p.selectedTradeSide}
      updateTradeFromSelectedOrder={p.updateTradeFromSelectedOrder}
    />
  </article>
)

export default OrderBookRows
