import async from 'async'
import { augur } from 'services/augurjs'
import { loadReport } from 'modules/reports/actions/load-report'
import { loadReportDescriptors } from 'modules/reports/actions/load-report-descriptors'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { updateEventMarketsMap } from 'modules/markets/actions/update-markets-data'
import { selectMarketIDFromEventID } from 'modules/market/selectors/market'

export function loadReports(cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.error('loadReports:', e))
    const { loginAccount, branch, reports } = getState()
    if (!loginAccount || !loginAccount.address || !branch.id || !branch.reportPeriod) {
      return
    }
    const period = branch.reportPeriod
    const account = loginAccount.address
    const branchID = branch.id
    const branchReports = reports[branchID]
    augur.api.ReportingThreshold.getEventsToReportOn({
      branch: branchID,
      period,
      sender: account,
      start: 0
    }, (eventsToReportOn) => {
      console.log('eventsToReportOn:', eventsToReportOn)
      async.eachSeries(eventsToReportOn, (eventID, nextEvent) => {
        if (!eventID || !parseInt(eventID, 16)) return nextEvent()
        if (branchReports && branchReports[eventID] && branchReports[eventID].reportedOutcomeID) {
          console.log('report already loaded:', eventID, branchReports[eventID])
          return nextEvent()
        }
        const marketID = selectMarketIDFromEventID(eventID)
        if (marketID) {
          return dispatch(loadReport(branchID, period, eventID, marketID, nextEvent))
        }
        augur.api.Events.getMarkets({ event: eventID }, (markets) => {
          dispatch(updateEventMarketsMap(eventID, markets))
          const marketID = markets[0]
          dispatch(loadMarketsInfo([marketID], () => {
            dispatch(loadReport(branchID, period, eventID, marketID, nextEvent))
          }))
        })
      }, (err) => {
        if (err) return callback(err)
        dispatch(loadReportDescriptors(e => callback(e)))
      })
    })
  }
}
