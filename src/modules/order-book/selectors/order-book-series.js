import BigNumber from 'bignumber.js'
import memoize from 'memoizee'

export default function (orderBook) {
  return getOrderBookSeries(orderBook)
}

const getOrderBookSeries = memoize((orderBook) => {
  const orderBookSeries = Object.keys(orderBook).reduce((p, type) => {
    if (p[type] == null) p[type] = []

    let totalQuantity = new BigNumber(0)

    orderBook[type].forEach((order) => {
      const matchedPriceIndex = p[type].findIndex(existing => existing[0] === order.price.value)

      totalQuantity = totalQuantity.plus(new BigNumber(order.shares.value.toString()))

      if (matchedPriceIndex > -1) {
        p[type][matchedPriceIndex][1] = totalQuantity.toNumber()
      } else {
        p[type].push([order.price.value, totalQuantity.toNumber()])
      }
    })

    p[type].sort((a, b) => a[0] - b[0])

    return p
  }, {})

  return orderBookSeries
}, { max: 1 })
