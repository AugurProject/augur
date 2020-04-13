import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { AppState } from 'appStore';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { NodeStyleCallback } from 'modules/types';
import { NOTIFICATION_TYPES } from 'modules/common/constants';
import { updateReadNotifications } from 'modules/notifications/actions/update-notifications';
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';

export const loadAccountReportingHistory = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount, readNotifications } = getState();
  if (!loginAccount || !loginAccount.address) return;
  const Augur = augurSdk.get();
  const reporting = await Augur.getAccountRepStakeSummary({
    universe: universe.id,
    account: loginAccount.address,
  });
  // pull all markets from reporting, disputing.
  let marketIds = [];
  if (reporting.reporting && reporting.reporting.contracts.length > 0)
    marketIds = reporting.reporting.contracts.map(c => c.marketId);
  if (reporting.disputing && reporting.disputing.contracts.length > 0)
    marketIds = reporting.disputing.contracts.map(c => c.marketId);

  const notification = readNotifications.find(n => n.type === NOTIFICATION_TYPES.claimReportingFees);
  if (notification) {
    dispatch(updateReadNotifications([{...notification, isImportant: true, isNew: true}]))
  }
  dispatch(updateLoginAccount({ reporting }));

  if (marketIds.length > 0) dispatch(loadMarketsInfoIfNotLoaded(marketIds));
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
