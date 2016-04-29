import { showLink } from '../../link/actions/show-link';
import { prepareUrl } from '../../markets/utils/markets-utils';

export const UPDATE_SELECTED_PAGE_NUM = 'UPDATE_SELECTED_PAGE_NUM';

export function updateSelectedPageNum(selectedPageNum) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_SELECTED_PAGE_NUM, selectedPageNum });

		dispatch(showLink(prepareUrl(getState())));
	};
}
