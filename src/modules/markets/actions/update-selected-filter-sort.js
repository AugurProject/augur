import { updateURL } from '../../link/actions/update-url';

export const UPDATE_SELECTED_FILTER_SORT = 'UPDATE_SELECTED_FILTER_SORT';

export function updateSelectedFilterSort(selectedFilterSortChanges) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_SELECTED_FILTER_SORT, selectedFilterSortChanges });

		const { links } = require('../../../selectors');
		dispatch(updateURL(links.marketsLink.href));
	};
}
