import { EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from '../../create-market/constants/market-values-constraints';

export default function (expirySource) {
	if (
		expirySource === null || expirySource === undefined ||
		[EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC].indexOf(expirySource) < 0) {
		return 'Please choose an expiry source';
	}
}
