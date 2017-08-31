import React from 'react'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'
import MarketTradeCloseDialog from 'modules/market/components/market-trade-close-dialog'

import { SCALAR } from 'modules/markets/constants/market-types'
import { ORDER } from 'modules/market/constants/trade-close-type'

import getValue from 'utils/get-value'
import setShareDenomination from 'utils/set-share-denomination'

const MarketOpenOrdersRow = (p) => {
  const unmatchedShares = setShareDenomination(getValue(p, 'unmatchedShares.formatted'), p.selectedShareDenomination)

  return (
    <article className={`market-open-orders-row not-selectable ${p.isFirst ? 'isFirst' : ''}`} >
      {p.isFirst ?
        <span>
          {p.marketType === SCALAR ?
            <ValueDenomination formatted={p.lastPricePercent} /> :
            <span>{p.name}</span>
          }
        </span> :
        <span />
      }
      <span>{p.type}</span>
      <ValueDenomination formatted={unmatchedShares} />
      <ValueDenomination {...p.avgPrice} />
      <MarketTradeCloseDialog
        closeType={ORDER}
        marketID={p.marketID}
        orderID={p.id}
        status={p.status}
        orderType={p.type}
        cancelOrder={p.cancelOrder}
      />
    </article>
  )
}

export default MarketOpenOrdersRow
