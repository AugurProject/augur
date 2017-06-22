import { updateURL } from 'modules/link/actions/update-url';

export const TOGGLE_TAG = 'TOGGLE_TAG';

export function toggleTag(filterID) {
  return (dispatch, getState) => {
    dispatch({ type: TOGGLE_TAG, filterID });
    const links = require('modules/link/selectors/links'); // this has to be after the dispatch to get the new state
    dispatch(updateURL(links.default().marketsLink.href));
  };
}
