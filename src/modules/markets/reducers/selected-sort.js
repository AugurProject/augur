import { UPDATE_URL } from '../../link/actions/update-url';
import { SORT_PARAM_NAME } from '../../link/constants/param-names';
import { DEFAULT_SORT_PROP, DEFAULT_IS_SORT_DESC } from '../../markets/constants/sort';

import { UPDATE_SELECTED_SORT } from '../../markets/actions/update-selected-sort';

export default function (selectedSort = {
	prop: DEFAULT_SORT_PROP,
	isDesc: DEFAULT_IS_SORT_DESC
}, action) {
	let params;
	switch (action.type) {
	case UPDATE_SELECTED_SORT:
		return {
			...selectedSort,
			...action.selectedSort
		};

	case UPDATE_URL:
		params = action.parsedURL.searchParams;
		if (params[SORT_PARAM_NAME] != null && params[SORT_PARAM_NAME] !== '') {
			const sortSplit = params[SORT_PARAM_NAME].split('|');
			return {
				...selectedSort,
				prop: sortSplit[0],
				isDesc: sortSplit[1] === 'true'
			};
		}

		return selectedSort;

	default:
		return selectedSort;
	}
}
