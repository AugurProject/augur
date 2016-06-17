import {
    TRADING_FEE_DEFAULT,
    MAKER_FEE_DEFAULT,
    INITIAL_LIQUIDITY_DEFAULT,
    STARTING_QUANTITY_DEFAULT,
    BEST_STARTING_QUANTITY_DEFAULT,
    PRICE_WIDTH_DEFAULT,
    SEPARATION_DEFAULT
} from '../modules/create-market/constants/market-values-constraints';

import { BINARY, CATEGORICAL, SCALAR } from '../modules/markets/constants/market-types';

import { makeNumber } from '../utils/make-number';

function createMarketForm() {
	let form = {
		creatingMarket: true,
		step: 1,
		errors: {},
		isValid: true,
		tradingFeePercent: TRADING_FEE_DEFAULT,
		makerFee: MAKER_FEE_DEFAULT,
		initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,
		// Advanced Market Creation
		initialFairPrices: {},
		startingQuantity: STARTING_QUANTITY_DEFAULT,
		bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
		priceWidth: PRICE_WIDTH_DEFAULT,
		separation: SEPARATION_DEFAULT,
		onValuesUpdated: newValues => updateForm(newValues)
	};

	return form;

	function updateForm(newValues) {
		if (newValues.step === 4) {
			const labels = [];
			switch (form.type) {
			case BINARY:
				setInitialFairPrices(['Yes', 'No'], BINARY);
				break;
			case SCALAR:
				setInitialFairPrices(['⇧', '⇩'], SCALAR);
				break;
			case CATEGORICAL:
				form.categoricalOutcomes.map((val, i) => {
					labels[i] = val;
					return val;
				});
				setInitialFairPrices(labels, CATEGORICAL);
				break;
			default:
				break;
			}
		}

		function setInitialFairPrices(labels, type) {
			form.initialFairPrices = {
				type,
				values: [],
				raw: []
			};

			labels.map((cV, i) => {
				form.initialFairPrices.values[i] = {
					label: cV,
					value: 0.5
				};
				form.initialFairPrices.raw[i] = 0.5;
				return cV;
			});
		}

		if (newValues.step === 5) {
			const formattedFairPrices = [];

			form.initialFairPrices.values.map((cV, i) => {
				formattedFairPrices[i] = makeNumber(cV.value, `ETH | ${cV.label}`, true);
				return cV;
			});

			form.initialFairPrices = {
				...form.initialFairPrices,
				formatted: formattedFairPrices
			};

			form.volume = makeNumber(0);

			form.tradingFeePercent = makeNumber(form.tradingFeePercent, '%');
			form.makerFeePercent = makeNumber(form.makerFee, '%');
			form.takerFeePercent = makeNumber(100 - form.makerFee, '%');
			form.bestStartingQuantityFormatted = makeNumber(form.bestStartingQuantity, 'Shares', true);
			form.startingQuantityFormatted = makeNumber(form.startingQuantity, 'Shares', true);
			form.priceWidthFormatted = makeNumber(form.priceWidth, 'ETH', true);
		}

		form = {
			...form,
			...newValues
		};
		require('../selectors').update({ createMarketForm: form });
	}
}

export default createMarketForm();
