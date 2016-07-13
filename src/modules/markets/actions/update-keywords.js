import { updateURL } from '../../link/actions/update-url';

export const UPDATE_KEYWORDS = 'UPDATE_KEYWORDS';

export function updateKeywords(keywords) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_KEYWORDS, keywords });
		const { links } = require('../../../selectors');
		dispatch(updateURL(links.marketsLink.href));
	};
}
