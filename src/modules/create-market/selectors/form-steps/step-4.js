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
	INITIAL_FAIR_PRICE_DEFAULT,
	SHARES_PER_ORDER_DEFAULT,
	SIZE_OF_BEST_DEFAULT,
	PRICE_WIDTH_DEFAULT,
	SEPARATION_DEFAULT
} from '../../../create-market/constants/market-values-constraints';

export const select = (formState) => {
	const obj = {
		tradingFeePercent: formState.tradingFeePercent || TRADING_FEE_DEFAULT,
		makerFeePercent: formState.makerFeePercent || MAKER_FEE_DEFAULT,
		initialLiquidity: formState.initialLiquidity || INITIAL_LIQUIDITY_DEFAULT,
		initialFairPrice: formState.initialFairPrice || [],
		sharesPerOrder: formState.sharesPerOrder || SHARES_PER_ORDER_DEFAULT,
		sizeOfBest: formState.sizeOfBest || SIZE_OF_BEST_DEFAULT,
		priceWidth: formState.priceWidth || PRICE_WIDTH_DEFAULT,
		separation: formState.separation || SEPARATION_DEFAULT
	};

	return obj;
};



// Validators
export const validateTradingFee = (tradingFeePercent) => {
	const parsed = parseFloat(tradingFeePercent);

	if (!tradingFeePercent)
		return 'Please specify a trading fee %';
	if (Number.isNaN(parsed) && !Number.isFinite(parsed))
		return 'Trading fee must be a number';
	if (parsed < TRADING_FEE_MIN || parsed > TRADING_FEE_MAX)
		return `Trading fee must be between ${ 
				formatPercent(TRADING_FEE_MIN, true).full
			} and ${
				formatPercent(TRADING_FEE_MAX, true).full
			}`;
};

export const validateMakerFee = (makerFeePercent) => {
	const parsed = parseFloat(makerFeePercent);

	if(!makerFeePercent)
		return 'Please specify a maker fee %';
	if(parsed !== makerFeePercent)
		return 'Maker fee must be as number';
	if(parsed < MAKER_FEE_MIN || parsed > MAKER_FEE_MAX)
		return `Maker fee must be between 
			${formatPercent(MAKER_FEE_MIN, true).full
			} and ${
			formatPercent(MAKER_FEE_MAX, true).full}`
};

