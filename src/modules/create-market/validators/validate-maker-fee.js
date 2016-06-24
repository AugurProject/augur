import { formatPercent } from '../../../utils/format-number';
import { MAKER_FEE_MIN } from '../../create-market/constants/market-values-constraints';

export default function (makerFee, takerFee) {
	const parsedMakerFee = parseFloat(makerFee);
	const parsedHalfTakerFee = parseFloat(takerFee / 2);

	if (!makerFee) {
		return 'Please specify a maker fee %';
	}
	if (Number.isNaN(parsedMakerFee) && !Number.isFinite(parsedMakerFee)) {
		return 'Maker fee must be a number';
	}
	if (parsedMakerFee < MAKER_FEE_MIN || parsedMakerFee > parsedHalfTakerFee) {
		return `Maker fee must be between ${
			formatPercent(MAKER_FEE_MIN, true).full
			} and ${
			formatPercent(parsedHalfTakerFee, true).full
			}`;
	}
}
