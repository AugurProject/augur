import { UPDATE_CONTRACT_ADDRESSES } from 'modules/contracts/actions/update-contract-addresses'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (contractAddresses = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_CONTRACT_ADDRESSES:
      return {
        ...contractAddresses,
        ...action.contractAddresses,
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return contractAddresses
  }
}
