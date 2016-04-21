export const TOGGLE_FILTER = 'TOGGLE_FILTER';

export function toggleFilter(filterID) {
	return { type: TOGGLE_FILTER, filterID };
}