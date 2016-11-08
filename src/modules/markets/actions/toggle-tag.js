import { updateURL } from '../../link/actions/update-url';

export const TOGGLE_TAG = 'TOGGLE_TAG';

export function toggleTag(filterID) {
	return (dispatch, getState) => {
		dispatch({ type: TOGGLE_TAG, filterID: filterID.toLowerCase() });
		const { links } = require('../../../selectors'); // this has to be after the dispatch to get the new state
		dispatch(updateURL(links.marketsLink.href));
	};
}
