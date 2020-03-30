import { augurSdk } from 'services/augursdk';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { updateMarketsData } from './update-markets-data';
import { keyMarketInfoCollectionByMarketId } from 'utils/convert-marketInfo-marketData';

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
      const marketInfos = keyMarketInfoCollectionByMarketId(marketList.markets);
      dispatch(updateMarketsData(marketInfos));
    }
  };
}
