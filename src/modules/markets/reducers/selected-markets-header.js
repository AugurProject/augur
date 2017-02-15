import { UPDATE_SELECTED_MARKETS_HEADER } from '../../markets/actions/update-selected-markets-header';

export default function (selectedMarketsHeader = null, action) {
  switch (action.type) {
    case UPDATE_SELECTED_MARKETS_HEADER:
      return action.selectedMarketsHeader;

    default:
      return selectedMarketsHeader;
  }
}
