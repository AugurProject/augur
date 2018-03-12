import { parallel } from 'async'
import { augur } from 'services/augurjs'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'
import { updateMarketsWithAccountReportData } from 'modules/my-reports/actions/update-markets-with-account-report-data'
import logError from 'utils/log-error'

export const loadMarketsToReportOn = (options, callback = logError) => (dispatch, getState) => {
  const { env, universe, loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  if (!loginAccount.rep || loginAccount.rep === '0') return callback(null)
  if (!universe.id) return callback(null)
  const query = { ...options, universe: universe.id, reporter: loginAccount.address }

  if (env['bug-bounty']) {
    query.creator = env['bug-bounty-address']
  }

  const designatedReportingQuery = { ...query, reportingState: 'DESIGNATED_REPORTING', designatedReporter: loginAccount.address }
  const openReportingQuery = { ...query, reportingState: 'OPEN_REPORTING' }
  const reportingQuery = { ...query, reportingState: 'CROWDSOURCING_DISPUTE' }

  parallel({
    designatedReporting: next => augur.markets.getMarkets(designatedReportingQuery, next),
    openReporting: next => augur.markets.getMarkets(openReportingQuery, next),
    reporting: next => augur.markets.getMarkets(reportingQuery, next),
  }, (err, marketsToReportOn) => { // marketsToReportOn: {designatedReporting: [marketIds], allReporting: [marketIds], limitedReporting: [marketIds]}
    if (err) return callback(err)
    // TODO we have market IDs *only*, so we need to check if the market's data is already loaded (and call loadMarketsData if not)
    dispatch(updateMarketsData(marketsToReportOn))
    dispatch(updateMarketsWithAccountReportData(marketsToReportOn))
    callback(null, marketsToReportOn)
  })
}
