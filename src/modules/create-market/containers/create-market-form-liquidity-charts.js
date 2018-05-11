import { connect } from 'react-redux'

import { createBigNumber } from 'utils/create-big-number'
import { selectCurrentTimestamp, selectCurrentTimestampInSeconds } from 'src/select-state'
import MarketOutcomeCharts from 'modules/market/components/market-outcome-charts/market-outcome-charts'
import orderAndAssignCumulativeShares from 'modules/market/helpers/order-and-assign-cumulative-shares'
import orderForMarketDepth from 'modules/market/helpers/order-for-market-depth'
import getOrderBookKeys from 'modules/market/helpers/get-orderbook-keys'

import { formatEther, formatShares } from 'utils/format-number'

import { SCALAR } from 'modules/markets/constants/market-types'
import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'
import { BID } from 'modules/transactions/constants/types'

const mapStateToProps = (state, ownProps) => {
  const { newMarket } = state

  const selectedOutcome = ownProps.selectedOutcome.toString()
  const orderBook = formatOrderbook(newMarket.orderBook[selectedOutcome] || [])
  const cumulativeOrderBook = orderAndAssignCumulativeShares(orderBook)
  const marketDepth = orderForMarketDepth(cumulativeOrderBook)
  const orderBookKeys = getOrderBookKeys(
    marketDepth,
    newMarket.type === SCALAR ? createBigNumber(newMarket.scalarSmallNum) : createBigNumber(0),
    newMarket.type === SCALAR ? createBigNumber(newMarket.scalarBigNum) : createBigNumber(1),
  )
  const hasOrders = !!cumulativeOrderBook[BIDS].length || !!cumulativeOrderBook[ASKS].length

  return {
    isMobile: state.isMobile,
    currentBlock: state.blockchain.currentBlockNumber || 0,
    currentTimestamp: selectCurrentTimestamp(state),
    currentTimeInSeconds: selectCurrentTimestampInSeconds(state),
    fixedPrecision: 4,
    minPrice: newMarket.type === SCALAR ? createBigNumber(newMarket.scalarSmallNum) : createBigNumber(0),
    maxPrice: newMarket.type === SCALAR ? createBigNumber(newMarket.scalarBigNum) : createBigNumber(1),
    orderBook: cumulativeOrderBook,
    priceTimeSeries: [],
    orderBookKeys,
    marketDepth,
    selectedOutcome: {
      id: selectedOutcome,
    },
    hasOrders,
  }
}

export default connect(mapStateToProps)(MarketOutcomeCharts)

function formatOrderbook(rawOrderbook = []) {
  return rawOrderbook.reduce((p, order) => ({
    ...p,
    [order.type === BID ? BIDS : ASKS]: [
      ...p[order.type === BID ? BIDS : ASKS],
      {
        price: formatEther(order.price.toNumber()),
        shares: formatShares(order.quantity.toNumber()),
      },
    ],
  }), {
    [BIDS]: [],
    [ASKS]: [],
  })
}
