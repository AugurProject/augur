import { formatEther } from '../../../utils/format-number';
import { PRICE_WIDTH_MIN } from '../../create-market/constants/market-values-constraints';

export default function validatePriceWidth(priceWidth) {
	const parsed = parseFloat(priceWidth);

	if (!priceWidth) {
		return 'Please provide a price width';
	}
	if (Number.isNaN(parsed) && !Number.isFinite(parsed)) {
		return 'Price width must be numeric';
	}
	if (parsed < PRICE_WIDTH_MIN) {
		return `Price width must be at least ${formatEther(PRICE_WIDTH_MIN).full}`;
	}
}
