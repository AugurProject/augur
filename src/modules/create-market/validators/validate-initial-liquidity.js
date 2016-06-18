import { formatEther } from '../../../utils/format-number';

export default function validateInitialLiquidity(type, liquidity, start, best, halfWidth, scalarMin, scalarMax) {
    const	parsed = parseFloat(liquidity);
    const	priceDepth = type === SCALAR ?
    (parseFloat(start) * (parseFloat(scalarMin) + parseFloat(scalarMax) - halfWidth)) / (parseFloat(liquidity) - (2 * parseFloat(best))) :
    (parseFloat(start) * (1 - halfWidth)) / (parseFloat(liquidity) - (2 * parseFloat(best)));

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
};