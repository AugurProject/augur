export const SET_LOAD_MARKETS_PENDING = 'SET_LOAD_MARKETS_PENDING';
export const UPDATE_MARKETS_LIST_META = 'UPDATE_MARKETS_LIST_META';

export const setLoadMarketsPending = ( isSearching: boolean) => ({
  type: SET_LOAD_MARKETS_PENDING,
  data: { isSearching },
});

export const updateMarketsListMeta = ( meta: object) => ({
  type: UPDATE_MARKETS_LIST_META,
  data: { meta },
});

