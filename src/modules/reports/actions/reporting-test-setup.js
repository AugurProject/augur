import * as AugurJS from '../../../services/augurjs';
import { ding } from '../../../assets/media/sound.js';
import { loadBranch } from '../../app/actions/load-branch';
import { listenToUpdates } from '../../app/actions/listen-to-updates';
import { loadMarkets } from '../../markets/actions/load-markets';
import { loadFullMarket } from '../../market/actions/load-full-market';
import { updateBlockchain } from '../../app/actions/update-blockchain';
import { loadReports } from '../../reports/actions/load-reports';
import { revealReports } from '../../reports/actions/reveal-reports';
// import { penalizeWrongReports } from '../../reports/actions/penalize-wrong-reports';
// import { collectFees } from '../../reports/actions/collect-fees';
// import { closeMarkets } from '../../reports/actions/close-markets';

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
			if (step === 7) ding.play();
			const { selectedMarketID, branch } = getState();
			dispatch(loadMarkets(branch.id));
			if (selectedMarketID !== null) {
				dispatch(loadFullMarket(selectedMarketID));
			}
			dispatch(updateBlockchain(() => {
				// const { marketsData } = getState();
				dispatch(loadReports());
				dispatch(revealReports());
				// dispatch(collectFees());
				// dispatch(penalizeWrongReports(marketsData));
				// dispatch(closeMarkets(marketsData));
				dispatch(listenToUpdates());
			}));
		});
	};
}
