import { augur } from 'services/augurjs';
import { updateBranch } from 'modules/branch/actions/update-branch';
import { syncBranch } from 'modules/branch/actions/sync-branch';
import { reportingCycle } from 'modules/branch/selectors/reporting-cycle';
import { syncBlockchain } from 'modules/app/actions/sync-blockchain';
import { listenToUpdates } from 'modules/app/actions/listen-to-updates';
import { loadTopics } from 'modules/topics/actions/load-topics';
import { loadFullMarket } from 'modules/market/actions/load-full-market';
import { clearMarketsData } from 'modules/markets/actions/update-markets-data';

export const loadBranch = branchID => (dispatch, getState) => {
  dispatch(clearMarketsData());
  augur.loadBranch(branchID, (err, branch) => {
    if (err) return console.log('ERROR loadBranch', err);
    dispatch(updateBranch(branch));
    dispatch(updateBranch(getReportingCycle()));
    const { selectedMarketID } = getState();
    if (selectedMarketID !== null) {
      dispatch(loadFullMarket(selectedMarketID));
    }
    dispatch(loadTopics(branchID));
    dispatch(syncBlockchain());
    dispatch(syncBranch((err) => {
      if (err) console.error('syncBranch:', err);
      dispatch(listenToUpdates());
    }));
  });
};
