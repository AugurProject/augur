import { showLink } from '../../link/actions/show-link';
import { prepareUrl } from '../../markets/utils/markets-utils';

export const UPDATE_SELECTED_SORT = 'UPDATE_SELECTED_SORT';

export function updateSelectedSort(selectedSort) {
	return (dispatch, getState) => {
		dispatch({type: UPDATE_SELECTED_SORT, selectedSort});

		dispatch(showLink(prepareUrl(getState())));
	}
}
