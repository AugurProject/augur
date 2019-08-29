import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { AppState } from 'store';
import { updateLoginAccount } from 'modules/account/actions/login-account';

export const loadAccountReportingHistory = (marketIdAggregator: Function) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  const Augur = augurSdk.get();
  const reporting = await Augur.getAccountReportingHistory({
    universe: universe.id,
    account: loginAccount.address,
  });
  // pull all markets from reporting, disputing.
  const marketIds = [];
  if (reporting.reporting && reporting.reporting.contracts.length > 0)
    reporting.reporting.contracts.map(c => [...marketIds, c.marketId]);
  if (reporting.disputing && reporting.disputing.contracts.length > 0)
    reporting.disputing.contracts.map(c => [...marketIds, c.marketId]);
  // TODO: when we get real data pass to market id aggregator
  if (marketIdAggregator) marketIdAggregator([]);

  dispatch(updateLoginAccount({ reporting }));
};
