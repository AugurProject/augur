import React from 'react'

import OrderBookHeader from 'modules/order-book/components/order-book-header'
import OrderBookRows from 'modules/order-book/components/order-book-rows'

import getValue from 'utils/get-value'

const OrderBookTable = (p) => {
  const id = getValue(p, 'outcome.id')
  const trade = getValue(p, 'outcome.trade')
  const bids = getValue(p, 'outcome.orderBook.bids')
  const asks = getValue(p, 'outcome.orderBook.asks')

  return (
    <article className="order-book-table">
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
  )
}

export default OrderBookTable
