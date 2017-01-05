import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { CATEGORICAL_OUTCOMES_SEPARATOR, CATEGORICAL_OUTCOME_SEPARATOR } from '../../markets/constants/market-outcomes';
import { augur } from '../../../services/augurjs';
import { selectTransactionsLink } from '../../link/selectors/links';
import { submitGenerateOrderBook } from '../../create-market/actions/generate-order-book';
import { clearMakeInProgress } from '../../create-market/actions/update-make-in-progress';

export function submitNewMarket(newMarket) {
	return (dispatch, getState) => {
		selectTransactionsLink(dispatch).onClick();
		const { branch } = getState();
		switch (newMarket.type) {
			case CATEGORICAL:
				newMarket.minValue = 1;
				newMarket.maxValue = newMarket.outcomes.length;
				newMarket.numOutcomes = newMarket.outcomes.length;
				newMarket.formattedDescription = newMarket.description + CATEGORICAL_OUTCOMES_SEPARATOR + newMarket.outcomes.map(outcome => outcome.name).join(CATEGORICAL_OUTCOME_SEPARATOR);
				break;
			case SCALAR:
				newMarket.minValue = newMarket.scalarSmallNum;
				newMarket.maxValue = newMarket.scalarBigNum;
				newMarket.numOutcomes = 2;
				break;
			case BINARY:
			default:
				newMarket.minValue = 1;
				newMarket.maxValue = 2;
				newMarket.numOutcomes = 2;
		}
		console.log('creating market:', newMarket);
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
			onSent: res => console.log('createSingleEventMarket sent:', res),
			onSuccess: (res) => {
				console.log('createSingleEventMarket success:', res);
				dispatch(clearMakeInProgress());
				if (newMarket.isCreatingOrderBook) {
					dispatch(submitGenerateOrderBook({
						...newMarket,
						id: res.callReturn,
						tx: res
					}));
				}
			},
			onFailed: err => console.error('createSingleEventMarket failed:', err)
		});
	};
}
