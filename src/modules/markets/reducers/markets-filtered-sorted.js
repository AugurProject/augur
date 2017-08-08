import { UPDATE_MARKETS_FILTERED_SORTED } from 'modules/markets/actions/update-markets-filtered-sorted';

const DEFAULT_STATE = [];

export default function (marketsFilteredSorted = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKETS_FILTERED_SORTED:
      return action.data.marketsFilteredSorted;
    default:
      return marketsFilteredSorted;
  }
}
