import store from 'src/store'
import { cancelOrder } from 'modules/bids-asks/actions/cancel-order'

export default () => {
  const { orderCancellation } = store.getState()

  return {
    ...orderCancellation,
    cancelOrder: (orderId, marketId, type) => {
      store.dispatch(cancelOrder(orderId, marketId, type))
    },
  }
}
