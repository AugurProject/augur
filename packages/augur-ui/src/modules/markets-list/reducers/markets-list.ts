import {
  UPDATE_MARKETS_LIST_META,
  SET_LOAD_MARKETS_PENDING,
} from 'modules/markets-list/actions/update-markets-list';
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
    case SET_LOAD_MARKETS_PENDING:
      return {
        meta: data.isSearching ? null : marketsList.meta,
        isSearching: data.isSearching,
      };
    case UPDATE_MARKETS_LIST_META:
      return {
        ...marketsList,
        meta: data.meta,
      };
    default:
      return marketsList;
  }
}
