import {
  UPDATE_MARKETS_LIST_META,
  UPDATE_MARKETS_LIST_SERACHING,
} from 'modules/markets-list/actions/update-markets-list-searching';
import { BaseAction, MarketsList } from 'modules/types';


const DEFAULT_STATE: MarketsList = {
  isSearching: true,
  meta: null,
};

export default function(
  marketsList: MarketsList = DEFAULT_STATE,
  { type, data }: BaseAction
) {
  switch (type) {
    case UPDATE_MARKETS_LIST_SERACHING:
      return {
        ...marketsList,
        isSearching: data.isSearching,
      };
    case UPDATE_MARKETS_LIST_META:
      return {
        ...marketsList,
        meta: data.meta,
        currentCategories: data.meta.categories,
      };
    default:
      return marketsList;
  }
}
