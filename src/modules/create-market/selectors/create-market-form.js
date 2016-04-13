import memoizerific from 'memoizerific';

import { MARKET_TYPES } from '../../markets/constants/market-types';
import { TRADING_FEE_DEFAULT, INITIAL_LIQUIDITY_DEFAULT } from '../../create-market/constants/market-values-constraints';

import * as CreateMarketActions from '../../create-market/actions/create-market-actions';

import store from '../../../store';

import { isValidStep2 } from '../../create-market/selectors/create-market-form-2';
import { isValidStep3 } from '../../create-market/selectors/create-market-form-3';
import { isValidStep4 } from '../../create-market/selectors/create-market-form-4';

export default function() {
	var { createMarketInProgress } = store.getState();
	return selectCreateMarketForm(createMarketInProgress, store.dispatch);
}

export const selectCreateMarketForm = memoizerific(1)(function(createMarketInProgress, dispatch) {
	var selectors = require('../../../selectors'),
		formState = {
			...createMarketInProgress,
			errors: {}
		},
		isValid = false;

	// next handler
	formState.onValuesUpdated = (newValues) => dispatch(CreateMarketActions.updateMakeInProgress(newValues));

	// init
	if (!formState.step || !(formState.step >= 1)) {
		return {
			...formState,
			step: 1
		};
	}

	// step 1
	if (!(formState.step > 1) || !MARKET_TYPES[formState.type]) {
		return {
			...formState,
			step: 1
		};
	}

	// step 2
	isValid = isValidStep2(formState);
	if (!(formState.step > 2) || !isValid) {
		return {
			...formState,
			step: 2,
			...selectors.createMarketForm2,
			isValid
		};
	}

	// step 3
	isValid = isValidStep3(formState);
	if (!(formState.step > 3) || !isValid) {
		return {
			...formState,
			step: 3,
			...selectors.createMarketForm3,
			isValid
		};
	}

	// step 4
	isValid = isValidStep4(formState);
	if (!(formState.step > 4) || !isValid) {
		return {
			...formState,
			step: 4,
			...selectors.createMarketForm4,
			isValid
		};
	}

	// step 5
	return {
		...formState,
		step: 5,
		...selectors.createMarketForm5
	};
});
