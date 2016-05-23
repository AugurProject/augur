import { showLink } from '../../link/actions/show-link';

export const UPDATE_KEYWORDS = 'UPDATE_KEYWORDS';

export function updateKeywords(keywords) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_KEYWORDS, keywords });
		const { links } = require('../../../selectors');
		dispatch(showLink(links.marketsLink.href, { preventScrollTop: true }));
	};
}
