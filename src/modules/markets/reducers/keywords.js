import { UPDATE_KEYWORDS } from '../../markets/actions/update-keywords';
import { SHOW_LINK } from '../../link/actions/show-link';
import { SEARCH_PARAM_NAME } from '../../link/constants/param-names';

export default function (keywords = '', action) {
	let params;
	switch (action.type) {
	case UPDATE_KEYWORDS:
		return action.keywords;

	case SHOW_LINK:
		params = action.parsedURL.searchParams;
		if (params[SEARCH_PARAM_NAME] != null && params[SEARCH_PARAM_NAME] !== '') {
			return params[SEARCH_PARAM_NAME];
		}
		return '';

	default:
		return keywords;
	}
}