export const validateMarketInvestment = (initialLiquidity) => {
	const parsed = parseFloat(initialLiquidity);
	if (!initialLiquidity) {
		return 'Please provide some initial liquidity';
	if(Number.isNaN(parsed) && !Number.isFinite(parsed))
		return 'Initial liquidity must be numeric';
	if(priceDepth < 0 || !Number.isFinite(priceDepth))
		return 'Insufficient liquidity based on advanced parameters';
	if (parsed < INITIAL_LIQUIDITY_MIN)
		return `Initial liquidity must be at least ${
			formatEther(INITIAL_LIQUIDITY_MIN).full
		}`;
};

export const validateInitialFairPrices = (type, initialFairPrices, width, halfWidth, scalarMin, scalarMax) => {
	// -- Constraints --
	// 	Binary + Categorical:
	//		min: priceWidth / 2
	//  	max: 1 - (priceWidth / 2)
	// 	Scalar:
	// 		min: scalarMin + (priceWidth / 2)
	// 		max: scalarMax - (priceWidth / 2)

	const 	max = type === SCALAR ? parseFloat(scalarMax) - halfWidth : 1 - halfWidth,
			min = type === SCALAR ? parseFloat(scalarMin) + halfWidth : halfWidth;

	let fairPriceErrors = {};

	initialFairPrices.map((cV, i) => {
		const parsed = parseFloat(cV)

		if(!cV)
			fairPriceErrors[`${i}`] = 'Please provide some initial liquidity';
		if(Number.isNaN(parsed) && !Number.isFinite(parsed))
			fairPriceErrors[`${i}`] = 'Initial liquidity must be numeric';
		if(cV < min || cV > max)
			fairPriceErrors[`${i}`] = `Initial prices must be between ${min} - ${max} based on the price width of ${width}`
	});

	if(!!Object.keys(fairPriceErrors).length)
		return fairPriceErrors
};

export const validateBestStartingQuantity = (bestStartingQuantity) => {
	const parsed = parseFloat(bestStartingQuantity);

	if(!bestStartingQuantity)
		return 'Please provide a best starting quantity';
	if(Number.isNaN(parsed) && !Number.isFinite(parsed))
		return 'Best starting quantity must be numeric';
	if(parsed < BEST_STARTING_QUANTITY_MIN)
		return `Starting quantity must be at least ${formatShares(BEST_STARTING_QUANTITY_MIN).full}`;
};

export const validateStartingQuantity = (startingQuantity) => {
	const parsed = parseFloat(startingQuantity);

	if(!startingQuantity)
		return 'Please provide a starting quantity';
	if(Number.isNaN(parsed) && !Number.isFinite(parsed))
		return 'Starting quantity must be numeric';
	if(parsed < STARTING_QUANTITY_MIN)
		return `Starting quantity must be at least ${
			formatShares(STARTING_QUANTITY_MIN).full
		}`;
};

export const validatePriceWidth = (priceWidth) => {
	const parsed = parseFloat(priceWidth);

	if (!priceWidth)
		return 'Please provide a price width';
	if (Number.isNaN(parsed) && !Number.isFinite(parsed))
		return 'Price width must be numeric';
	if (parsed < PRICE_WIDTH_MIN) {
		return `Price width must be at least ${formatEther(PRICE_WIDTH_MIN).full}`;
	}
};

export const isValid = (formState) => {
	if(	validateTradingFee(formState.tradingFeePercent) 				||
		validateMakerFee(formState.makerFee) 							||
		validateInitialLiquidity(
			formState.type,
			formState.initialLiquidity,
			formState.startingQuantity,
			formState.bestStartingQuantity,
			formState.halfPriceWidth,
			formState.scalarSmallNum,
			formState.scalarBigNum
		)																||
		validateInitialFairPrices(
			formState.type,
			formState.initialFairPrices.raw,
			formState.priceWidth,
			formState.halfPriceWidth,
			formState.scalarSmallNum,
			formState.scalarBigNum
		)																||
		validateBestStartingQuantity(formState.bestStartingQuantity)	||
		validateStartingQuantity(formState.startingQuantity)			||
		validatePriceWidth(formState.priceWidth))
		return false;

	return true;
};

export const errors = (formState) => {
	const errs = {};

	if(formState.hasOwnProperty('tradingFeePercent'))
		errs.tradingFeePercent = validateTradingFee(formState.tradingFeePercent);
	if(formState.hasOwnProperty('makerFeePercent'))
		errs.makerFee = validateMakerFee(formState.makerFee);
	if(formState.hasOwnProperty('initialLiquidity'))
		errs.initialLiquidity = validateInitialLiquidity(
			formState.type,
			formState.initialLiquidity,
			formState.startingQuantity,
			formState.bestStartingQuantity,
			formState.halfPriceWidth,
			formState.scalarSmallNum,
			formState.scalarBigNum
		);
	if(formState.hasOwnProperty('initialFairPrices'))
		errs.initialFairPrice = validateInitialFairPrices(
			formState.type,
			formState.initialFairPrices.raw,
			formState.priceWidth,
			formState.halfPriceWidth,
			formState.scalarSmallNum,
			formState.scalarBigNum
		);
	if(formState.hasOwnProperty('bestStartingQuantity'))
		errs.bestStartingQuantity = validateBestStartingQuantity(formState.bestStartingQuantity);
	if(formState.hasOwnProperty('startingQuantity'))
		errs.startingQuantity = validateStartingQuantity(formState.startingQuantity);
	if(formState.hasOwnProperty('priceWidth'))
		errs.priceWidth = validatePriceWidth(formState.priceWidth);

	return errs;
};
