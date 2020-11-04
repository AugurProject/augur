import { augurSdk } from 'services/augursdk';
import { NodeStyleCallback } from 'modules/types';
import { NOTIFICATION_TYPES } from 'modules/common/constants';
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';
import { AppStatus } from 'modules/app/store/app-status';

export const loadAccountReportingHistory = () => {
  loadReportingHistory();
};

async function loadReportingHistory() {
  const { notifications, loginAccount: { address }, universe } = AppStatus.get();
  const { updateLoginAccount, updateNotifications } = AppStatus.actions;
  if (!address) return;
  const Augur = augurSdk.get();
  const reporting = await Augur.getAccountRepStakeSummary({
    universe: universe.id,
    account: address,
  });
  // pull all markets from reporting, disputing.
  let marketIds = [];
  if (reporting.reporting && reporting.reporting.contracts.length > 0)
    marketIds = reporting.reporting.contracts.map(c => c.marketId);
  if (reporting.disputing && reporting.disputing.contracts.length > 0)
    marketIds = reporting.disputing.contracts.map(c => c.marketId);

  const notification = notifications.find(n => n.type === NOTIFICATION_TYPES.claimReportingFees);
  if (notification) {
    updateNotifications([{...notification, isImportant: true, isNew: true, isRead: false}]);
  }
  updateLoginAccount({ reporting });
  if (marketIds.length > 0) loadMarketsInfoIfNotLoaded(marketIds);
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
