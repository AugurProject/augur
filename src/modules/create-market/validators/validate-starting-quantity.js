import { formatShares } from '../../../utils/format-number';

export default function validateStartingQuantity(startingQuantity) {
    const parsed = parseFloat(startingQuantity);

    if (!startingQuantity) {
        return 'Please provide a starting quantity';
    }
    if (Number.isNaN(parsed) && !Number.isFinite(parsed)) {
        return 'Starting quantity must be numeric';
    }
    if (parsed < STARTING_QUANTITY_MIN) {
        return `Starting quantity must be at least ${
            formatShares(STARTING_QUANTITY_MIN).full
            }`;
    }
};