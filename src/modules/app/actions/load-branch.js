import { augur } from '../../../services/augurjs';
import { updateBranch } from '../../app/actions/update-branch';
import { updateBlockchain } from '../../app/actions/update-blockchain';
import { listenToUpdates } from '../../app/actions/listen-to-updates';
import { loadMarkets } from '../../markets/actions/load-markets';
import { loadFullMarket } from '../../market/actions/load-full-market';
import { clearMarketsData } from '../../markets/actions/update-markets-data';

export function loadBranch(branchID) {
	return (dispatch, getState) => {
		dispatch(clearMarketsData());

		augur.loadBranch(branchID, (err, branch) => {
			if (err) return console.log('ERROR loadBranch', err);

			dispatch(updateBranch(branch));
			dispatch(loadMarkets(branchID));

			const { selectedMarketID } = getState();
			if (selectedMarketID !== null) {
				dispatch(loadFullMarket(selectedMarketID));
			}

			dispatch(updateBlockchain(true, () => {
				dispatch(listenToUpdates());
			}));
		});
	};
}
