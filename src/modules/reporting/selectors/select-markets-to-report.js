import { createSelector } from 'reselect'
import { selectMarketReportState } from 'src/select-state'
import { selectMarket } from 'src/modules/market/selectors/market'

export const selectMarketsToReport = createSelector(
  selectMarketReportState,
  reportData => ({
    designated: reportData.designated.map(selectMarket).sort((a, b) => a.endTime.timestamp - b.endTime.timestamp),
    open: reportData.open.map(selectMarket).sort((a, b) => a.endTime.timestamp - b.endTime.timestamp),
    upcoming: reportData.upcoming.map(selectMarket).sort((a, b) => a.endTime.timestamp - b.endTime.timestamp),
    resolved: reportData.resolved.map(selectMarket).sort((a, b) => a.endTime.timestamp - b.endTime.timestamp),
  }),
)
