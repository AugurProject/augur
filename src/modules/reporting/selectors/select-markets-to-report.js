import { createSelector } from 'reselect'
import { selectMarketReportState } from 'src/select-state'
import { selectMarket } from 'src/modules/market/selectors/market'

function filterForkedMarket(market) {
	return !(state.universe.isForkingMarketFinalized && state.universe.isForking && state.universe.forkingMarket === market.id)
}

export const selectMarketsToReport = createSelector(
  selectMarketReportState,
  reportData => ({
    designated: reportData.designated.map(selectMarket).sort((a, b) => a.endTime.timestamp - b.endTime.timestamp),
    open: reportData.open.map(selectMarket).sort((a, b) => a.endTime.timestamp - b.endTime.timestamp),
    upcoming: reportData.upcoming.map(selectMarket).sort((a, b) => a.endTime.timestamp - b.endTime.timestamp),
    resolved: reportData.resolved.map(selectMarket).filter(filterForkedMarket).sort((a, b) => a.endTime.timestamp - b.endTime.timestamp),
  }),
)
