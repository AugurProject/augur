import React from 'react'
import classNames from 'classnames'
// import ReactTooltip from 'react-tooltip'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'

import getValue from 'utils/get-value'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { PRICE, SHARE } from 'modules/order-book/constants/order-book-value-types'

const OrderBookRowSide = (p) => {
  const orders = getValue(p, 'orders')
  const nullMessage = 'No Orders'
  const side = p.type || SELL
  const shouldHighlight = (side === BUY && p.selectedTradeSide[p.id] === SELL) || (side !== BUY && p.selectedTradeSide[p.id] === BUY) || (side !== BUY && p.selectedTradeSide[p.id] == null)

  return (
    <article className={`order-book-row-side ${shouldHighlight ? 'order-book-row-side-trading' : ''}`}>
      {!orders || !orders.length ?
        <NullStateMessage message={nullMessage} /> :
        <div>
          {(p.orders || []).map((order, i) => {
            const shares = getValue(order, 'shares.formatted')
            const price = getValue(order, 'price.formatted')
            const type = p.type || SELL

            return (
              <div
                key={`order-${Math.random()}`}
                className={classNames('order-book-side-row not-selectable', { 'is-of-current-user': order.isOfCurrentUser })}
                data-tip
                data-for={`${type}-${i}-orders`}
                data-event="mouseenter"
                data-event-off="mouseleave"
              >
                <button
                  className="unstyled"
                  onClick={() => {
                    p.updateTradeFromSelectedOrder(p.id, i, side, side === BUY ? SHARE : PRICE)
                  }}
                >
                  <ValueDenomination formatted={side === BUY ? shares : price} />
                </button>
                <button
                  className="unstyled"
                  onClick={() => {
                    p.updateTradeFromSelectedOrder(p.id, i, side, side === BUY ? PRICE : SHARE)
                  }}
                >
                  <ValueDenomination formatted={side === BUY ? price : shares} />
                </button>
              </div>
            )
          })}
        </div>
      }
    </article>
  )
}

export default OrderBookRowSide

// {order.isOfCurrentUser &&
// <ReactTooltip
//   id={`${type}-${i}-orders`}
//   type="info"
//   effect="solid"
//   place="top"
// >
//   <span className="tooltip-text">
//     Your Order
//   </span>
// </ReactTooltip>
// }
