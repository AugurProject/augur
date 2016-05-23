export const UPDATE_BIDSASKS_DATA = 'UPDATE_BIDSASKS_DATA';

export function updateBidsAsks(bidsAsksData) {
	return { type: UPDATE_BIDSASKS_DATA, bidsAsksData };
}
