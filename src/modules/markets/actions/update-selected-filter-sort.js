import { updateURL } from '../../link/actions/update-url';

export const UPDATE_SELECTED_FILTER_SORT = 'UPDATE_SELECTED_FILTER_SORT';

export function updateSelectedFilterSort(selectedFilterSort) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_SELECTED_FILTER_SORT, selectedFilterSort });

		const { links } = require('../../../selectors');
		dispatch(updateURL(links.marketsLink.href));
	};
}
