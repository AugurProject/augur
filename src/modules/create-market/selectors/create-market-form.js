import memoizerific from 'memoizerific';

import { MARKET_TYPES } from '../../markets/constants/market-types';

import { updateMakeInProgress } from '../../create-market/actions/update-make-in-progress';

import store from '../../../store';

import * as Step2 from '../../create-market/selectors/form-steps/step-2';
import * as Step3 from '../../create-market/selectors/form-steps/step-3';
import * as Step4 from '../../create-market/selectors/form-steps/step-4';
import * as Step5 from '../../create-market/selectors/form-steps/step-5';

export default function () {
	const { createMarketInProgress, blockchain } = store.getState();
	return selectCreateMarketForm(
		createMarketInProgress,
		blockchain.currentBlockNumber,
		blockchain.currentBlockMillisSinceEpoch,
		store.dispatch);
}

export const selectCreateMarketForm =
	memoizerific(1)((
	createMarketInProgress,
	currentBlockNumber,
	currentBlockMillisSinceEpoch,
	dispatch) => {
		let formState = {
			...createMarketInProgress,
			creatingMarket: true,
			errors: {}
		};

		// next step handler
		formState.onValuesUpdated = newValues => dispatch(updateMakeInProgress(newValues));

		// init
		if (!formState.step || !(formState.step >= 1)) {
			formState.step = 1;
			return formState;
		}

		// step 1
		if (!(formState.step > 1) || !MARKET_TYPES[formState.type]) {
			formState.step = 1;
			return formState;
		}

		// step 2
		formState = {
			...formState,
			...Step2.initialFairPrices(formState),
			...Step2.select(formState)
		};
		formState.isValid = Step2.isValid(formState);
		if (!(formState.step > 2) || !formState.isValid) {
			formState.step = 2;
			formState.errors = {
				...formState.errors,
				...Step2.errors(formState)
			};
			return formState;
		}

		// step 3
		formState = {
			...formState,
			...Step3.select(formState)
		};
		formState.isValid = Step3.isValid(formState);
		if (!(formState.step > 3) || !formState.isValid) {
			formState.step = 3;
			formState.errors = {
				...formState.errors,
				...Step3.errors(formState)
			};
			return formState;
		}

		// step 4
		formState = {
			...formState,
			...Step4.select(formState)
		};
		formState.isValid = Step4.isValid(formState);
		if (!(formState.step > 4) || !formState.isValid) {
			formState.step = 4;
			formState.errors = {
				...formState.errors,
				...Step4.errors(formState)
			};
			return formState;
		}

		// step 5
		return {
			...formState,
			...Step5.select(formState, currentBlockNumber, currentBlockMillisSinceEpoch, dispatch),
			step: 5
		};
	});
