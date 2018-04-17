import { UPDATE_BLOCKCHAIN } from 'modules/app/actions/update-blockchain'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (blockchain = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_BLOCKCHAIN:
      return {
        ...blockchain,
        ...action.data,
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return blockchain
  }
}
