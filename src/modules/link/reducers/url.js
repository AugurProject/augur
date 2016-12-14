import { UPDATE_URL } from '../../link/actions/update-url';

export default function (url = '/', action) {
	switch (action.type) {
		case UPDATE_URL:
			return action.parsedURL.url;

		default:
			return url;
	}
}
