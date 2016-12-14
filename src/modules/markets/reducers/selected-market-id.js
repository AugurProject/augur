import { UPDATE_URL } from '../../link/actions/update-url';
import { abi } from '../../../services/augurjs';

export default function (selectedMarketID = null, action) {
	switch (action.type) {
		case UPDATE_URL:
			if (action.parsedURL.searchParams.m) {
				return abi.format_int256(action.parsedURL.searchParams.m.split('_').pop());
			}
			return null;

		default:
			return selectedMarketID;
	}
}
