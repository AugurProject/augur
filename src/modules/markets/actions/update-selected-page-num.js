import { updateURL } from 'modules/link/actions/update-url';

export const UPDATE_SELECTED_PAGE_NUM = 'UPDATE_SELECTED_PAGE_NUM';

export function updateSelectedPageNum(selectedPageNum, href) {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_SELECTED_PAGE_NUM, selectedPageNum });
    dispatch(updateURL(href));
  };
}
