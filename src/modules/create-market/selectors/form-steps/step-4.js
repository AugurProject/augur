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
	PRICE_DEPTH_DEFAULT
} from '../../../create-market/constants/market-values-constraints';

export const select = (formState) => {
	const obj = {
		tradingFeePercent: formState.tradingFeePercent || TRADING_FEE_DEFAULT,
		makerFeePercent: formState.makerFeePercent || MAKER_FEE_DEFAULT,
		initialLiquidity: formState.initialLiquidity || INITIAL_LIQUIDITY_DEFAULT,
		initialFairPrices: !!formState.initialFairPrices.values ? formState.initialFairPrices : { ...formState.initialFairPrices, ...initialFairPrices(formState)},
		sharesPerOrder: formState.sharesPerOrder || SHARES_PER_ORDER_DEFAULT,
		sizeOfBest: formState.sizeOfBest || SIZE_OF_BEST_DEFAULT,
		priceWidth: formState.priceWidth || PRICE_WIDTH_DEFAULT,
		priceDepth: formState.priceDepth || PRICE_DEPTH_DEFAULT
	};

	return obj;
};

export const initialFairPrices = (formState) => {
	const setInitialFairPrices = (labels) => {
		let values = [];

		labels.map((cV, i) => {
			values[i] = {
				label: cV,
				value: INITIAL_FAIR_PRICE_DEFAULT
			}
		})

		return { values }
	};

	switch(formState.type){
		case BINARY:
			return setInitialFairPrices(['Yes', 'No']);
		case SCALAR:
			return setInitialFairPrices(['⇧', '⇩']);
		case CATEGORICAL:
			let labels = [];

			formState.categoricalOutcomes.map((val, i) => {
				labels[i] = val;
			});

			return setInitialFairPrices(labels);

		default:
			break;
	}
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

	if (!initialLiquidity)
		return 'Please provide some initial liquidity';
	if (Number.isNaN(parsed) && !Number.isFinite(parsed))
		return 'Initial liquidity must be numeric';
	if (parsed < INITIAL_LIQUIDITY_MIN) {
		return `Initial liquidity must be at least ${
			formatEther(INITIAL_LIQUIDITY_MIN).full
		}`;
};

export const validateInitialFairPrices = (initialFairPrices) => {
	let fairPriceErrors = {};

	initialFairPrices.map((cV, i) => {
		const parsed = parseFloat(cV)

		if (!cV)
			fairPriceErrors[`${i}`] = 'Please provide some initial liquidity'
		if (Number.isNaN(parsed) && !Number.isFinite(parsed))
			fairPriceErrors[`${i}`] = 'Initial liquidity must be numeric'
		if (parsed < INITIAL_FAIR_PRICE_MIN)
			fairPriceErrors[`${i}`] = 	`Initial liquidity must be at least ${
											formatEther(INITIAL_FAIR_PRICE_MIN).full
										}`
	})

	if(!!Object.keys(fairPriceErrors).length)
		return fairPriceErrors
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

export const validateBestStartingQuantity = (bestStartingQuantity) => {
	const parsed = parseFloat(bestStartingQuantity);

	if(!bestStartingQuantity)
		return 'Please provide a best starting quantity';
	if(Number.isNaN(parsed) && !Number.isFinite(parsed))
		return 'Best starting quantity must be numeric';
	if(parsed < BEST_STARTING_QUANTITY_MIN)
		return `Starting quantity must be at least ${formatShares(BEST_STARTING_QUANTITY_MIN).full}`;
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
		validateMakerFees(formState.makerFees) 							||
		validateInitialLiquidity(formState.initialLiquidity)			||
		validateStartingQuantity(formState.startingQuantity)			||
		validateBestStartingQuantity(formState.bestStartingQuantity)	||
		validatePriceWidth(formState.priceWidth))
		return false;

	return true;
};

export const errors = (formState) => {
	const errs = {};

	if(formState.hasOwnProperty('tradingFeePercent'))
		errs.tradingFeePercent = validateTradingFee(formState.tradingFeePercent);
	if(formState.hasOwnProperty('makerFeePercent'))
		errs.makerFees = validateMakerFees(formState.makerFees);
	if(formState.hasOwnProperty('initialLiquidity'))
		errs.initialLiquidity = validateInitialLiquidity(formState.initialLiquidity);

	if(formState.hasOwnProperty('initialFairPrices'))
		errs.initialFairPrice = validateInitialFairPrices(formState.initialFairPrices.raw);
	if(formState.hasOwnProperty('startingQuantity'))
		errs.startingQuantity = validateStartingQuantity(formState.startingQuantity)
	if(formState.hasOwnProperty('bestStartingQuantity'))
		errs.bestStartingQuantity = validateBestStartingQuantity(formState.bestStartingQuantity)
	if(formState.hasOwnProperty('priceWidth'))
		errs.priceWidth = validatePriceWidth(formState.priceWidth)

	return errs;
};
