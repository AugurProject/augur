import { createSelector } from 'reselect';
import store from 'src/store';
import { selectPaginationSelectedPageNum, selectPaginationNumPerPage } from 'src/select-state';
import { selectUnpaginatedMarkets } from 'modules/markets/selectors/markets-unpaginated';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { MY_POSITIONS } from 'modules/app/constants/views';
import { PENDING_REPORTS } from 'modules/markets/constants/markets-subset';

export default function () {
  const { activeView, selectedMarketsHeader } = store.getState();
  let markets;
  if (activeView !== MY_POSITIONS && selectedMarketsHeader !== PENDING_REPORTS) {
    markets = selectPaginated(store.getState());
  } else {
    markets = selectUnpaginatedMarkets(store.getState());
  }
  const marketIDsMissingInfo = markets
    .filter(market => !market.isLoadedMarketInfo && !market.isLoading)
    .map(market => market.id);
  if (marketIDsMissingInfo.length) {
    store.dispatch(loadMarketsInfo(marketIDsMissingInfo));
  }
  return markets;
}

export const selectPaginated = createSelector(
  selectUnpaginatedMarkets,
  selectPaginationSelectedPageNum,
  selectPaginationNumPerPage,
  (markets, pageNum, numPerPage) => (
    markets.slice((pageNum - 1) * numPerPage, pageNum * numPerPage)
  )
);
