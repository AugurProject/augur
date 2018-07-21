import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addCriticalNotification } from 'src/modules/notifications/actions'
import { ungroupBy } from 'src/utils/ungroupBy'
import { selectBlockchainCurrentBlockTimestamp } from 'src/select-state'

export const loadAccountOrphanedOrders = (options = {}, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount, ...state } = getState()


  augur.trading.getOrders({ ...options, orphaned: true, creator: loginAccount.address, universe: universe.id }, (err, orders) => {
    if (err) return callback(err)
    if (orders == null || Object.keys(orders).length === 0) return callback(null)

    const ungroupedOrders = ungroupBy(orders, ['marketIds', 'outcome', 'orderTypeLabel', 'orderId'])

    ungroupedOrders.forEach(() =>
      dispatch(addCriticalNotification({
        id: ungroupedOrders.orderId,
        title: `One of your orders is orphaned and unable to be taken. Please click the button to cancel it.`,
        timestamp: selectBlockchainCurrentBlockTimestamp(state),
        action: {
          text: 'SIGN TRANSACTION',
        },
      })))

    callback(null, orders)
  })
}
