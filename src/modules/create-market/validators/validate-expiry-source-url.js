import { EXPIRY_SOURCE_SPECIFIC } from '../../create-market/constants/market-values-constraints';

export default function (expirySourceUrl, expirySource) {
	if (expirySource === EXPIRY_SOURCE_SPECIFIC &&
		(!expirySourceUrl || !expirySourceUrl.length)) {
		return 'Please enter the full URL of the website';
	}
}
