import { formatEther } from '../../../utils/format-number';
import { abi } from '../../../services/augurjs';
import { ONE, TWO } from '../../trade/constants/numbers';
import { SCALAR } from '../../markets/constants/market-types';
import { INITIAL_LIQUIDITY_MIN } from '../../create-market/constants/market-values-constraints';

export default function validateInitialLiquidity(type, liquidity, start, best, halfWidth, scalarMin, scalarMax) {
	const parsed = parseFloat(liquidity);
	let priceDepth;
	if (isNaN(parsed)) {
		priceDepth = NaN;
	} else if (type === SCALAR) {
		priceDepth = abi.bignum(start)
				.times(abi.bignum(scalarMin).plus(abi.bignum(scalarMax)).minus(abi.bignum(halfWidth)))
				.dividedBy(abi.bignum(liquidity).minus(TWO.times(abi.bignum(best))))
				.toNumber();
	} else {
		priceDepth = abi.bignum(start)
				.times(ONE.minus(abi.bignum(halfWidth)))
				.dividedBy(abi.bignum(liquidity).minus(TWO.times(abi.bignum(best))))
				.toNumber();
	}

	if (!liquidity) {
		return 'Please provide some initial liquidity';
	}
	if (Number.isNaN(parsed) && !Number.isFinite(parsed)) {
		return 'Initial liquidity must be numeric';
	}
	if (priceDepth < 0 || !Number.isFinite(priceDepth)) {
		return 'Insufficient liquidity based on advanced parameters';
	}
	if (parsed < INITIAL_LIQUIDITY_MIN) {
		return `Initial liquidity must be at least ${
			formatEther(INITIAL_LIQUIDITY_MIN).full
			}`;
	}
}
