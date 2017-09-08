import { selectMarketFromEventID } from 'modules/market/selectors/market'

import makePath from 'modules/routes/helpers/make-path'
import makeQuery from 'modules/routes/helpers/make-query'

import { MARKETS, MARKET } from 'modules/routes/constants/views'
import { MARKET_DESCRIPTION_PARAM_NAME, MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names'

export function nextReportPage(history) {
  return (dispatch, getState) => {
    const { branch, reports } = getState()
    const branchReports = reports[branch.id]
    if (!branchReports) return history.push(makePath(MARKETS))
    const nextPendingReportEventID = Reflect.ownKeys(branchReports).find(
      eventID => !branchReports[eventID].reportHash
    )
    if (!nextPendingReportEventID) return history.push(makePath(MARKETS))
    const nextPendingReportMarket = selectMarketFromEventID(nextPendingReportEventID)
    if (!nextPendingReportMarket || !nextPendingReportMarket.id) return history.push(makePath(MARKETS))

    // Go To Next Report
    history.push({
      pathname: makePath(MARKET),
      search: makeQuery({
        [MARKET_DESCRIPTION_PARAM_NAME]: nextPendingReportMarket.formattedDescription,
        [MARKET_ID_PARAM_NAME]: nextPendingReportMarket.id
      })
    })
  }
}
