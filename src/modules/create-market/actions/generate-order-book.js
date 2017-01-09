import { augur } from '../../../services/augurjs';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from '../../my-positions/actions/load-account-trades';
import { updateSellCompleteSetsLock } from '../../my-positions/actions/update-account-trades-data';

export const submitGenerateOrderBook = market => (dispatch) => {
	dispatch(updateSellCompleteSetsLock(market.id, true));
	augur.generateOrderBook({
		market: market.id,
		liquidity: market.initialLiquidity,
		initialFairPrices: market.initialFairPrices.raw,
		startingQuantity: market.startingQuantity,
		bestStartingQuantity: market.bestStartingQuantity,
		priceWidth: market.priceWidth,
		isSimulation: market.isSimulation,
		onSimulate: r => console.log('generateOrderBook onSimulate:', r),
		onBuyCompleteSets: r => console.log('generateOrderBook onBuyCompleteSets:', r),
		onSetupOutcome: r => console.log('generateOrderBook onSetupOutcome:', `Order book creation for outcome '${
			market.outcomes[r.outcome - 1].name
			}' completed.`, r),
		onSetupOrder: r => console.log('generateOrderBook onSetupOrder:', `${
			r.buyPrice ? 'Bid' : 'Ask'
			} for ${
			r.amount
			} share${
			r.amount > 1 ? 's' : ''
			} of outcome '${
			market.outcomes[r.outcome - 1].name
			}' at ${
			r.buyPrice || r.sellPrice
			} ETH created.`, r),
		onSuccess: (r) => {
			console.log('generateOrderBook onSuccess:', r);
			dispatch(loadBidsAsks(market.id));
			dispatch(loadAccountTrades(market.id, () => dispatch(updateSellCompleteSetsLock(market.id, false))));
		},
		onFailed: e => console.error('generateOrderBook onFailed:', e)
	});
};
