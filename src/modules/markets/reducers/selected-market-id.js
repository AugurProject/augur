import { UPDATE_URL } from '../../link/actions/update-url';

export default function (selectedMarketID = null, action) {
	switch (action.type) {
	case UPDATE_URL:
		if (action.parsedURL.searchParams.m) {
			let rawMarketID = action.parsedURL.searchParams.m.split('_').pop();
			if (rawMarketID.indexOf('0x') !== 0) {
				rawMarketID = '0x' + rawMarketID;
			}
			return rawMarketID;
		}
		return null;

	default:
		return selectedMarketID;
	}
}
