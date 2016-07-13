import { UPDATE_URL } from '../../link/actions/update-url';
import { DEFAULT_PAGE } from '../../app/constants/pages';
import { PATHS_PAGES } from '../../link/constants/paths';

export default function (activePage = DEFAULT_PAGE, action) {
	switch (action.type) {
	case UPDATE_URL:
		return PATHS_PAGES[action.parsedURL.pathArray[0]] || DEFAULT_PAGE;

	default:
		return activePage;
	}
}
