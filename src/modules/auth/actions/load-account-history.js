import { clearReports } from '../../../modules/reports/actions/update-reports';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { loadBidsAsksHistory } from '../../../modules/bids-asks/actions/load-bids-asks-history';
import { loadCreateMarketHistory } from '../../../modules/create-market/actions/load-create-market-history';
import { loadFundingHistory, loadTransferHistory } from '../../../modules/account/actions/load-funding-history';
import { loadReportingHistory } from '../../../modules/my-reports/actions/load-reporting-history';
import { syncBranch } from '../../../modules/branch/actions/sync-branch';

export const loadAccountHistory = () => (dispatch, getState) => {
  dispatch(loadAccountTrades());
  dispatch(loadBidsAsksHistory());
  dispatch(loadFundingHistory());
  dispatch(loadTransferHistory());
  dispatch(loadCreateMarketHistory());
  dispatch(clearReports());
  dispatch(loadReportingHistory());
  dispatch(syncBranch());
};
