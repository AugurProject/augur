import { showLink } from '../../link/actions/show-link';

export const TOGGLE_TAG = 'TOGGLE_TAG';

export function toggleTag(filterID) {
	return (dispatch, getState) => {
		dispatch({ type: TOGGLE_TAG, filterID });
		const { links } = require('../../../selectors'); // this has to be after the dispatch to get the new state
		dispatch(showLink(links.marketsLink.href));
	};
}
