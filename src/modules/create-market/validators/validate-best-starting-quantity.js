import { formatShares } from '../../../utils/format-number';

import { BEST_STARTING_QUANTITY_MIN } from '../../create-market/constants/market-values-constraints';

export default function validateBestStartingQuantity(bestStartingQuantity) {
    const parsed = parseFloat(bestStartingQuantity);

    if (!bestStartingQuantity) {
        return 'Please provide a best starting quantity';
    }
    if (Number.isNaN(parsed) && !Number.isFinite(parsed)) {
        return 'Best starting quantity must be numeric';
    }
    if (parsed < BEST_STARTING_QUANTITY_MIN) {
        return `Starting quantity must be at least ${formatShares(BEST_STARTING_QUANTITY_MIN).full}`;
    }
};