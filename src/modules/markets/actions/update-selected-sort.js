export const UPDATE_SELECTED_SORT = 'UPDATE_SELECTED_SORT';

export function updateSelectedSort(selectedSort) {
	return { type: UPDATE_SELECTED_SORT, selectedSort};
}
