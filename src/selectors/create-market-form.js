import { BINARY, CATEGORICAL, SCALAR } from '../modules/markets/constants/market-types';
import makeNumber from '../utils/make-number';

function createMarketForm() {
	const CONSTANTS = {
		TAKER_FEE_DEFAULT: 2,
		MAKER_FEE_DEFAULT: 1,
		INITIAL_LIQUIDITY_DEFAULT: 500,
		STARTING_QUANTITY_DEFAULT: 10,
		BEST_STARTING_QUANTITY_DEFAULT: 20,
		PRICE_WIDTH_DEFAULT: 0.1,
		EXPIRY_SOURCE_GENERIC: 'generic',
		EXPIRY_SOURCE_SPECIFIC: 'specific'
	};

	let form = {
		creatingMarket: true,
		step: 1,
		errors: {},
		isValid: true,
		takerFee: CONSTANTS.TAKER_FEE_DEFAULT,
		makerFee: CONSTANTS.MAKER_FEE_DEFAULT,
		initialLiquidity: CONSTANTS.INITIAL_LIQUIDITY_DEFAULT,
		expirySourceTypes: {
			generic: CONSTANTS.EXPIRY_SOURCE_GENERIC,
			specific: CONSTANTS.EXPIRY_SOURCE_SPECIFIC,
		},
		// Advanced Market Creation
		initialFairPrices: {},
		startingQuantity: CONSTANTS.STARTING_QUANTITY_DEFAULT,
		bestStartingQuantity: CONSTANTS.BEST_STARTING_QUANTITY_DEFAULT,
		priceWidth: CONSTANTS.PRICE_WIDTH_DEFAULT,
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

			form.takerFeePercent = makeNumber(form.takerFee, '%');
			form.makerFeePercent = makeNumber(form.makerFee, '%');
			form.initialLiquidityFormatted = makeNumber(form.initialLiquidity, 'ETH', true);
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
