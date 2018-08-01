import { augur } from 'services/augurjs'
import logError from 'src/utils/log-error'
import { addNotification, updateNotification } from 'src/modules/notifications/actions'

export const ADD_ORPHANED_ORDER = 'ADD_ORPHANED_ORDER'
export const REMOVE_ORPHANED_ORDER = 'REMOVE_ORPHANED_ORDER'

export const DISMISS_ORPHANED_ORDER = 'DISMISS_ORPHANED_ORDER'


export const addOrphanedOrder = order => ({
  type: ADD_ORPHANED_ORDER,
  data: order,
})

export const removeOrphanedOrder = orderId => ({
  type: REMOVE_ORPHANED_ORDER,
  data: orderId,
})

export const dismissOrphanedOrder = ({ orderId }) => ({
  type: DISMISS_ORPHANED_ORDER,
  data: orderId,
})

export const cancelOrphanedOrder = ({ orderId, marketId, outcome, orderTypeLabel }, callback = logError) => (dispatch, getState) => {
  const {
    loginAccount,
  } = getState()

  augur.api.CancelOrder.cancelOrder({
    meta: loginAccount.meta,
    _orderId: orderId,
    onSent: (res) => {
      dispatch(addNotification({
        id: res.hash,
        title: 'Cancelling Orphaned Order',
        description: 'Cancelling Orphaned Order - Sent',
      }))
    },
    onSuccess: (res) => {
      dispatch(removeOrphanedOrder(orderId))
      dispatch(updateNotification({
        id: res.hash,
        title: 'Cancelling Orphaned Order - Completed',
        description: 'Cancelling Orphaned Order - Completed',
      }))
      callback(null)
    },
    onFailed: (err) => {
      dispatch(updateNotification({
        id: orderId,
        title: 'Cancelling Orphaned Order - Failed',
        description: 'Cancelling Orphaned Order - Failed',
      }))
      callback(err)
    },
  })
}
