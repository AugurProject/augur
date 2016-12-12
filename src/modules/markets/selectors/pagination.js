// import memoizerific from 'memoizerific';
import { updateSelectedPageNum } from '../../markets/actions/update-selected-page-num';
import store from '../../../store';
import { makeLocation } from '../../../utils/parse-url';

export default function () {
	const { pagination } = store.getState();
	const { marketsTotals } = require('../../../selectors');

	if (!pagination || !marketsTotals.numUnpaginated) {
		return {};
	}

	function makeLink(page, o) {
		const href = makeLocation({ page }).url;

		return {
			href,
			onClick: () => { o.onUpdateSelectedPageNum(page); }
		};
	}

	const o = {
		numUnpaginated: marketsTotals.numUnpaginated,
		selectedPageNum: pagination.selectedPageNum,
		numPerPage: pagination.numPerPage,
		numPages: Math.ceil(marketsTotals.numUnpaginated / pagination.numPerPage),
		startItemNum: ((pagination.selectedPageNum - 1) * pagination.numPerPage) + 1,
		endItemNum: Math.min(pagination.selectedPageNum * pagination.numPerPage,
			marketsTotals.numUnpaginated),
		onUpdateSelectedPageNum: pageNum => store.dispatch(updateSelectedPageNum(pageNum))
	};

	if (marketsTotals.numUnpaginated > o.numPerPage) {
		o.nextPageNum = o.selectedPageNum < o.numPages ? o.selectedPageNum + 1 : undefined;
		o.previousPageNum = o.selectedPageNum >= 2 ? o.selectedPageNum - 1 : undefined;

		o.nextItemNum = o.selectedPageNum < o.numPages ? o.endItemNum + 1 : undefined;
		o.previousItemNum = o.selectedPageNum >= 2 ? o.startItemNum - o.numPerPage : undefined;

		o.nextPageLink = o.nextPageNum ? makeLink(o.nextPageNum, o) : null;
		o.previousPageLink = o.previousPageNum ? makeLink(o.previousPageNum, o) : null;
	}

	return o;
}
