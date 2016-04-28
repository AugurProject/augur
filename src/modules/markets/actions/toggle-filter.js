import { showLink } from '../../link/actions/show-link';
import { prepareUrl } from '../../markets/utils/markets-utils';

export const TOGGLE_FILTER = 'TOGGLE_FILTER';

export function toggleFilter(filterID) {
	return (dispatch, getState) => {
		dispatch({type: TOGGLE_FILTER, filterID});

		dispatch(showLink(prepareUrl(getState())));
	}
}