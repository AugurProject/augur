import { showLink } from '../../link/actions/show-link';
import { PAGES_PATHS } from '../../link/constants/paths';
import { MARKETS } from '../../app/constants/pages';

export const UPDATE_KEYWORDS = 'UPDATE_KEYWORDS';

export function updateKeywords(keywords) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_KEYWORDS, keywords});

		let s = getState();
		let filtersQuery = Object.keys(s.selectedFilters)
			.map(filter => `${filter}=${s.selectedFilters[filter]}`);
		let sortQuery = `sort=${s.selectedSort.prop}|${s.selectedSort.isDesc}`;
		let searchQuery = s.keywords.length > 0 ? `search=${s.keywords}` : [];
		let queryParts = [].concat(filtersQuery, sortQuery, searchQuery);
		dispatch(showLink(`${PAGES_PATHS[MARKETS]}?${queryParts.join("&")}`));
	}
}