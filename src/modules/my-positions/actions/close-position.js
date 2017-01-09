import BigNumber from 'bignumber.js';
import { augur } from 'services/augurjs';

import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress';
import { placeTrade } from 'modules/trade/actions/place-trade';

import { BUY, SELL } from 'modules/trade/constants/types';

import getValue from 'utils/get-value';

export const UPDATE_POSITION_STATUS = 'UPDATE_POSITION_STATUS';

export function closePosition(marketID, outcomeID) {
	return (dispatch, getState) => {
		console.log('closePosition -- ', marketID, outcomeID);

		const { accountPositions, orderBooks } = getState();

		console.log('accountPosition -- ', accountPositions[marketID]);

		const outcomeShares = new BigNumber(getValue(accountPositions, `${marketID}.${outcomeID}`) || 0);

		console.log('outcomeShares -- ', outcomeShares.toNumber());

		console.log('orderBooks -- ', orderBooks);

		if (outcomeShares.toNumber() > 0) { // Sell Outcome
			console.log('need to sell position');

			const bestLimitPrice = getBestLimitPrice(orderBooks, SELL, outcomeShares.absoluteValue(), marketID, outcomeID);

			console.log('bestLimitPrice -- ', bestLimitPrice.toNumber());

			augur.sell(
				outcomeShares.absoluteValue(),
				bestLimitPrice.toNumber(),
				marketID,
				outcomeID,
				null,
				(res) => {
					console.log('sell onSent -- ', res);
				},
				(res) => {
					console.log('sell onSuccess -- ', res);
				},
				(res) => {
					console.log('sell onFailed -- ', res);
				}
			);

			// dispatch(updateTradesInProgress(marketID, outcomeID, SELL, outcomeShares.absoluteValue(), bestLimitPrice.toNumber()));
			// dispatch(placeTrade(marketID, outcomeID));
		} else { // Buy Outcome
			console.log('need to buy position');
		}

		// Generate Trades Necessary via `updateTradesInProgress`


	};
}

function getBestLimitPrice(orderBooks, side, shares, marketID, outcomeID) {
	let sharesFilled = new BigNumber(0);

	const deepestFillingOrder = Object.keys((getValue(orderBooks, `${marketID}.${side}`) || {})).reduce((p, orderID) => {
		const orderOutcome = getValue(orderBooks, `${marketID}.${side}.${orderID}`);

		if (orderOutcome.outcome === outcomeID) {
			p.push(orderOutcome);
		}

		return p;
	}, []).sort((a, b) => {
		const aBN = new BigNumber(a.fullPrecisionPrice);
		const bBN = new BigNumber(b.fullPrecisionPrice);
		return aBN-bBN;
	}).find((order) => {
		sharesFilled = sharesFilled.plus(new BigNumber(order.amount));

		if (sharesFilled >= shares) {
			return true;
		}

		return false;
	});

	return new BigNumber(deepestFillingOrder.fullPrecisionPrice || 0.5);
}
