import { showLink } from '../../link/actions/show-link';
import { prepareUrl } from '../../markets/utils/markets-utils';

export const UPDATE_KEYWORDS = 'UPDATE_KEYWORDS';

export function updateKeywords(keywords) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_KEYWORDS, keywords});

		dispatch(showLink(prepareUrl(getState())));
	}
}