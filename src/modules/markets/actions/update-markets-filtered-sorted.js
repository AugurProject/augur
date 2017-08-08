export const UPDATE_MARKETS_FILTERED_SORTED = 'UPDATE_MARKETS_FILTERED_SORTED';

export const updateMarketsFilteredSorted = marketsFilteredSorted => ({
  type: UPDATE_MARKETS_FILTERED_SORTED,
  data: {
    marketsFilteredSorted
  }
});
