import { UPDATE_URL } from '../../link/actions/update-url';
import { TOGGLE_FILTER } from '../../markets/actions/toggle-filter';
import { FILTERS_PARAM_NAME } from '../../link/constants/param-names';

export default function (selectedFilters = { isOpen: true }, action) {
	let newSelectedFilters;

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

	case UPDATE_URL:
		if (!action.parsedURL.searchParams[FILTERS_PARAM_NAME]) {
			return {};
		}
		return action.parsedURL.searchParams[FILTERS_PARAM_NAME].split(',').reduce((p, param) => {
			p[param] = true;
			return p;
		}, { ...selectedFilters });

	default:
		return selectedFilters;
	}
}
