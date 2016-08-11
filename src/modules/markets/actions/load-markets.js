import { augur } from '../../../services/augurjs';
import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadMarkets(branchID) {
	const chunkSize = 10;
	return (dispatch) => {
		console.log('loadMarkets:', branchID);
		augur.loadMarkets(branchID, chunkSize, true, (err, marketsData) => {
			if (err) {
				console.log('ERROR loadMarkets()', err);
				return;
			}
			if (!marketsData) {
				console.log('WARN loadMarkets()', 'no markets data returned');
				return;
			}
			dispatch(updateMarketsData(marketsData));
		});
	};
}
