import store from 'src/store'
import { cancelOrder } from 'modules/bids-asks/actions/cancel-order'

export default () => {
  const { orderCancellation } = store.getState()

  return {
    ...orderCancellation,
    cancelOrder: (orderID, marketID, type) => {
      store.dispatch(cancelOrder(orderID, marketID, type))
    }
  }
}
