import { augur } from 'services/augurjs'
import { updateLoginAccount } from 'modules/auth/actions/update-login-account'
import logError from 'utils/log-error'

export const updateTopBarPL = (options = {}, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount, blockchain } = getState()
  if (loginAccount.address == null || universe.id == null) return callback(null)
  // make sure we have a timestamp
  const endTime = (blockchain.currentAugurTimestamp || Math.round((new Date()).getTime() / 1000))
  augur.augurNode.submitRequest(
    'getProfitLoss',
    {
      universe: universe.id,
      account: loginAccount.address,
      startTime: (endTime - 2592000),
      endTime,
      periodInterval: null,
    },
    (err, rawPerformanceData) => {
      if (rawPerformanceData && rawPerformanceData.aggregate && rawPerformanceData.aggregate.length && rawPerformanceData.aggregate[rawPerformanceData.aggregate.length - 1].profitLoss) {
        const totalPLMonth = rawPerformanceData.aggregate[rawPerformanceData.aggregate.length - 1].profitLoss.total
        dispatch(updateLoginAccount({ totalPLMonth }))
      }
    },
  )
  augur.augurNode.submitRequest(
    'getProfitLoss',
    {
      universe: universe.id,
      account: loginAccount.address,
      startTime: (endTime - 86400),
      endTime,
      periodInterval: null,
    },
    (err, rawPerformanceData) => {
      if (rawPerformanceData && rawPerformanceData.aggregate && rawPerformanceData.aggregate.length && rawPerformanceData.aggregate[rawPerformanceData.aggregate.length - 1].profitLoss) {
        const totalPLDay = rawPerformanceData.aggregate[rawPerformanceData.aggregate.length - 1].profitLoss.total
        dispatch(updateLoginAccount({ totalPLDay }))
      }
    },
  )
}
