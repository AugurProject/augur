import memoize from 'memoizee'
import { createBigNumber } from 'utils/create-big-number'
import { ZERO } from 'modules/trade/constants/numbers'
import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'
import { formatEther } from 'utils/format-number'

function calculateMySize(openOrders, loginAccount, price) {
  if (openOrders) {
    const accountOrdersInPrice = (Object.keys(openOrders) || []).filter(key => openOrders[key].owner === loginAccount && openOrders[key].fullPrecisionPrice === price.fullPrecision)
    let total = createBigNumber(0)
    for (let i = 0; i < accountOrdersInPrice.length; i++) {
      if (openOrders[accountOrdersInPrice]) {
        total = total.plus(openOrders[accountOrdersInPrice].fullPrecisionAmount)
      }
    }
    return total.eq(ZERO) ? null : formatEther(total)
  }
  return null
}

const orderAndAssignCumulativeShares = memoize((orderBook, userOpenOrders, loginAccount) => {
  const rawBids = ((orderBook || {})[BIDS] || []).slice()
  const bids = rawBids
    .sort((a, b) => b.price.value - a.price.value)
    .reduce((p, order, i, orders) => [
      ...p,
      {
        price: order.price,
        shares: order.shares,
        cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares.plus(order.shares.fullPrecision) : createBigNumber(order.shares.fullPrecision),
        mySize: userOpenOrders ? calculateMySize(userOpenOrders.buy, loginAccount, order.price) : order.shares, // use shares for creating market
      },
    ], [])

  const rawAsks = ((orderBook || {})[ASKS] || []).slice()
  const asks = rawAsks
    .sort((a, b) => a.price.value - b.price.value)
    .reduce((p, order, i, orders) => [
      ...p,
      {
        price: order.price,
        shares: order.shares,
        cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares.plus(order.shares.fullPrecision) : createBigNumber(order.shares.fullPrecision),
        mySize: userOpenOrders ? calculateMySize(userOpenOrders.sell, loginAccount, order.price) : order.shares, // use shares for creating market
      },
    ], [])
    .sort((a, b) => b.price.value - a.price.value)

  return {
    bids,
    asks,
  }
})

export default orderAndAssignCumulativeShares
