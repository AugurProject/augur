import { augur } from 'services/augurjs';
import { augurSdk } from 'services/augursdk';
import logError from 'utils/log-error';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback } from 'modules/types';

export function loadCreateMarketHistory(
  options = {},
  marketIdAggregator: Function | undefined
) {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { universe, loginAccount } = getState();
    if (!loginAccount.address) return;
    const Augur = augurSdk.get();
    const universeId = universe.id;
    if (universeId) {
      const marketIds = await Augur.getMarkets({
        ...options,
        creator: loginAccount.address,
        universe: universeId,
      });
      if (marketIdAggregator) marketIdAggregator(marketIds);
    }
  };
}
