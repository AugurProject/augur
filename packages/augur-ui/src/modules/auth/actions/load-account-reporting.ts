import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { AppState } from 'appStore';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { NodeStyleCallback } from 'modules/types';

export const loadAccountReportingHistory = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  if (!loginAccount || !loginAccount.address) return;
  const Augur = augurSdk.get();
  const reporting = await Augur.getAccountRepStakeSummary({
    universe: universe.id,
    account: loginAccount.address,
  });
  // pull all markets from reporting, disputing.
  const marketIds = [];
  if (reporting.reporting && reporting.reporting.contracts.length > 0)
    reporting.reporting.contracts.map(c => [...marketIds, c.marketId]);
  if (reporting.disputing && reporting.disputing.contracts.length > 0)
    reporting.disputing.contracts.map(c => [...marketIds, c.marketId]);

  dispatch(updateLoginAccount({ reporting }));
};

export const loadAccountCurrentDisputeHistory = async (
  marketId: string,
  userAccount: string,
  callback: NodeStyleCallback
) => {
  let disputeValues = [];
  const Augur = augurSdk.get();
  try {
     disputeValues = await Augur.getUserCurrentDisputeStake({
      marketId,
      account: userAccount,
    });
  } catch(e) {
    return callback(e);
  }
  callback(null, disputeValues);
};
