import { formatPercent } from '../../../utils/format-number';
import { MAKER_FEE_MIN, MAKER_FEE_MAX } from '../../create-market/constants/market-values-constraints';

export default function (makerFee) {
	const parsed = parseFloat(makerFee);

	if (!makerFee) {
		return 'Please specify a maker fee %';
	}
	if (Number.isNaN(parsed) && !Number.isFinite(parsed)) {
		return 'Maker fee must be a number';
	}
	if (parsed < MAKER_FEE_MIN || parsed > MAKER_FEE_MAX) {
		return `Maker fee must be between ${
			formatPercent(MAKER_FEE_MIN, true).full
			} and ${
			formatPercent(MAKER_FEE_MAX, true).full
			}`;
	}
}
