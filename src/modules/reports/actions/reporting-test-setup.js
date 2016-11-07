import * as AugurJS from '../../../services/augurjs';
import { loadBranch } from '../../app/actions/load-branch';
import { loadMarkets } from '../../markets/actions/load-markets';
import { loadFullMarket } from '../../market/actions/load-full-market';
import { syncBlockchain } from '../../app/actions/update-blockchain';
import { syncBranch } from '../../app/actions/update-branch';
import { loadReports } from '../../reports/actions/load-reports';
import { clearOldReports } from '../../reports/actions/clear-old-reports';

export const REPORTING_TEST_SETUP = 'REPORTING_TEST_SETUP';

export function reportingTestSetup(branchID) {
	return (dispatch, getState) => {
		const periodLength = 1200;
		console.warn('Found reportingTest=true in env.json');
		console.info('*** STARTING REPORTING SETUP SEQUENCE ***');
		dispatch({ type: REPORTING_TEST_SETUP, data: { periodLength } });
		AugurJS.reportingTestSetup(periodLength, branchID, (err, step, branchID) => {
			if (err) return console.error('reportingTestSetup failed:', err);
			console.info('*** REPORTING SETUP STEP', step, 'COMPLETE***');
			if (branchID) return dispatch(loadBranch(branchID));
			const { selectedMarketID, branch } = getState();
			dispatch(loadMarkets(branch.id));
			if (selectedMarketID !== null) {
				dispatch(loadFullMarket(selectedMarketID));
			}
			console.log('[REPORTING TEST SETUP] updating blockchain...');
			dispatch(syncBlockchain());
			dispatch(syncBranch((err, reportPeriod) => {
				if (err) console.error('syncBranch error:', err);
				console.log('[REPORTING TEST SETUP] report period:', reportPeriod);
				console.log('[REPORTING TEST SETUP] synched branch, loading reports...');
				dispatch(clearOldReports());
				dispatch(loadReports((err) => {
					console.log('[REPORTING TEST SETUP] reports loaded!', err);
				}));
			}));
		});
	};
}
