import { UPDATE_ALL_ORDERS_DATA, UPDATE_ORDER_CLEAR_ESCROWED } from 'modules/escape-hatch/actions/update-all-orders'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (allOrdersData = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_ALL_ORDERS_DATA: {
      return action.allOrdersData
    }
    case UPDATE_ORDER_CLEAR_ESCROWED: {
      return {
        ...allOrdersData,
        [action.orderId]: {
          ...allOrdersData[action.orderId],
          tokensEscrowed: '0',
          sharesEscrowed: '0',
        },
      }
    }
    case RESET_STATE:
    default:
      return allOrdersData
  }
}
