import memoizerific from 'memoizerific';

import store from 'src/store';

export default function () {
  const { selectedMarketsHeader } = store.getState();
  const { marketsTotals } = require('src/selectors');

  return selectMarketsHeader(
    selectedMarketsHeader,
    marketsTotals.numFiltered,
    marketsTotals.numFavorites,
    marketsTotals.numPendingReports,
    store.dispatch
  );
}

export const selectMarketsHeader = memoizerific(1)((selectedMarketsHeader, numFiltered, numFavorites, numPendingReports, dispatch) => {
  const obj = {
    selectedMarketsHeader,
    numMarkets: numFiltered,
    numFavorites,
    numPendingReports
  };
  return obj;
});
