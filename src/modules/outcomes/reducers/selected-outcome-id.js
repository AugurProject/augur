/*
 * Author: priecint
 */
import { UPDATE_SELECTED_OUTCOME } from '../../outcomes/actions/update-selected-outcome';

export default (selectedOutcomeID = null, action) => {
	switch (action.type) {
	case UPDATE_SELECTED_OUTCOME:
		return action.selectedOutcomeID;
	default:
		return selectedOutcomeID;
	}
};
