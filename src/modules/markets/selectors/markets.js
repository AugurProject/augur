import memoizerific from 'memoizerific';

import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';

import store from '../../../store';

export default function() {
    var { selectedMarketsHeader } = store.getState(),
    	selectors = require('../../../selectors');

    if (selectedMarketsHeader === FAVORITES) {
    	return selectors.favoriteMarkets;
    }
    else if (selectedMarketsHeader === PENDING_REPORTS) {
    	return selectors.reportMarkets;
    }
    else {
    	return selectors.filteredMarkets;
    }
}