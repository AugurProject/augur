import {
	formatEther,
	formatPercent,
	formatShares
} from '../../../../utils/format-number';
import {
	BINARY,
	CATEGORICAL,
	SCALAR
} from '../../../markets/constants/market-types';
import {
	TRADING_FEE_DEFAULT,
	TRADING_FEE_MIN,
	TRADING_FEE_MAX,
	INITIAL_LIQUIDITY_DEFAULT,
	INITIAL_LIQUIDITY_MIN,
	MAKER_FEE_DEFAULT,
	MAKER_FEE_MIN,
	MAKER_FEE_MAX,
	STARTING_QUANTITY_DEFAULT,
	STARTING_QUANTITY_MIN,
	BEST_STARTING_QUANTITY_DEFAULT,
	BEST_STARTING_QUANTITY_MIN,
	PRICE_WIDTH_DEFAULT,
	PRICE_WIDTH_MIN,
	PRICE_DEPTH_DEFAULT,
	IS_SIMULATION
} from '../../../create-market/constants/market-values-constraints';

import validateTradingFee from '../../validators/validate-trading-fee';
import validateMakerFee from '../../validators/validate-maker-fee';
import validateInitialLiquidity from '../../validators/validate-initial-liquidity';
import validateInitialFairPrices from '../../validators/validate-initial-fair-prices';
import validateBestStartingQuantity from '../../validators/validate-best-starting-quantity';
import validateStartingQuantity from '../../validators/validate-starting-quantity';
import validatePriceWidth from '../../validators/validate-price-width';

export const select = (formState) => {
	const obj = {
		tradingFeePercent: formState.tradingFeePercent || TRADING_FEE_DEFAULT,
		makerFee: formState.makerFee || MAKER_FEE_DEFAULT,
		initialLiquidity: formState.initialLiquidity || INITIAL_LIQUIDITY_DEFAULT,
		initialFairPrices: !!formState.initialFairPrices.raw.length ? formState.initialFairPrices : { ...formState.initialFairPrices, ...initialFairPrices(formState) },
		startingQuantity: formState.startingQuantity || STARTING_QUANTITY_DEFAULT,
		bestStartingQuantity: formState.bestStartingQuantity || BEST_STARTING_QUANTITY_DEFAULT,
		priceWidth: formState.priceWidth || PRICE_WIDTH_DEFAULT,
		halfPriceWidth: !!formState.priceWidth ? parseFloat(formState.priceWidth) / 2 : PRICE_WIDTH_DEFAULT / 2,
		priceDepth: PRICE_DEPTH_DEFAULT,
		isSimulation: formState.isSimulation || IS_SIMULATION
	};

	return obj;
};

export const initialFairPrices = (formState) => {
	const setInitialFairPrices = (labels) => {
		const halfPriceWidth = PRICE_WIDTH_DEFAULT / 2;
		const defaultValue = formState.type === SCALAR ? // Sets the initialFairPrices to midpoint of min/max
					((parseFloat(formState.scalarBigNum) + halfPriceWidth) + (parseFloat(formState.scalarSmallNum) - halfPriceWidth)) / 2 :
					((1 - halfPriceWidth) + (halfPriceWidth)) / 2;

		const values = [];
		const raw = [];

		labels.map((cV, i) => {
			values[i] = {
				label: cV,
				value: defaultValue
			};
			raw[i] = defaultValue;
			return cV;
		});

		return { values, raw };
	};
	const labels = [];
	switch (formState.type) {
	case BINARY:
		return setInitialFairPrices(['Yes', 'No']);
	case SCALAR:
		return setInitialFairPrices(['⇧', '⇩']);
	case CATEGORICAL:

		formState.categoricalOutcomes.map((val, i) => {
			labels[i] = val;
			return val;
		});

		return setInitialFairPrices(labels);

	default:
		break;
	}
};

export const isValid = (formState) => {
	if (validateTradingFee(formState.tradingFeePercent) ||
		validateMakerFee(formState.makerFee) ||
		validateInitialLiquidity(
			formState.type,
			formState.initialLiquidity,
			formState.startingQuantity,
			formState.bestStartingQuantity,
			formState.halfPriceWidth,
			formState.scalarSmallNum,
			formState.scalarBigNum
		)	||
		validateInitialFairPrices(
			formState.type,
			formState.initialFairPrices.raw,
			formState.priceWidth,
			formState.halfPriceWidth,
			formState.scalarSmallNum,
			formState.scalarBigNum
		)	||
		validateBestStartingQuantity(formState.bestStartingQuantity) ||
		validateStartingQuantity(formState.startingQuantity)	||
		validatePriceWidth(formState.priceWidth)) {
		return false;
	}
	return true;
};

export const errors = (formState) => {
	const errs = {};

	if (formState.hasOwnProperty('tradingFeePercent')) {
		errs.tradingFeePercent = validateTradingFee(formState.tradingFeePercent);
	}
	if (formState.hasOwnProperty('makerFeePercent')) {
		errs.makerFee = validateMakerFee(formState.makerFee);
	}
	if (formState.hasOwnProperty('initialLiquidity')) {
		errs.initialLiquidity = validateInitialLiquidity(
			formState.type,
			formState.initialLiquidity,
			formState.startingQuantity,
			formState.bestStartingQuantity,
			formState.halfPriceWidth,
			formState.scalarSmallNum,
			formState.scalarBigNum
		);
	}
	if (formState.hasOwnProperty('initialFairPrices')) {
		errs.initialFairPrice = validateInitialFairPrices(
			formState.type,
			formState.initialFairPrices.raw,
			formState.priceWidth,
			formState.halfPriceWidth,
			formState.scalarSmallNum,
			formState.scalarBigNum
		);
	}
	if (formState.hasOwnProperty('bestStartingQuantity')) {
		errs.bestStartingQuantity = validateBestStartingQuantity(formState.bestStartingQuantity);
	}
	if (formState.hasOwnProperty('startingQuantity')) {
		errs.startingQuantity = validateStartingQuantity(formState.startingQuantity);
	}
	if (formState.hasOwnProperty('priceWidth')) {
		errs.priceWidth = validatePriceWidth(formState.priceWidth);
	}
	return errs;
};
