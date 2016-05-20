import { showLink } from '../../link/actions/show-link';

export const TOGGLE_FILTER = 'TOGGLE_FILTER';

export function toggleFilter(filterID) {
	return (dispatch, getState) => {
		dispatch({ type: TOGGLE_FILTER, filterID });
		const { links } = require('../../../selectors');
		dispatch(showLink(links.marketsLink.href, { preventScrollTop: true }));
	};
}
