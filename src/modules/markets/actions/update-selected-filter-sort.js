import { updateURL } from 'modules/link/actions/update-url';

export const UPDATE_SELECTED_FILTER_SORT = 'UPDATE_SELECTED_FILTER_SORT';

export function updateSelectedFilterSort(selectedFilterSort) {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_SELECTED_FILTER_SORT, selectedFilterSort });

    const links = require('modules/link/selectors/links');
    dispatch(updateURL(links.default().marketsLink.href));
  };
}
