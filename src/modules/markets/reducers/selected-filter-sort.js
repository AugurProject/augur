import { UPDATE_URL } from '../../link/actions/update-url';
import { FILTER_SORT_TYPE, FILTER_SORT_SORT, FILTER_SORT_ISDESC } from '../../markets/constants/filter-sort';
import { FILTER_SORT_TYPE_PARAM_NAME, FILTER_SORT_SORT_PARAM_NAME, FILTER_SORT_ISDESC_PARAM_NAME } from '../../link/constants/param-names';
import { UPDATE_SELECTED_FILTER_SORT } from '../../markets/actions/update-selected-filter-sort';
import store from '../../../store';

const INITIAL_STATE = {
	type: FILTER_SORT_TYPE,
	sort: FILTER_SORT_SORT,
	isDesc: FILTER_SORT_ISDESC
};

export default function (selectedFilterSort = INITIAL_STATE, action) {
	let params;
	switch (action.type) {
	case UPDATE_SELECTED_FILTER_SORT:
		return {
			...selectedFilterSort,
			...action.selectedFilterSort
		};
	case UPDATE_URL: {
		const { filterSort } = store.getState();
		params = action.parsedURL.searchParams;

		const changes = {};

		if (params[FILTER_SORT_TYPE_PARAM_NAME] != null && findParam('type', params[FILTER_SORT_TYPE_PARAM_NAME])) {
			changes.type = params[FILTER_SORT_TYPE_PARAM_NAME];
		}

		if (params[FILTER_SORT_SORT_PARAM_NAME] != null && findParam('sort', params[FILTER_SORT_SORT_PARAM_NAME])) {
			changes.sort = params[FILTER_SORT_TYPE_PARAM_NAME];
		}

		if (params[FILTER_SORT_ISDESC_PARAM_NAME] != null && typeof params[FILTER_SORT_ISDESC_PARAM_NAME] === 'boolean' && params[FILTER_SORT_ISDESC_PARAM_NAME] !== filterSort.isDesc) {
			changes.isDesc = params[FILTER_SORT_ISDESC_PARAM_NAME];
		}

		if (Object.keys(changes).length) {
			return {
				...selectedFilterSort,
				...changes
			};
		}

		return selectedFilterSort;
	}
	default:
		return selectedFilterSort;
	}
}

function findParam(name, value) { // Insure the param is valid
	const { filterSort } = store.getState();
	return filterSort[name].find(item => item.value === value);
}
