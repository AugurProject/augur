import { showLink } from '../../link/actions/show-link';
import { PAGES_PATHS } from '../../link/constants/paths';
import { MARKETS } from '../../app/constants/pages';

export const UPDATE_SELECTED_PAGE_NUM = 'UPDATE_SELECTED_PAGE_NUM';

export function updateSelectedPageNum(selectedPageNum) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_SELECTED_PAGE_NUM, selectedPageNum });

		// todo: somehow make this nicer
		let s = getState();
		let filtersQuery = Object.keys(s.selectedFilters)
			.map(filter => `${filter}=${s.selectedFilters[filter]}`);
		let sortQuery = `sort=${s.selectedSort.prop}|${s.selectedSort.isDesc}`;
		let searchQuery = s.keywords.length > 0 ? `search=${s.keywords}` : [];
		let paginationQuery = s.pagination.selectedPageNum > 1 ? `page=${s.pagination.selectedPageNum}` : [];
		let queryParts = [].concat(filtersQuery, sortQuery, searchQuery, paginationQuery);
		dispatch(showLink(`${PAGES_PATHS[MARKETS]}?${queryParts.join("&")}`, { preventScroll: true }));
	};
}
