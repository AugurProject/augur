import { augur } from '../../../services/augurjs';
import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadMarkets(branchID) {
	const chunkSize = 10;
	return (dispatch) => {
		augur.loadMarkets(branchID, chunkSize, true, (err, marketsData) => {
			if (err) {
				console.log('ERROR loadMarkets()', err);
				return;
			}
			if (!marketsData) {
				console.log('WARN loadMarkets()', 'no markets data returned');
				return;
			}
			if (marketsData.constructor === Object && Object.keys(marketsData).length) {
				dispatch(updateMarketsData(marketsData));
			}
		});
	};
}
