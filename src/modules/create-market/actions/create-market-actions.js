import { MakeDescriptionFromCategoricalOutcomeNames } from '../../../utils/parse-market-data';

import { BRANCH_ID } from '../../app/constants/network';
import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { MAKE_MARKET } from '../../transactions/constants/types';
import { PENDING, SUCCESS, FAILED, CREATING_MARKET } from '../../transactions/constants/statuses';

import AugurJS from '../../../services/augurjs';

import * as TransactionsActions from '../../transactions/actions/transactions-actions';
import * as MarketsActions from '../../markets/actions/markets-actions';

import { selectNewTransaction } from '../../transactions/selectors/transactions';

export const UPDATE_MAKE_IN_PROGRESS = 'UPDATE_MAKE_IN_PROGRESS';
export const CLEAR_MAKE_IN_PROGRESS = 'CLEAR_MAKE_IN_PROGRESS';

export function updateMakeInProgress(data) {
	return { type: UPDATE_MAKE_IN_PROGRESS, data };
}

export function clearMakeInProgress() {
	return { type: CLEAR_MAKE_IN_PROGRESS };
}

export function submitNewMarketTransaction(newMarket) {
	return function(dispatch, getState) {
		var { links } = require('../../../selectors');
		links.transactionsLink.onClick();
		dispatch(TransactionsActions.addTransactions([selectNewTransaction(
			MAKE_MARKET,
			0,
			0,
			0,
			0,
			newMarket,
			(transactionID) => dispatch(createMarket(transactionID, newMarket))
		)]));
	};
}

export function createMarket(transactionID, newMarket) {
	return function(dispatch, getState) {
		dispatch(TransactionsActions.updateTransactions({
			[transactionID]: { status: 'sending...' }
		}));

		if (newMarket.type === BINARY) {
			newMarket.minValue = 1;
			newMarket.maxValue = 2;
			newMarket.numOutcomes = 2;

		}
		else if (newMarket.type === SCALAR) {
			newMarket.minValue = newMarket.scalarSmallNum;
			newMarket.maxValue = newMarket.scalarBigNum;
			newMarket.numOutcomes = 2;

		}
		else if (newMarket.type === CATEGORICAL) {
			newMarket.minValue = 1;
			newMarket.maxValue = 2;
			newMarket.numOutcomes = newMarket.outcomes.length;
		}

		if (newMarket.type === CATEGORICAL) {
			newMarket.description = MakeDescriptionFromCategoricalOutcomeNames(newMarket);
		}

		AugurJS.createMarket(BRANCH_ID, newMarket, (err, res) => {
			if (err) {
				dispatch(TransactionsActions.updateTransactions({
					[transactionID]: { status: FAILED, message: err.message }
				}));
				return;
			}
			if (res.status === CREATING_MARKET) {
				newMarket.id = res.marketID;
				dispatch(TransactionsActions.updateTransactions({
					[transactionID]: { status: CREATING_MARKET }
				}));

				/*
				AugurJS.createMarketMetadata(newMarket, (err, resMetadata) => {
					if (err) {
						dispatch(TransactionsActions.updateTransactions({
							[transactionID]: { message: 'failed to save tags, source, metadata' }
						}));
						return;
					}
				});
				*/
			}
			else {
				dispatch(TransactionsActions.updateTransactions({
					[transactionID]: { status: res.status }
				}));
				if (res.status === SUCCESS) {
					dispatch(clearMakeInProgress());
					setTimeout(() => dispatch(MarketsActions.loadMarket(res.marketID)), 5000);
				}
			}
		});
	};
}


