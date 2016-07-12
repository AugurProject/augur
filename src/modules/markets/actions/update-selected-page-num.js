import { updateURL } from '../../link/actions/update-url';

export const UPDATE_SELECTED_PAGE_NUM = 'UPDATE_SELECTED_PAGE_NUM';

export function updateSelectedPageNum(selectedPageNum) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_SELECTED_PAGE_NUM, selectedPageNum });
		const { links } = require('../../../selectors');
		dispatch(updateURL(links.marketsLink.href));
	};
}
