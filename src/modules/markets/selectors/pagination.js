import memoizerific from 'memoizerific';

import { updateSelectedPageNum } from '../actions/markets-actions';

import store from '../../../store';

export default function() {
	var { pagination } = store.getState(),
		{ marketsTotals } = require('../../../selectors'),
		o;

	if (!pagination || !marketsTotals.numUnpaginated) {
		return {};
	}

	o = {
		numUnpaginated: marketsTotals.numUnpaginated,
		selectedPageNum: pagination.selectedPageNum,
		numPerPage: pagination.numPerPage,
		numPages: Math.ceil(marketsTotals.numUnpaginated / pagination.numPerPage),
		startItemNum: ((pagination.selectedPageNum - 1) * pagination.numPerPage) + 1,
		endItemNum: Math.min(pagination.selectedPageNum * pagination.numPerPage, marketsTotals.numUnpaginated),
		onUpdateSelectedPageNum: (pageNum) => store.dispatch(updateSelectedPageNum(pageNum))
	};

	if (marketsTotals.numUnpaginated > o.numPerPage) {
		o.nextPageNum = o.selectedPageNum < o.numPages ? o.selectedPageNum + 1 : undefined;
		o.previousPageNum = o.selectedPageNum >= 2 ? o.selectedPageNum - 1 : undefined;

		o.nextItemNum = o.selectedPageNum < o.numPages ? o.endItemNum + 1 : undefined;
		o.previousItemNum = o.selectedPageNum >= 2 ? o.startItemNum - o.numPerPage : undefined;
	}

	return o;
}