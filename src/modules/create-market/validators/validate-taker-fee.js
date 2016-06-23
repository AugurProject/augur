import { formatPercent } from '../../../utils/format-number';
import { TAKER_FEE_MIN, TAKER_FEE_MAX } from '../../create-market/constants/market-values-constraints';

export default function (takerFee) {
	const parsed = parseFloat(takerFee);

	if (!takerFee) {
		return 'Please specify a trading fee %';
	}
	if (Number.isNaN(parsed) && !Number.isFinite(parsed)) {
		return 'Trading fee must be a number';
	}
	if (parsed < TAKER_FEE_MIN || parsed > TAKER_FEE_MAX) {
		return `Trading fee must be between ${
			formatPercent(TAKER_FEE_MIN, true).full
			} and ${
			formatPercent(TAKER_FEE_MAX, true).full
			}`;
	}
}
