import memoizerific from 'memoizerific';
import { POSITIONS } from '../../app/constants/pages';
import { PENDING_REPORTS } from '../../markets/constants/markets-headers';

import store from '../../../store';

export const selectPaginated = memoizerific(1)(
(markets, pageNum, numPerPage) => markets.slice((pageNum - 1) * numPerPage, pageNum * numPerPage));

export default function () {
	const { activePage, selectedMarketsHeader, pagination } = store.getState();
	const { unpaginatedMarkets } = require('../../../selectors');

	if (activePage !== POSITIONS && selectedMarketsHeader !== PENDING_REPORTS) {
		return selectPaginated(unpaginatedMarkets, pagination.selectedPageNum, pagination.numPerPage);
	}
	return unpaginatedMarkets;
}
