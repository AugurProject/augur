import { updateURL } from '../../link/actions/update-url';

export const TOGGLE_FILTER = 'TOGGLE_FILTER';

export function toggleFilter(filterID) {
	return (dispatch, getState) => {
		dispatch({ type: TOGGLE_FILTER, filterID });
		const { links } = require('../../../selectors');
		dispatch(updateURL(links.marketsLink.href));
	};
}
