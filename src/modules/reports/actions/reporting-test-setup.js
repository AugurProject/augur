import * as AugurJS from '../../../services/augurjs';
import { loadBranch } from '../../app/actions/load-branch';
import { loadMarkets } from '../../markets/actions/load-markets';
import { loadFullMarket } from '../../market/actions/load-full-market';
import { syncBlockchain } from '../../app/actions/update-blockchain';
import { syncBranch } from '../../app/actions/update-branch';
import { loadReports } from '../../reports/actions/load-reports';

export const REPORTING_TEST_SETUP = 'REPORTING_TEST_SETUP';

export function reportingTestSetup() {
	return (dispatch, getState) => {
		const periodLength = 900;
		console.warn('Found reportingTest=true in env.json');
		console.info('*** STARTING REPORTING SETUP SEQUENCE ***');
		dispatch({ type: REPORTING_TEST_SETUP, data: { periodLength } });
		AugurJS.reportingTestSetup(periodLength, (err, step, newBranchID) => {
			if (err) return console.error('reportingTestSetup failed:', err);
			console.info('*** REPORTING SETUP STEP', step, 'COMPLETE***');
			if (newBranchID) return dispatch(loadBranch(newBranchID));
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
				dispatch(loadReports((err) => {
					console.log('[REPORTING TEST SETUP] reports loaded!', err);
				}));
			}));
		});
	};
}
