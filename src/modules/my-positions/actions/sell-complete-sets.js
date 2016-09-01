import async from 'async';
import BigNumber from 'bignumber.js';
import { augur } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import selectLoginAccountPositions from '../../../modules/my-positions/selectors/login-account-positions';

BigNumber.config({
	MODULO_MODE: BigNumber.EUCLID,
	ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

export function sellCompleteSets() {
	return (dispatch, getState) => {
		const positions = selectLoginAccountPositions();
		async.eachSeries(positions.markets, (market, nextMarket) => {
			const outcomes = market.outcomes;
			if (outcomes.length !== market.numOutcomes) return nextMarket();
			let smallestPosition = new BigNumber(outcomes[0].sharesPurchased, 10);
			for (let i = 0; i < outcomes.length; ++i) {
				smallestPosition = BigNumber.min(smallestPosition, new BigNumber(outcomes[i].sharesPurchased, 10));
			}
			if (smallestPosition.lte(ZERO)) return nextMarket();
			console.debug('selling complete set:', market.id, smallestPosition.toFixed());
			augur.sellCompleteSets({
				market: market.id,
				amount: smallestPosition.toFixed(),
				onSent: () => { nextMarket(); },
				onSuccess: (r) => {
					console.log('sellCompleteSets success:', r);
					dispatch(loadAccountTrades(true));
				},
				onFailed: nextMarket
			});
		}, err => {
			if (err) console.error('sellCompleteSets error:', err);
		});
	};
}
