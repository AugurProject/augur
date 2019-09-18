import { augurSdk } from 'services/augursdk';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { updateMarketsData } from './update-markets-data';
import { keyBy } from 'utils/key-by';

export function loadCreateMarketHistory() {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { universe, loginAccount } = getState();
    if (!loginAccount.address) return;
    const Augur = augurSdk.get();
    const universeId = universe.id;
    if (universeId) {
      const marketList = await Augur.getMarkets({
        creator: loginAccount.address,
        universe: universeId,
      });
      const marketInfos = keyBy(marketList.markets, 'id');
      dispatch(updateMarketsData(marketInfos));
    }
  };
}
