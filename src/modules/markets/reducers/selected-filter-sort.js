import { UPDATE_URL } from '../../link/actions/update-url';
import { FILTER_SORT_TYPE, FILTER_SORT_SORT, FILTER_SORT_ISDESC } from '../../markets/constants/filter-sort';
import { FILTER_SORT_TYPE_PARAM_NAME, FILTER_SORT_SORT_PARAM_NAME, FILTER_SORT_ISDESC_PARAM_NAME } from '../../link/constants/param-names';
import { UPDATE_SELECTED_FILTER_SORT } from '../../markets/actions/update-selected-filter-sort';
import selectFilterSort from '../../markets/selectors/filter-sort';

const INITIAL_STATE = {
	type: FILTER_SORT_TYPE,
	sort: FILTER_SORT_SORT,
	isDesc: FILTER_SORT_ISDESC
};

export default function (selectedFilterSort = INITIAL_STATE, action) {
	switch (action.type) {
		case UPDATE_SELECTED_FILTER_SORT:
			return {
				...selectedFilterSort,
				...action.selectedFilterSort
			};
		case UPDATE_URL: {
			const params = determineParams(action.parsedURL.searchParams);

			if (Object.keys(params).length) {
				return {
					...selectedFilterSort,
					...params
				};
			}

			return selectedFilterSort;
		}
		default:
			return selectedFilterSort;
	}
}

function determineParams(params) { // Insure the param is valid
	const filterSort = selectFilterSort();

	const changes = {};

	if (params[FILTER_SORT_TYPE_PARAM_NAME] != null && filterSort.types.find(item => item.value === params[FILTER_SORT_TYPE_PARAM_NAME])) {
		changes.type = params[FILTER_SORT_TYPE_PARAM_NAME];
	}

	if (params[FILTER_SORT_SORT_PARAM_NAME] != null && filterSort.sorts.find(item => item.value === params[FILTER_SORT_SORT_PARAM_NAME])) {
		changes.sort = params[FILTER_SORT_SORT_PARAM_NAME];
	}

	if (params[FILTER_SORT_ISDESC_PARAM_NAME] != null && typeof params[FILTER_SORT_ISDESC_PARAM_NAME] === 'boolean' && params[FILTER_SORT_ISDESC_PARAM_NAME] !== filterSort.isDesc) {
		changes.isDesc = params[FILTER_SORT_ISDESC_PARAM_NAME];
	}

	return changes;
}
