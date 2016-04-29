import { MakeDescriptionFromCategoricalOutcomeNames } from '../../../utils/parse-market-data';

import { BRANCH_ID } from '../../app/constants/network';
import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { PENDING, SUCCESS, FAILED, CREATING_MARKET } from '../../transactions/constants/statuses';

import AugurJS from '../../../services/augurjs';

import { loadMarket } from '../../markets/actions/load-market';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addCreateMarketTransaction } from '../../transactions/actions/add-create-market-transaction';
import { clearMakeInProgress } from '../../create-market/actions/update-make-in-progress';

import { selectTransactionsLink } from '../../link/selectors/links';

export function submitNewMarket(newMarket) {
	return function(dispatch, getState) {
		selectTransactionsLink(dispatch).onClick();
		dispatch(addCreateMarketTransaction(newMarket));
	};
}

export function createMarket(transactionID, newMarket) {
	return function(dispatch, getState) {
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
			newMarket.description = MakeDescriptionFromCategoricalOutcomeNames(newMarket);
		}
		else {
			console.warn('createMarket unsupported type:', newMarket.type);
			return;
		}

		dispatch(updateExistingTransaction(transactionID, { status: 'sending...' }));

		AugurJS.createMarket(BRANCH_ID, newMarket, (err, res) => {
			if (err) {
				dispatch(transactionID(transactionID, { status: FAILED, message: err.message }));
				return;
			}
			if (res.status === CREATING_MARKET) {
				newMarket.id = res.marketID;
				dispatch(updateExistingTransaction(transactionID, { status: CREATING_MARKET }));
			}
			else {
				dispatch(updateExistingTransaction(transactionID, { status: res.status }));
				if (res.status === SUCCESS) {
					dispatch(clearMakeInProgress());
					setTimeout(() => dispatch(loadMarket(res.marketID)), 5000);
				}
			}
		});
	};
}


