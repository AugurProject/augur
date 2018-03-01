import { createSelector } from 'reselect'
import { selectMarketReportState } from 'src/select-state'
import { selectMarket } from 'src/modules/market/selectors/market'

export const selectMarketsToReport = createSelector(
  selectMarketReportState,
  reportData => ({
    designated: reportData.designated.map(selectMarket),
    open: reportData.open.map(selectMarket),
    upcoming: reportData.upcoming.map(selectMarket),
  }),
)
