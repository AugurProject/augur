import { updateURL } from 'modules/link/actions/update-url';

export const UPDATE_KEYWORDS = 'UPDATE_KEYWORDS';

export function updateKeywords(keywords) {
  return (dispatch, getState) => {
    dispatch({ type: UPDATE_KEYWORDS, keywords });
    const links = require('modules/link/selectors/links');
    dispatch(updateURL(links.default().marketsLink.href));
  };
}
