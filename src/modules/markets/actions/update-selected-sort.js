import { showLink } from '../../link/actions/show-link';

export const UPDATE_SELECTED_SORT = 'UPDATE_SELECTED_SORT';

export function updateSelectedSort(selectedSort) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_SELECTED_SORT, selectedSort });
		const { links } = require('../../../selectors');
		dispatch(showLink(links.marketsLink.href, { preventScrollTop: true }));
	};
}
