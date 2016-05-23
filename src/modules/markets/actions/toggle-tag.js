import { showLink } from '../../link/actions/show-link';

export const TOGGLE_TAG = 'TOGGLE_TAG';

export function toggleTag(filterID) {
	return (dispatch, getState) => {
		dispatch({ type: TOGGLE_TAG, filterID });
		const { links } = require('../../../selectors');
		dispatch(showLink(links.marketsLink.href, { preventScrollTop: true }));
	};
}
