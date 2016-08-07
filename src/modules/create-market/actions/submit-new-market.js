import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { SUCCESS, FAILED, CREATING_MARKET } from '../../transactions/constants/statuses';
import { CATEGORICAL_OUTCOMES_SEPARATOR, CATEGORICAL_OUTCOME_SEPARATOR } from '../../markets/constants/market-outcomes';

import { augur } from '../../../services/augurjs';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addCreateMarketTransaction } from '../../transactions/actions/add-create-market-transaction';
import { selectTransactionsLink } from '../../link/selectors/links';
import { submitGenerateOrderBook } from '../../create-market/actions/generate-order-book';
import { clearMakeInProgress } from '../../create-market/actions/update-make-in-progress';

export function submitNewMarket(newMarket) {
	return dispatch => {
		selectTransactionsLink(dispatch).onClick();
		dispatch(addCreateMarketTransaction(newMarket));
	};
}

export function createMarket(transactionID, newMarket) {
	return (dispatch, getState) => {
		const { branch } = getState();

		if (newMarket.type === BINARY) {
			newMarket.minValue = 1;
			newMarket.maxValue = 2;
			newMarket.numOutcomes = 2;
		} else if (newMarket.type === SCALAR) {
			newMarket.minValue = newMarket.scalarSmallNum;
			newMarket.maxValue = newMarket.scalarBigNum;
			newMarket.numOutcomes = 2;
		} else if (newMarket.type === CATEGORICAL) {
			newMarket.minValue = 1;
			newMarket.maxValue = 2;
			newMarket.numOutcomes = newMarket.outcomes.length;
			newMarket.formattedDescription = newMarket.description + CATEGORICAL_OUTCOMES_SEPARATOR + newMarket.outcomes.map(outcome => outcome.name).join(CATEGORICAL_OUTCOME_SEPARATOR);
		} else {
			console.warn('createMarket unsupported type:', newMarket.type);
			return;
		}

		dispatch(updateExistingTransaction(transactionID, { status: 'sending...' }));

		augur.createSingleEventMarket({
			branchId: branch.id,
			description: newMarket.formattedDescription,
			expDate: newMarket.endDate.value.getTime() / 1000,
			minValue: newMarket.minValue,
			maxValue: newMarket.maxValue,
			numOutcomes: newMarket.numOutcomes,
			resolution: newMarket.expirySource,
			takerFee: newMarket.takerFee / 100,
			tags: newMarket.tags,
			makerFee: newMarket.makerFee / 100,
			extraInfo: newMarket.detailsText,
			onSent: (res) => {
				dispatch({ status: CREATING_MARKET, txHash: res.txHash });
			},
			onSuccess: (res) => {
				dispatch({ status: SUCCESS, marketID: res.marketID, tx: res });
				dispatch(clearMakeInProgress());
				if (newMarket.isCreatingOrderBook) {
					dispatch(submitGenerateOrderBook({
						...newMarket,
						id: res.callReturn,
						tx: res
					}));
				}
			},
			onFailed: (err) => {
				dispatch(updateExistingTransaction(transactionID, {
					status: FAILED,
					message: err.message
				}));
			}
		});
		// augur.createSingleEventMarket(branch.id, newMarket, (err, res) => {
		// 	if (err) {
		// 		dispatch(
		// 			updateExistingTransaction(
		// 				transactionID,
		// 				{ status: FAILED, message: err.message }
		// 			)
		// 		);
		// 		return;
		// 	}
		// 	if (res.status === CREATING_MARKET) {
		// 		dispatch(updateExistingTransaction(transactionID, { status: CREATING_MARKET }));
		// 	} else {
		// 		dispatch(updateExistingTransaction(transactionID, { status: res.status }));

		// 		if (res.status === SUCCESS) {
		// 			dispatch(clearMakeInProgress());

		// 			if (newMarket.isCreatingOrderBook) {
		// 				const updatedNewMarket = {
		// 					...newMarket,
		// 					id: res.marketID,
		// 					tx: res.tx
		// 				};

		// 				dispatch(submitGenerateOrderBook(updatedNewMarket));
		// 			}
		// 		}
		// 	}
		// });
	};
}
