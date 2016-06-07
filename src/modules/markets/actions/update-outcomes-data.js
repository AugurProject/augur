export const UPDATE_OUTCOMES_DATA = 'UPDATE_OUTCOMES_DATA';

export function updateOutcomesData(outcomesData) {
	return { type: UPDATE_OUTCOMES_DATA, outcomesData };
}