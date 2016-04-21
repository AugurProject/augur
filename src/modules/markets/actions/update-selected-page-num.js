export const UPDATE_SELECTED_PAGE_NUM = 'UPDATE_SELECTED_PAGE_NUM';

export function updateSelectedPageNum(selectedPageNum) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_SELECTED_PAGE_NUM, selectedPageNum });
		window && window.scrollTo(0, 0);
	};
}

