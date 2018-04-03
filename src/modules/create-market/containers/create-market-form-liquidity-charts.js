import { connect } from 'react-redux'

import MarketOutcomeCharts from 'modules/market/components/market-outcome-charts/market-outcome-charts'
import orderAndAssignCumulativeShares from 'modules/market/helpers/order-and-assign-cumulative-shares'
import orderForMarketDepth from 'modules/market/helpers/order-for-market-depth'
import getOrderBookKeys from 'modules/market/helpers/get-orderbook-keys'

import { isEmpty } from 'lodash'
import { formatEther, formatShares } from 'utils/format-number'

import { SCALAR } from 'modules/markets/constants/market-types'
import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'
import { BID, ASK } from 'modules/transactions/constants/types'

const mapStateToProps = (state, ownProps) => {
  const { newMarket } = state

  const selectedOutcome = ownProps.selectedOutcome.toString()
  const orderBook = formatOrderbook(newMarket.orderBook[selectedOutcome] || [])
  console.log('orderBook -- ', orderBook)
  const cumulativeOrderBook = orderAndAssignCumulativeShares(orderBook)
  const marketDepth = orderForMarketDepth(cumulativeOrderBook)
  const orderBookKeys = getOrderBookKeys(marketDepth)

  return {
    minPrice: newMarket.type === SCALAR ? newMarket.scalarSmallNum : 0,
    maxPrice: newMarket.type === SCALAR ? newMarket.scalarBigNum : 1,
    hasOrders: !isEmpty(cumulativeOrderBook[BIDS]) && !isEmpty(cumulativeOrderBook[ASKS]),
    orderBook: cumulativeOrderBook,
    orderBookKeys,
    marketDepth,
    selectedOutcome,
  }
}

export default connect(mapStateToProps)(MarketOutcomeCharts)

function formatOrderbook(rawOrderbook = []) {
  console.log('rawOrderbook -- ', rawOrderbook)
  return rawOrderbook.reduce((p, order) => ({
      ...p,
      [order.type === BID ? BIDS : ASKS]: [
        ...p[order.type === BID ? BIDS : ASKS],
        {
          price: formatEther(order.price.toNumber()),
          shares: formatShares(order.quantity.toNumber()),
        },
      ],
    }
  }), {
    [BIDS]: [],
    [ASKS]: [],
  })
}
