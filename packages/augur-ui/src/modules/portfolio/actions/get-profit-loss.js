import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export default function getProfitLoss(universe, startTime, endTime, periodInterval = null, callback = logError) {
  // NOTE: PL data isn't going to be saved to the application state
  // only the performanceGraph Component. Always pass a callback or you won't
  // have access to the data.
  return (dispatch, getState) => {
    const {
      loginAccount,
    } = getState()
    augur.augurNode.submitRequest(
      'getProfitLoss',
      {
        universe,
        account: loginAccount.address,
        startTime,
        endTime,
        periodInterval,
      }, callback,
    )
  }
}
