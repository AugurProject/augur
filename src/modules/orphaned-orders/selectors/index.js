import { createSelector } from 'reselect'
import { selectOrphanOrders } from 'src/select-state'

export const selectUndissmissedOrphanedOrders = createSelector(
  selectOrphanOrders,
  orders => orders.filter(it => !it.dismissed),
)
