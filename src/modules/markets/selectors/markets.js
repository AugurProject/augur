import memoizerific from 'memoizerific';
import { MY_POSITIONS } from '../../app/constants/views';
import { PENDING_REPORTS } from '../../markets/constants/markets-headers';

import { loadMarketsInfo } from '../../markets/actions/load-markets-info';

import store from '../../../store';

export default function () {
	const { activeView, selectedMarketsHeader, pagination } = store.getState();
	const { unpaginatedMarkets } = require('../../../selectors');

	let markets;

	if (activeView !== MY_POSITIONS && selectedMarketsHeader !== PENDING_REPORTS) {
		markets = selectPaginated(unpaginatedMarkets, pagination.selectedPageNum, pagination.numPerPage);
	} else {
		markets = unpaginatedMarkets;
	}

	const marketIDsMissingInfo = markets.filter(market => !market.isLoadedMarketInfo).map(market => market.id);

	if (marketIDsMissingInfo.length) {
		store.dispatch(loadMarketsInfo(marketIDsMissingInfo));
	}
	return markets;
}

export const selectPaginated = memoizerific(1)((markets, pageNum, numPerPage) =>
	markets.slice((pageNum - 1) * numPerPage, pageNum * numPerPage)
);
