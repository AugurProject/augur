import async from 'async';
import BigNumber from 'bignumber.js';
import { augur } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import selectLoginAccountPositions from '../../../modules/my-positions/selectors/login-account-positions';

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID, ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN });

const noop = () => {};

export function sellCompleteSets(marketID) {
	return (dispatch, getState) => {
		if (marketID) return dispatch(sellCompleteSetsMarket(marketID));
		async.eachSeries(selectLoginAccountPositions().markets, (market, nextMarket) => {
			if (market.outcomes.length !== market.numOutcomes) return nextMarket();
			dispatch(sellCompleteSetsMarket(market.id, nextMarket));
		}, (err) => {
			if (err) console.error('sellCompleteSets error:', err);
		});
	};
}

function sellCompleteSetsMarket(marketID, callback) {
	return (dispatch, getState) => {
		const cb = callback || noop;
		augur.getPositionInMarket(marketID, getState().loginAccount.id, (position) => {
			const smallestPosition = getSmallestPositionInMarket(position);
			console.log('smallest position:', smallestPosition.toFixed());
			if (smallestPosition.lte(ZERO)) return cb();
			console.info('selling complete set:', marketID, smallestPosition.toFixed());
			augur.sellCompleteSets({
				market: marketID,
				amount: smallestPosition.toFixed(),
				onSent: (r) => {
					console.log('sellCompleteSets sent:', r);
					cb();
				},
				onSuccess: (r) => {
					console.log('sellCompleteSets success:', r);
					dispatch(updateAssets());
					dispatch(loadAccountTrades(marketID, true));
				},
				onFailed: cb
			});
		});
	};
}

function getSmallestPositionInMarket(position) {
	const numOutcomes = Object.keys(position).length;
	let smallestPosition = new BigNumber(position[1], 10);
	for (let i = 1; i <= numOutcomes; ++i) {
		smallestPosition = BigNumber.min(smallestPosition, new BigNumber(position[i], 10));
	}
	return smallestPosition;
}
