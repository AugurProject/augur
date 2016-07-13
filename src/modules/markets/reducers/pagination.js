import { UPDATE_SELECTED_PAGE_NUM } from '../../markets/actions/update-selected-page-num';
import { UPDATE_SELECTED_SORT } from '../../markets/actions/update-selected-sort';
import { UPDATE_KEYWORDS } from '../../markets/actions/update-keywords';
import { TOGGLE_FILTER } from '../../markets/actions/toggle-filter';
import { TOGGLE_TAG } from '../../markets/actions/toggle-tag';
import {
	UPDATED_SELECTED_MARKETS_HEADER
} from '../../markets/actions/update-selected-markets-header';
import { PAGE_PARAM_NAME } from '../../link/constants/param-names';
import { DEFAULT_PAGE } from '../../markets/constants/pagination';

import { UPDATE_URL } from '../../link/actions/update-url';

export default function (pagination = { selectedPageNum: DEFAULT_PAGE, numPerPage: 10 }, action) {
	let params;
	let newPageNum;
	switch (action.type) {
	case UPDATE_SELECTED_PAGE_NUM:
		return {
			...pagination,
			selectedPageNum: action.selectedPageNum
		};

	case UPDATE_SELECTED_SORT:
	case UPDATE_KEYWORDS:
	case TOGGLE_FILTER:
	case TOGGLE_TAG:
	case UPDATED_SELECTED_MARKETS_HEADER:
		return {
			...pagination,
			selectedPageNum: DEFAULT_PAGE
		};

	case UPDATE_URL:
		params = action.parsedURL.searchParams;
		newPageNum = params[PAGE_PARAM_NAME];
		if (newPageNum != null && newPageNum !== '' && parseInt(newPageNum, 10) !== DEFAULT_PAGE) {
			return {
				...pagination,
				selectedPageNum: parseInt(newPageNum, 10)
			};
		}

		return pagination;

	default:
		return pagination;
	}
}
