import { updateURL } from '../../link/actions/update-url';

export const UPDATE_SELECTED_SORT = 'UPDATE_SELECTED_SORT';

export function updateSelectedSort(selectedSort) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_SELECTED_SORT, selectedSort });
		const { links } = require('../../../selectors');
		dispatch(updateURL(links.marketsLink.href));
	};
}
