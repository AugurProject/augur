import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
// import moment from 'moment'
// getProfitLoss(universe, accountAddress, startTime, endTime, periodInterval)
export default function getProfitLoss(universe, startTime, endTime, periodInterval, callback = logError) {
  return (dispatch, getState) => {
    const {
      loginAccount,
    } = getState()
    console.log(JSON.stringify({
      universe,
      address: loginAccount.address,
      startTime,
      endTime,
      periodInterval,
    }, 2))
    augur.augurNode.submitRequest(
      'getProfitLoss',
      {
        universe,
        address: loginAccount.address,
        startTime,
        endTime,
        periodInterval,
      }, callback,
    )
  }
}
