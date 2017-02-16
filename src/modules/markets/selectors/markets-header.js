import memoizerific from 'memoizerific';

import store from 'src/store';

import { updateSelectedMarketsHeader } from 'modules/markets/actions/update-selected-markets-header';

import { FAVORITES, PENDING_REPORTS } from 'modules/markets/constants/markets-subset';

export default function () {
  const { selectedMarketsHeader, selectedTopic, selectedMarketsSubset } = store.getState();
  const { marketsTotals } = require('src/selectors');

  updateMarketsHeader(selectedMarketsHeader, selectedMarketsSubset, selectedTopic, store.dispatch);

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

export function updateMarketsHeader(selectedMarketsHeader, selectedMarketsSubset, selectedTopic, dispatch) {
  if (selectedMarketsSubset && selectedMarketsHeader !== selectedMarketsSubset) {
    switch (selectedMarketsSubset) {
      case FAVORITES:
        dispatch(updateSelectedMarketsHeader(FAVORITES));
        break;
      case PENDING_REPORTS:
        dispatch(updateSelectedMarketsHeader(PENDING_REPORTS));
        break;
      default:
        break;
    }
  } else if (selectedTopic && selectedMarketsHeader !== selectedTopic) {
    dispatch(updateSelectedMarketsHeader(selectedTopic));
  } else if (!selectedTopic && !selectedMarketsSubset && selectedMarketsHeader !== null) {
    dispatch(updateSelectedMarketsHeader(null));
  }
}
