import { showLink } from '../../link/actions/show-link';

export const UPDATE_SELECTED_PAGE_NUM = 'UPDATE_SELECTED_PAGE_NUM';

export function updateSelectedPageNum(selectedPageNum) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_SELECTED_PAGE_NUM, selectedPageNum });
		let { links } = require('../../../selectors');
		dispatch(showLink(links.marketsLink.href, { preventScrollTop: true }));
	};
}
