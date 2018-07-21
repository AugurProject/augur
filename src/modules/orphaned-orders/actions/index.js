export const ADD_ORPHANED_ORDER = 'ADD_ORPHANED_ORDER'
export const REMOVE_ORPHANED_ORDER = 'REMOVE_ORPHANED_ORDER'

export const addOrphanedOrder = order => ({
  type: ADD_ORPHANED_ORDER,
  data: order,
})

export const removeOrphanedOrder = orderId => ({
  type: REMOVE_ORPHANED_ORDER,
  data: orderId,
})
