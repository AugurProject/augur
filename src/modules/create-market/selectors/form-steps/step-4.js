import {
	BINARY,
	CATEGORICAL,
	SCALAR
} from '../../../markets/constants/market-types';
import {
	TAKER_FEE_DEFAULT,
	INITIAL_LIQUIDITY_DEFAULT,
	MAKER_FEE_DEFAULT,
	STARTING_QUANTITY_DEFAULT,
	BEST_STARTING_QUANTITY_DEFAULT,
	PRICE_WIDTH_DEFAULT,
	PRICE_DEPTH_DEFAULT,
	IS_SIMULATION
} from '../../../create-market/constants/market-values-constraints';
import { abi, constants } from '../../../../services/augurjs';
import { ONE, TWO } from '../../../trade/constants/numbers';
import validateTakerFee from '../../validators/validate-taker-fee';
import validateMakerFee from '../../validators/validate-maker-fee';
import validateInitialLiquidity from '../../validators/validate-initial-liquidity';
import validateInitialFairPrices from '../../validators/validate-initial-fair-prices';
import validateBestStartingQuantity from '../../validators/validate-best-starting-quantity';
import validateStartingQuantity from '../../validators/validate-starting-quantity';
import validatePriceWidth from '../../validators/validate-price-width';

export const select = (formState) => {
	let obj = {
		takerFee: formState.takerFee || TAKER_FEE_DEFAULT,
		makerFee: formState.makerFee || MAKER_FEE_DEFAULT
	};

	if (formState.isCreatingOrderBook) {
		obj = {
			...obj,
			initialLiquidity: formState.initialLiquidity || INITIAL_LIQUIDITY_DEFAULT,
			initialFairPrices: !!formState.initialFairPrices.raw.length ? formState.initialFairPrices : { ...formState.initialFairPrices, ...initialFairPrices(formState) },
			startingQuantity: formState.startingQuantity || STARTING_QUANTITY_DEFAULT,
			bestStartingQuantity: formState.bestStartingQuantity || BEST_STARTING_QUANTITY_DEFAULT,
			priceWidth: formState.priceWidth || PRICE_WIDTH_DEFAULT,
			halfPriceWidth: !!formState.priceWidth ? abi.bignum(formState.priceWidth).dividedBy(TWO).toNumber() : abi.bignum(PRICE_WIDTH_DEFAULT).dividedBy(TWO).toNumber(),
			priceDepth: PRICE_DEPTH_DEFAULT,
			isSimulation: formState.isSimulation || IS_SIMULATION
		};
	}

	return obj;
};

export const initialFairPrices = (formState) => {
	const setInitialFairPrices = (labels) => {
		const halfPriceWidth = abi.bignum(PRICE_WIDTH_DEFAULT).dividedBy(TWO);
		const numOutcomes = formState.type === CATEGORICAL ?
			abi.bignum(formState.categoricalOutcomes.length) : TWO;
		// Sets the initialFairPrices to midpoint of min/max
		const defaultValue = formState.type === SCALAR ?
					(abi.bignum(formState.scalarBigNum).plus(halfPriceWidth))
						.plus(abi.bignum(formState.scalarSmallNum).minus(halfPriceWidth))
						.dividedBy(TWO)
						.round(constants.PRECISION.decimals)
						.toNumber() :
					halfPriceWidth.neg()
						.plus(ONE)
						.plus(halfPriceWidth)
						.dividedBy(numOutcomes)
						.round(constants.PRECISION.decimals)
						.toNumber();

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
	if (validateTakerFee(formState.takerFee) ||
		validateMakerFee(formState.makerFee, formState.takerFee) ||
		(!!formState.isCreatingOrderBook && (
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
			validatePriceWidth(formState.priceWidth)
		))
	) {
		return false;
	}

	return true;
};

export const errors = (formState) => {
	const errs = {};

	if (formState.hasOwnProperty('takerFee')) {
		errs.takerFee = validateTakerFee(formState.takerFee);
	}
	if (formState.hasOwnProperty('makerFee')) {
		errs.makerFee = validateMakerFee(formState.makerFee, formState.takerFee);
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
