import { UPDATED_SELECTED_MARKETS_HEADER } from '../../markets/actions/markets-actions';
import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';

export default function(selectedMarketsHeader = null, action) {
    switch (action.type) {
        case UPDATED_SELECTED_MARKETS_HEADER:
            return action.selectedMarketsHeader;

        default:
            return selectedMarketsHeader;
    }
}