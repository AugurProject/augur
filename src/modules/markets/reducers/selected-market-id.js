import { UPDATE_URL } from '../../link/actions/update-url';
import { M } from '../../app/constants/pages';
import { PATHS_PAGES } from '../../link/constants/paths';

export default function (selectedMarketID = null, action) {
	switch (action.type) {
	case UPDATE_URL:
		if ([M].indexOf(PATHS_PAGES[action.parsedURL.pathArray[0]]) >= 0 && action.parsedURL.pathArray[1]) {
			return action.parsedURL.pathArray[1].substring(1).split('_').pop();
		}
		return null;

	default:
		return selectedMarketID;
	}
}
