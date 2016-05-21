import { SHOW_LINK } from '../../link/actions/show-link';
import { TOGGLE_FILTER } from '../../markets/actions/toggle-filter';

export default function (selectedFilters = { isOpen: true }, action) {
	let newSelectedFilters;
	let params;

	switch (action.type) {
	case TOGGLE_FILTER:
		newSelectedFilters = {
			...selectedFilters
		};

		if (newSelectedFilters[action.filterID]) {
			delete newSelectedFilters[action.filterID];
		} else {
			newSelectedFilters[action.filterID] = true;
		}
		return newSelectedFilters;

	case SHOW_LINK:
		newSelectedFilters = {
			...selectedFilters
		};

		params = action.parsedURL.searchParams;
		if (params.isOpen === 'true') {
			newSelectedFilters.isOpen = true;
		}
		if (params.isExpired === 'true') {
			newSelectedFilters.isExpired = true;
		}
		if (params.isPendingReport === 'true') {
			newSelectedFilters.isPendingReport = true;
		}
		if (params.isMissedOrReported === 'true') {
			newSelectedFilters.isMissedOrReported = true;
		}
		if (params.isBinary === 'true') {
			newSelectedFilters.isBinary = true;
		}
		if (params.isCategorical === 'true') {
			newSelectedFilters.isCategorical = true;
		}
		if (params.isScalar === 'true') {
			newSelectedFilters.isScalar = true;
		}
		return newSelectedFilters;

	default:
		return selectedFilters;
	}
}
