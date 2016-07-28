/*
 * Author: priecint
 */
export const UPDATE_SELECTED_OUTCOME = 'UPDATE_SELECTED_OUTCOME';

export default (selectedOutcomeID) => {
	return { type: UPDATE_SELECTED_OUTCOME, selectedOutcomeID };
};
