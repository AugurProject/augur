import parseQuery from 'modules/app/helpers/parse-query';
import makeQuery from 'modules/app/helpers/make-query';

export const TOGGLE_TAG = 'TOGGLE_TAG';

export function toggleTag(filterID, location, history) {
  return (dispatch, getState) => {
    dispatch({ type: TOGGLE_TAG, filterID });

    const currentQuery = parseQuery(location.search);
    console.log('currentQuery -- ', currentQuery);
    // const links = require('modules/link/selectors/links'); // this has to be after the dispatch to get the new state
    // dispatch(updateURL(links.default().marketsLink.href));
  };
}
