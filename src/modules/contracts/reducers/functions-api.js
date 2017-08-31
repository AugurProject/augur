import { UPDATE_FUNCTIONS_API, UPDATE_FROM_ADDRESS } from 'modules/contracts/actions/update-contract-api'

export default function (functionsAPI = {}, action) {
  switch (action.type) {
    case UPDATE_FUNCTIONS_API:
      return action.functionsAPI
    case UPDATE_FROM_ADDRESS:
      return Object.keys(functionsAPI).reduce((p, contractName) => {
        p[contractName] = Object.keys(functionsAPI[contractName]).reduce((q, functionName) => {
          q[functionName] = {
            ...functionsAPI[contractName][functionName],
            from: action.fromAddress
          }
          return q
        }, {})
        return p
      }, {})
    default:
      return functionsAPI
  }
}
