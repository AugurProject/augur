import { ADD_ORPHANED_ORDER, REMOVE_ORPHANED_ORDER } from 'src/modules/orphaned-orders/actions'
import { RESET_STATE } from "src/modules/app/actions/reset-state";

const DEFAULT_STATE = []

export default function (state = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case (ADD_ORPHANED_ORDER):
      if (state.findIndex(it => it.orderId === data.orderId) !== -1) return state
      return [
        ...state,
        data,
      ]
    case (REMOVE_ORPHANED_ORDER):
      return state.filter(it => it.orderId !== data)

    case (RESET_STATE):
      return DEFAULT_STATE

    default:
      return state
  }
}
