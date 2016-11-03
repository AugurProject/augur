import { UPDATE_SCALAR_MARKET_SHARE_DENOMINATION } from '../../market/actions/update-scalar-market-share-denomination';

export default function (denominations = {}, action) {
	switch (action.type) {
	case (UPDATE_SCALAR_MARKET_SHARE_DENOMINATION):
		return {
			...denominations,
			[action.data.marketID]: action.data.denomination
		};
	default:
		return denominations;
	}
}
