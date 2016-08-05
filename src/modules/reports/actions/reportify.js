import * as AugurJS from '../../../services/augurjs';
import { updateBranch } from '../../app/actions/update-branch';
import { listenToUpdates } from '../../app/actions/listen-to-updates';
import { loadMarkets } from '../../markets/actions/load-markets';
import { loadFullMarket } from '../../market/actions/load-full-market';
import { updateBlockchain } from '../../app/actions/update-blockchain';
import { loadReports } from './load-reports';
// import { revealReports } from '../../reports/actions/reveal-reports';
// import { penalizeWrongReports } from '../../reports/actions/penalize-wrong-reports';
// import { collectFees } from '../../reports/actions/collect-fees';
// import { closeMarkets } from '../../reports/actions/close-markets';

export const REPORTIFY = 'REPORTIFY';

export function reportify() {
	return (dispatch, getState) => {
		const { loginAccount, blockchain, branch } = getState();
		if (!loginAccount || !loginAccount.id || !branch.id || !blockchain.reportPeriod) {
			return;
		}
		const periodLength = 900;
		console.log('Reportifying...');
		dispatch({ type: REPORTIFY, data: { periodLength } });
		AugurJS.reportify(periodLength, (err, step, branch) => {
			if (err) return console.error('reportify failed:', err);
			console.log('reportify step', step, 'complete');
			if (branch) return dispatch(updateBranch(branch));
			dispatch(loadMarkets());
			const { selectedMarketID } = getState();
			if (selectedMarketID !== null) {
				dispatch(loadFullMarket(selectedMarketID));
			}
			dispatch(updateBlockchain(() => {
				const { marketsData } = getState();
				dispatch(loadReports(marketsData));
				// dispatch(revealReports());
				// dispatch(collectFees());
				// dispatch(penalizeWrongReports(marketsData));
				// dispatch(closeMarkets(marketsData));
				dispatch(listenToUpdates());
			}));
		});
	};
}
