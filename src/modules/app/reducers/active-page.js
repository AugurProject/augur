import { UPDATE_URL } from '../../link/actions/update-url';
import { DEFAULT_PAGE } from '../../app/constants/pages';

export default function (activePage = DEFAULT_PAGE, action) {
	switch (action.type) {
	case UPDATE_URL:
		return action.parsedURL.searchParams.page || DEFAULT_PAGE;

	default:
		return activePage;
	}
}
