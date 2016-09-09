import async from 'async';
import BigNumber from 'bignumber.js';
import { augur } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { addSellCompleteSetsTransaction } from '../../transactions/actions/add-sell-complete-sets-transaction';
import selectLoginAccountPositions from '../../../modules/my-positions/selectors/login-account-positions';

BigNumber.config({ MODULO_MODE: BigNumber.EUCLID, ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN });

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
		augur.getPositionInMarket(marketID, getState().loginAccount.id, (position) => {
			const smallestPosition = getSmallestPositionInMarket(position);
			console.log('smallest position:', smallestPosition.toFixed());
			if (smallestPosition.gt(ZERO)) {
				console.info('selling complete set:', marketID, smallestPosition.toFixed());
				dispatch(addSellCompleteSetsTransaction(marketID, smallestPosition.toFixed(), callback));
			} else {
				if (callback) callback();
			}
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
