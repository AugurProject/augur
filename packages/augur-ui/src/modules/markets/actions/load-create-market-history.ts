import { augurSdk } from 'services/augursdk';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { updateMarketsData } from './update-markets-data';
import { keyMarketInfoCollectionByMarketId } from 'utils/convert-marketInfo-marketData';
import { AppStatus } from 'modules/app/store/app-status';

export function loadCreateMarketHistory() {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const {
      loginAccount: { address: creator },
      universe: { id: universe },
    } = AppStatus.get();
    if (!creator) return;
    const Augur = augurSdk.get();

    if (universe) {
      const marketList = await Augur.getMarkets({
        creator,
        universe,
      });
      const marketInfos = keyMarketInfoCollectionByMarketId(marketList.markets);
      dispatch(updateMarketsData(marketInfos));
    }
  };
}
