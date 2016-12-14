import { UPDATED_SELECTED_MARKETS_HEADER } from '../../markets/actions/update-selected-markets-header';

export default function (selectedMarketsHeader = null, action) {
	switch (action.type) {
		case UPDATED_SELECTED_MARKETS_HEADER:
			return action.selectedMarketsHeader;

		default:
			return selectedMarketsHeader;
	}
}
