import { augur } from 'services/augurjs'
import { updateLoginAccount } from 'modules/auth/actions/update-login-account'
import logError from 'utils/log-error'

export const updateTopBarPL = (options = {}, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  if (loginAccount.address == null || universe.id == null) return callback(null)
  augur.augurNode.submitRequest(
    'getProfitLoss',
    {
      universe: universe.id,
      account: loginAccount.address,
      startTime: (Math.round((new Date()).getTime() / 1000) - 2592000),
      endTime: Math.round((new Date()).getTime() / 1000),
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
      startTime: (Math.round((new Date()).getTime() / 1000) - 86400),
      endTime: Math.round((new Date()).getTime() / 1000),
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
