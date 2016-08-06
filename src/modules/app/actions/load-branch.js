import * as AugurJS from '../../../services/augurjs';

import { updateBranch } from '../../app/actions/update-branch';
import { updateBlockchain } from '../../app/actions/update-blockchain';
import { listenToUpdates } from '../../app/actions/listen-to-updates';
import { loadMarkets } from '../../markets/actions/load-markets';
import { loadFullMarket } from '../../market/actions/load-full-market';
import { loadReports } from '../../reports/actions/load-reports';
import { clearMarketsData } from '../../markets/actions/update-markets-data';
// import { revealReports } from '../../reports/actions/reveal-reports';
// import { penalizeWrongReports } from '../../reports/actions/penalize-wrong-reports';
// import { collectFees } from '../../reports/actions/collect-fees';
// import { closeMarkets } from '../../reports/actions/close-markets';

export function loadBranch(branchID) {
	return (dispatch, getState) => {
		dispatch(clearMarketsData());
		console.log('Cleared markets data, loading branch', branchID);

		AugurJS.loadBranch(branchID, (err, branch) => {
			if (err) return console.log('ERROR loadBranch', err);

			dispatch(updateBranch(branch));
			dispatch(loadMarkets(branch.id));

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
