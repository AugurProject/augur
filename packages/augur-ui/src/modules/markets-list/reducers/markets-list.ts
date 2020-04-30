import {
  UPDATE_MARKETS_LIST_META,
  SET_LOAD_MARKETS_PENDING,
  UPDATE_SELECTED_CATEGORIES,
  UPDATE_CARD_FORMAT,
  SET_SEARCH_IN_PLACE
} from 'modules/markets-list/actions/update-markets-list';
import { BaseAction, MarketsList } from 'modules/types';

const DEFAULT_STATE: MarketsList = {
  isSearching: true,
  meta: null,
  selectedCategories: [],
  selectedCategory: null,
  marketCardFormat: null,
  isSearchInPlace: false
};

export default function(
  marketsList: MarketsList = DEFAULT_STATE,
  { type, data }: BaseAction
) {
  switch (type) {
    case SET_LOAD_MARKETS_PENDING:
      return {
        ...marketsList,
        isSearching: data.isSearching,
      };
    case UPDATE_MARKETS_LIST_META:
      return {
        ...marketsList,
        meta: data.meta,
      };
    case UPDATE_SELECTED_CATEGORIES:
      return {
        ...marketsList,
        selectedCategories: data.categories,
        selectedCategory: data.categories.length ? data.categories[data.categories.length - 1] : null,
      };
    case UPDATE_CARD_FORMAT:
      return {
        ...marketsList,
        marketCardFormat: data.format,
      };
    case SET_SEARCH_IN_PLACE:
      return {
        ...marketsList,
        isSearchInPlace: data.isSearchInPlace,
      };
    default:
      return marketsList;
  }
}
