import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import * as AuthActions from '../../auth/actions/auth-actions';
import * as MarketsActions from '../../markets/actions/markets-actions';
import * as ReportsActions from '../../reports/actions/reports-actions';

export const UPDATE_BLOCKCHAIN = 'UPDATE_BLOCKCHAIN';
export const UPDATE_BRANCH = 'UPDATE_BRANCH';

export function initAugur() {
	return (dispatch, getState) => {
		AugurJS.connect(function (err, connected) {
			if (err) {
				return console.error('connect failure:', err);
			}

			dispatch(AuthActions.loadLoginAccount());

			AugurJS.loadBranch(BRANCH_ID, (err, branch) => {
				if (err) {
					return console.log('ERROR loadBranch', err);
				}

				dispatch(updateBranch(branch));

				AugurJS.loadCurrentBlock(blockNum => {
					dispatch(updateBlockchain(blockNum));
					dispatch(MarketsActions.loadMarkets());
					dispatch(ReportsActions.loadRecentlyExpiredEvents());
					dispatch(listenToUpdates());
				});
			});
		});
	};
}

export function updateCurrentBlock() {
	return function(dispatch, getState) {
		AugurJS.loadCurrentBlock(blockNum => {
			dispatch(updateBlockchain(blockNum));
		});
	};
}

export function updateBlockchain(blockNum) {
	return function(dispatch, getState) {
		var { branch } = getState();

		dispatch({
			type: UPDATE_BLOCKCHAIN,
			data: {
				currentBlockNumber: blockNum,
				currentBlockMillisSinceEpoch: Date.now(),
				currentPeriod: Math.floor(blockNum / branch.periodLength),
				reportPeriod: Math.floor(blockNum / branch.periodLength) - 1,
				isReportConfirmationPhase: (blockNum % branch.periodLength) > (branch.periodLength / 2)
			}
		});
	};
}

export function updateBranch(branch) {
	return { type: UPDATE_BRANCH, branch };
}

export function listenToUpdates() {
	return function(dispatch, getState) {
		AugurJS.listenToUpdates(

			// new block
			(errNone, blockHash) => {
				dispatch(AuthActions.updateAssets());
				dispatch(updateCurrentBlock());
			},

			// new contracts
			(errNone, filtrate) => {
				console.log('augur contracts:', filtrate)
			},

			// outcome price update, { marketId, outcome (id), price }
			(errNone, outcomePriceChange) => {
				if (!outcomePriceChange || !outcomePriceChange.marketId || !outcomePriceChange.outcome || !outcomePriceChange.price) {
					return;
				}
				dispatch(MarketsActions.updateOutcomePrice(outcomePriceChange.marketId, outcomePriceChange.outcome, parseFloat(outcomePriceChange.price)));
			},

			// new market, { blockNumber, marketId }
			(errNone, result) => {
				if (!result.marketId) {
					return;
				}
				dispatch(MarketsActions.loadMarket(result.marketId));
			}
		);
	};
}