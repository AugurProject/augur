import { augur } from '../../../services/augurjs';
import { updateMarketTradesData } from '../../../modules/portfolio/actions/update-market-trades-data';

export function loadMarketTrades(marketID) {
	return (dispatch) => {
		augur.getMarketPriceHistory(marketID, null, (marketTrades) => {
			if (marketTrades) {
				if (marketTrades.error) {
					return console.error('ERROR loadMarketTrades -- ', marketTrades);
				}
				const trades = {};
				trades[marketID] = marketTrades;
				dispatch(updateMarketTradesData(trades));
			}
		});
	};
}
