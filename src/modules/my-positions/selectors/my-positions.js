import { createSelector } from 'reselect';
import store from 'src/store';
import { selectMarkets } from 'modules/markets/selectors/markets-all';

export default function () {
  return selectPositionsMarkets(store.getState());
}

export const selectPositionsMarkets = createSelector(
  selectMarkets,
  markets => (markets || []).filter(market => market.myPositionsSummary && market.myPositionsSummary.numPositions && market.myPositionsSummary.numPositions.value)
);
