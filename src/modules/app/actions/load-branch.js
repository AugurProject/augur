import * as AugurJS from '../../../services/augurjs';

import { updateBranch } from '../../app/actions/update-branch';
import { updateBlockchain } from '../../app/actions/update-blockchain';
import { listenToUpdates } from '../../app/actions/listen-to-updates';
import { loadMarkets } from '../../markets/actions/load-markets';
import { loadFullMarket } from '../../market/actions/load-full-market';
import { loadReports } from '../../reports/actions/load-reports';
import { clearMarketsData } from '../../markets/actions/update-markets-data';
import { revealReports } from '../../reports/actions/reveal-reports';
import { checkPeriod } from '../../reports/actions/check-period';
import { collectFees } from '../../reports/actions/collect-fees';

export function loadBranch(branchID) {
	return (dispatch, getState) => {
		dispatch(clearMarketsData());
		console.log('Cleared markets data, loading branch', branchID);

		AugurJS.loadBranch(branchID, (err, branch) => {
			if (err) return console.log('ERROR loadBranch', err);

			dispatch(updateBranch(branch));
			dispatch(loadMarkets(branchID));

			const { selectedMarketID } = getState();
			if (selectedMarketID !== null) {
				dispatch(loadFullMarket(selectedMarketID));
			}

			dispatch(updateBlockchain(() => {
				dispatch(loadReports((err) => {
					dispatch(revealReports());
					dispatch(collectFees());
					dispatch(checkPeriod());
					dispatch(listenToUpdates());
				}));
			}));
		});
	};
}
