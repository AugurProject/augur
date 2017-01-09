import { loadFullMarket } from '../../market/actions/load-full-market';
import { loadMarketCreatorFees } from '../../my-markets/actions/load-market-creator-fees';

export function loadCreatedMarketInfo(marketID) {
	return (dispatch, getState) => {
		const { loginAccount, marketsData } = getState();
		if (marketsData[marketID].author === loginAccount.address) {
			dispatch(loadFullMarket(marketID));
			dispatch(loadMarketCreatorFees(marketID));
		}
	};
}
