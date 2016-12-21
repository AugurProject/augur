import { formatRealEther } from '../../../utils/format-number';
import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { SUCCESS, FAILED, CREATING_MARKET } from '../../transactions/constants/statuses';
import { CATEGORICAL_OUTCOMES_SEPARATOR, CATEGORICAL_OUTCOME_SEPARATOR } from '../../markets/constants/market-outcomes';
import { BRANCH_ID } from '../../app/constants/network';

import { augur } from '../../../services/augurjs';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addCreateMarketTransaction } from '../../transactions/actions/add-create-market-transaction';
import { selectTransactionsLink } from '../../link/selectors/links';
import { submitGenerateOrderBook } from '../../create-market/actions/generate-order-book';
import { clearMakeInProgress } from '../../create-market/actions/update-make-in-progress';

export function submitNewMarket(newMarket) {
	return (dispatch) => {
		selectTransactionsLink(dispatch).onClick();
		dispatch(addCreateMarketTransaction(newMarket));
	};
}

export function createMarket(transactionID, newMarket) {
	return (dispatch, getState) => {
		const { branch, transactionsData } = getState();

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
			newMarket.maxValue = newMarket.outcomes.length;
			newMarket.numOutcomes = newMarket.outcomes.length;
			newMarket.formattedDescription = newMarket.description + CATEGORICAL_OUTCOMES_SEPARATOR + newMarket.outcomes.map(outcome => outcome.name).join(CATEGORICAL_OUTCOME_SEPARATOR);
		} else {
			console.warn('createMarket unsupported type:', newMarket.type);
			return;
		}

		dispatch(updateExistingTransaction(transactionID, {
			status: 'sending...',
			marketCreationFee: newMarket.marketCreationFee,
			bond: { label: 'event validity', value: newMarket.eventBond },
			gasFees: newMarket.gasFees
		}));

		console.log('creating market:', newMarket);

		augur.createSingleEventMarket({
			branchId: branch.id || BRANCH_ID,
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
				dispatch(updateExistingTransaction(transactionID, { status: CREATING_MARKET }));
			},
			onSuccess: (res) => {
				console.log('success:', res);
				dispatch(updateExistingTransaction(transactionID, {
					data: {
						...transactionsData[transactionID].data,
						id: res.callReturn
					},
					hash: res.hash,
					timestamp: res.timestamp,
					gasFees: formatRealEther(res.gasFees),
					status: SUCCESS
				}));
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
	};
}
