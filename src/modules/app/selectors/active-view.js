import store from 'src/store';

import { loadMarkets } from 'modules/markets/actions/load-markets';

import { MARKETS } from 'modules/app/constants/views';

export default function () {
  const { activeView, marketsData, branch } = store.getState();

  if (activeView === MARKETS && Object.keys(marketsData).length === 0) {
    store.dispatch(loadMarkets(branch.id));
  }

  return activeView;
}
