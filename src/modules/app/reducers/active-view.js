import { UPDATE_URL } from '../../link/actions/update-url';
import { DEFAULT_VIEW } from '../constants/views';

export default function (activeView = DEFAULT_VIEW, action) {
	switch (action.type) {
		case UPDATE_URL:
			return action.parsedURL.searchParams.page || DEFAULT_VIEW;

		default:
			return activeView;
	}
}
