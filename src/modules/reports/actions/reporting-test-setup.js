import * as AugurJS from 'services/augurjs';
import { loadBranch } from 'modules/app/actions/load-branch';
import { loadMarkets } from 'modules/markets/actions/load-markets';
import { loadFullMarket } from 'modules/market/actions/load-full-market';
import { syncBlockchain } from 'modules/app/actions/sync-blockchain';
import { syncBranch } from 'modules/branch/actions/sync-branch';
import { updateAssets } from 'modules/auth/actions/update-assets';

export const REPORTING_TEST_SETUP = 'REPORTING_TEST_SETUP';

export const reportingTestSetup = branchID => (dispatch, getState) => {
  const periodLength = 300;
  console.warn('Found reportingTest=true in env.json');
  console.info('*** STARTING REPORTING SETUP SEQUENCE ***');
  dispatch({ type: REPORTING_TEST_SETUP, data: { periodLength } });
  AugurJS.reportingTestSetup(periodLength, branchID, (err, step, branchID) => {
    if (err) return console.error('reportingTestSetup failed:', err);
    console.info('*** REPORTING SETUP STEP', step, 'COMPLETE***');
    if (branchID) return dispatch(loadBranch(branchID));
    const { selectedMarketID, branch } = getState();
    dispatch(updateAssets());
    dispatch(loadMarkets(branch.id));
    if (selectedMarketID !== null) {
      dispatch(loadFullMarket(selectedMarketID));
    }
    console.log('[REPORTING TEST SETUP] updating blockchain...');
    dispatch(syncBlockchain());
    dispatch(syncBranch((err, reportPeriod) => {
      if (err) console.error('syncBranch error:', err);
      console.log('[REPORTING TEST SETUP] report period:', reportPeriod);
    }));
  });
};
