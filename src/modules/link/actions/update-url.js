import { loadFullMarket } from 'modules/market/actions/load-full-market';
import { loadMarkets } from 'modules/markets/actions/load-markets';
import { loadMarketsByTopic } from 'modules/markets/actions/load-markets-by-topic';

import { MARKETS, AUTHENTICATION, TOPICS } from 'modules/app/constants/views';
import authenticatedViews from 'modules/app/constants/authenticated-views';

import getValue from 'utils/get-value';
// import setTitle from 'utils/set-title';
import { parseURL, makeLocation } from 'utils/parse-url';

export const UPDATE_URL = 'UPDATE_URL';

// `title` options:
// Pass in: sets passed in title
// Pass in `false`: skips setting title
// null/undefined: sets respective default title
export function updateURL(url, title, branchID) {
  return (dispatch, getState) => {
  //   const parsedURL = parseURL(url);
  //   const { branch, hasLoadedMarkets, hasLoadedTopic, loginAccount, selectedMarketID, connection } = getState();
  //
  //   if (!loginAccount.address && authenticatedViews.indexOf(parsedURL.searchParams.page) !== -1) { //  Reroute the user if they are unauthenticated and attempting to traverse to authenticated views
  //     dispatch(updateURL(makeLocation({ page: AUTHENTICATION }).url));
  //   } else if (loginAccount.address && parsedURL.searchParams.page === AUTHENTICATION) { // Reroute the user if they are authenticated and attempting to traverse to auth view
  //     dispatch(updateURL(makeLocation({ page: TOPICS }).url));
  //   } else {
  //     dispatch({ type: UPDATE_URL, parsedURL });
  //
  //     window.history.pushState(null, null, parsedURL.url);
  //
  //     if (title) {
  //       setTitle(title);
  //     } else if (title !== false) {
  //       setTitle(null, (parsedURL.searchParams || null));
  //     }
  //   }
  //
  //   // Handle additional actions related to route changes
  //   //  Load full market data for selected market
  //   if (selectedMarketID) {
  //     dispatch(loadFullMarket(selectedMarketID));
  //   }
  //   //  Load respective markets (all or topic constrained)
  //   if (parsedURL.searchParams.page === MARKETS && connection.isConnected && (branchID || branch.id)) {
  //     const parsedURL = parseURL(url);
  //     const topic = getValue(parsedURL, 'searchParams.topic');
  //
  //     if (!topic && !hasLoadedMarkets) dispatch(loadMarkets(branchID || branch.id));
  //     if (topic && !hasLoadedTopic[topic]) dispatch(loadMarketsByTopic(topic, branchID || branch.id));
  //   }
  };
}
