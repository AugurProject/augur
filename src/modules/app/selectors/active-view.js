import store from 'src/store';

import { loadMarkets } from 'modules/markets/actions/load-markets';
import { loadMarketsByTopic } from 'modules/markets/actions/load-markets-by-topic';

import { parseURL } from 'utils/parse-url';
import getValue from 'utils/get-value';

import { MARKETS } from 'modules/app/constants/views';

export default function () {
  const { activeView, branch, url, hasLoadedMarkets, hasLoadedTopic, connection } = store.getState();

  const parsedURL = parseURL(url);
  const topic = getValue(parsedURL, 'searchParams.topic');

  // Load relevant markets
  if (activeView === MARKETS && connection.isConnected && branch.id) {
    if (!topic && !hasLoadedMarkets) {
      store.dispatch(loadMarkets(branch.id));
    }
    if (topic && !hasLoadedTopic[topic]) {
      store.dispatch(loadMarketsByTopic(topic));
    }
  }

  return activeView;
}
