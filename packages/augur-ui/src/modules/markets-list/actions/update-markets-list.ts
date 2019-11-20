export const SET_LOAD_MARKETS_PENDING = 'SET_LOAD_MARKETS_PENDING';
export const UPDATE_MARKETS_LIST_META = 'UPDATE_MARKETS_LIST_META';
export const UPDATE_SELECTED_CATEGORIES = 'UPDATE_SELECTED_CATEGORIES';
export const UPDATE_CARD_FORMAT = 'UPDATE_CARD_FORMAT';
export const SET_SEARCH_IN_PLACE = 'SET_SEARCH_IN_PLACE';

export const setLoadMarketsPending = (isSearching: boolean) => ({
  type: SET_LOAD_MARKETS_PENDING,
  data: { isSearching },
});

export const updateMarketsListMeta = (meta: object) => ({
  type: UPDATE_MARKETS_LIST_META,
  data: { meta },
});

export const updateSelectedCategories = (categories: string) => ({
  type: UPDATE_SELECTED_CATEGORIES,
  data: { categories },
});

export const updateMarketsListCardFormat = (format: string) => ({
  type: UPDATE_CARD_FORMAT,
  data: { format },
});

export const setMarketsListSearchInPlace = (isSearchInPlace: boolean) => ({
  type: SET_SEARCH_IN_PLACE,
  data: { isSearchInPlace },
});