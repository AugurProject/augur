import { showLink } from '../../link/actions/show-link';
import { PAGES_PATHS } from '../../link/constants/paths';
import { MARKETS } from '../../app/constants/pages';

export const UPDATE_SELECTED_SORT = 'UPDATE_SELECTED_SORT';

export function updateSelectedSort(selectedSort) {
	return (dispatch, getState) => {
		dispatch({type: UPDATE_SELECTED_SORT, selectedSort});

		// todo: somehow make this nicer
		let s = getState();
		let filtersQuery = Object.keys(s.selectedFilters)
			.map(filter => `${filter}=${s.selectedFilters[filter]}`);
		let sortQuery = `sort=${s.selectedSort.prop}|${s.selectedSort.isDesc}`;
		let searchQuery = s.keywords.length > 0 ? `search=${s.keywords}` : [];
		let queryParts = [].concat(filtersQuery, sortQuery, searchQuery);
		dispatch(showLink(`${PAGES_PATHS[MARKETS]}?${queryParts.join("&")}`));
	}
}
