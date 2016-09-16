import async from 'async';
import BigNumber from 'bignumber.js';
import { augur } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { addSellCompleteSetsTransaction } from '../../transactions/actions/add-sell-complete-sets-transaction';
import { updateSellCompleteSetsLock } from '../../my-positions/actions/update-account-trades-data';
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
		const { sellCompleteSetsLock, loginAccount } = getState();
		console.log('lock:', marketID, sellCompleteSetsLock[marketID]);
		if (!sellCompleteSetsLock[marketID]) {
			dispatch(updateSellCompleteSetsLock(marketID, true));
			augur.getPositionInMarket(marketID, loginAccount.id, (position) => {
				if (!position || position.error) {
					dispatch(updateSellCompleteSetsLock(marketID, false));
					return callback(null, marketID);
				}
				const completeSetsBought = getState().completeSetsBought[marketID];
				const outcomes = Object.keys(position);
				const numPositions = outcomes.length;
				if (completeSetsBought) {
					const numCompleteSetsBought = completeSetsBought.length;
					if (numCompleteSetsBought) {
						let totalCompleteSetsBought = ZERO;
						let i;
						for (i = 0; i < numCompleteSetsBought; ++i) {
							totalCompleteSetsBought = totalCompleteSetsBought.plus(completeSetsBought[i].amount);
						}
						for (i = 0; i < numPositions; ++i) {
							position[outcomes[i]] = BigNumber.max(new BigNumber(position[outcomes[i]], 10)
								.minus(totalCompleteSetsBought)
								.toFixed(), ZERO);
						}
					}
				}
				const smallestPosition = getSmallestPositionInMarket(position);
				console.log('smallest position:', marketID, smallestPosition.toFixed());
				if (smallestPosition.gt(ZERO)) {
					dispatch(addSellCompleteSetsTransaction(marketID, smallestPosition.toFixed(), callback));
				} else {
					dispatch(updateSellCompleteSetsLock(marketID, false));
					if (callback) callback(null);
				}
			});
		}
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
