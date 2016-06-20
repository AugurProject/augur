import { formatPercent } from '../../../utils/format-number';
import { TRADING_FEE_MIN, TRADING_FEE_MAX } from '../../create-market/constants/market-values-constraints';

export default function (tradingFeePercent) {
	const parsed = parseFloat(tradingFeePercent);

	if (!tradingFeePercent) {
		return 'Please specify a trading fee %';
	}
	if (Number.isNaN(parsed) && !Number.isFinite(parsed)) {
		return 'Trading fee must be a number';
	}
	if (parsed < TRADING_FEE_MIN || parsed > TRADING_FEE_MAX) {
		return `Trading fee must be between ${
			formatPercent(TRADING_FEE_MIN, true).full
			} and ${
			formatPercent(TRADING_FEE_MAX, true).full
			}`;
	}
}
