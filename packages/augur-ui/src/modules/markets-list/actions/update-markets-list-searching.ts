export const UPDATE_MARKETS_LIST_SERACHING = 'UPDATE_MARKETS_LIST_SERACHING';
export const UPDATE_MARKETS_LIST_META = 'UPDATE_MARKETS_LIST_META';

export const updateMarketsListSearching = ( isSearching: boolean) => ({
  type: UPDATE_MARKETS_LIST_SERACHING,
  data: { isSearching },
});

export const updateMarketsListMeta = ( meta: object) => ({
  type: UPDATE_MARKETS_LIST_META,
  data: { meta },
});

