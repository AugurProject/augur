import BigNumber from 'bignumber.js';

BigNumber.config({
	MODULO_MODE: BigNumber.EUCLID,
	ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1, 10);
export const TWO = new BigNumber(2, 10);
export const TEN = new BigNumber(10, 10);
