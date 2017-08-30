import { UPDATE_CONTRACT_ADDRESSES } from 'modules/contracts/actions/update-contract-addresses'

export default function (contractAddresses = {}, action) {
  switch (action.type) {
    case UPDATE_CONTRACT_ADDRESSES:
      return {
        ...contractAddresses,
        ...action.contractAddresses
      }
    default:
      return contractAddresses
  }
}
