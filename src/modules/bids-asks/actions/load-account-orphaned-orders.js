import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { ungroupBy } from 'src/utils/ungroupBy'
import { addOrphanedOrder } from 'src/modules/orphaned-orders/actions'
import { OPEN } from 'src/modules/order-book/constants/order-book-order-types'

export const loadAccountOrphanedOrders = (options = {}, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()

  augur.trading.getOrders({ ...options, orphaned: true, creator: loginAccount.address, universe: universe.id }, (err, orders) => {
    if (err) return callback(err)
    if (orders == null || Object.keys(orders).length === 0) return callback(null)

    ungroupBy(orders, ['marketId', 'outcome', 'orderTypeLabel', 'orderId'])
      .filter(it => it.orderState === OPEN)
      .forEach(it => dispatch(addOrphanedOrder(it)))

    callback(null, orders)
  })
}
