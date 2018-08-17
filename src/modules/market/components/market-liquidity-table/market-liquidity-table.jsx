import React from 'react'
import classNames from 'classnames'
import { SCALAR, YES_NO } from 'modules/markets/constants/market-types'
import { formatEther, formatShares } from 'utils/format-number'
import { BID, ASK } from 'modules/transactions/constants/types'

import Styles from 'modules/market/components/market-liquidity-table/market-liquidity-table.styles'

const MarketLiquidityTable = (p) => {
  const { marketType, outcomeOrders, removeOrderFromNewMarket, selectedOutcome } = p
  return (
    <div className={Styles['MarketLiquidityTable__table-body']}>
      { outcomeOrders.map((order, index) => {
        if (order.onSent && order.txhash) return undefined
        let outcomeLabel = marketType === YES_NO ? 'Yes' : selectedOutcome
        const direction = order.type === BID ? '' : '-'
        const quantity = formatShares(order.quantity)
        const price = formatEther(order.price)
        const estimate = formatEther(order.orderEstimate)
        outcomeLabel = marketType === SCALAR ? price.formattedValue : outcomeLabel

        return (
          <ul
            key={`${selectedOutcome}-${order.type}-${price.formatted}`}
            className={classNames(Styles.MarketLiquidityTable__Order, {
              [`${Styles.positive}`]: order.type === BID,
              [`${Styles.negative}`]: order.type === ASK,
            })}
          >
            <li>{order.type}</li>
            <li>{outcomeLabel}</li>
            <li>{`${direction}${quantity.formatted}`}<span>{`${quantity.denomination}`}</span></li>
            <li>{price.formatted}<span>{`${price.denomination}`}</span></li>
            <li>{estimate.formatted}<span>{`${estimate.denomination}`}</span></li>
            <li>
              <button
                className={Styles.MarketLiquidityTable__cancel}
                disabled={(order.onSent || !!order.txhash)}
                onClick={e => removeOrderFromNewMarket({
                  outcome: selectedOutcome,
                  index,
                  orderId: order.index,
                })}
              >Cancel
              </button>
            </li>
          </ul>
        )
      })
      }
    </div>
  )
}

export default MarketLiquidityTable
